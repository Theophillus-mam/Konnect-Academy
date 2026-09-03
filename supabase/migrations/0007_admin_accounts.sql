-- Konnect Academy — separate administrator accounts
--
-- 0005 made an administrator a learner with a flag set. This replaces that
-- with a separate account: an admin has a row in admin_users and no learner
-- profile in use, signs in at a different page, and cannot be created by
-- signing up. A learner can no longer be promoted into one.
--
-- public.is_admin() is redefined rather than replaced, so every policy and
-- function written in 0005 and 0006 keeps working untouched.
--
-- Run this after 0006_admin_content.sql.

-- ===========================================================================
-- The account table
-- ===========================================================================

create table if not exists admin_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id) on delete set null,
  last_seen_at timestamptz
);

create unique index if not exists admin_users_email_idx on admin_users (lower(email));

alter table admin_users enable row level security;

-- Carry across anyone who was already an admin under the old flag, so this
-- migration does not lock the current administrators out.
insert into admin_users (id, email, name)
select p.id,
       coalesce(p.email, u.email),
       coalesce(p.display_name, split_part(coalesce(p.email, u.email), '@', 1))
  from profiles p
  join auth.users u on u.id = p.id
 where p.is_admin
on conflict (id) do nothing;

-- ===========================================================================
-- The role check, pointed at the new table
-- ===========================================================================

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users a where a.id = uid);
$$;

drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users" on public.admin_users for select to authenticated
  using (public.is_admin());

-- No direct writes. Granting and revoking goes through the functions below,
-- which is what keeps the last administrator from being removed by accident.
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

-- ===========================================================================
-- Managing administrators
--
-- Creating an auth user needs the service_role key, which must never reach a
-- browser. So the flow is two steps: the person is added under Authentication
-- in the Supabase dashboard, then an existing admin grants them access here by
-- email. admin_grant says so plainly when the account does not exist yet.
-- ===========================================================================

create or replace function public.admin_list()
returns table (
  id           uuid,
  email        text,
  name         text,
  created_at   timestamptz,
  last_seen_at timestamptz,
  is_you       boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  return query
    select a.id, a.email, a.name, a.created_at, a.last_seen_at, (a.id = auth.uid())
      from admin_users a
     order by a.created_at;
end;
$$;

create or replace function public.admin_grant(target_email text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  u auth.users;
  added admin_users;
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  if target_email is null or btrim(target_email) = '' then
    raise exception 'Enter an email address.' using errcode = '22023';
  end if;

  select * into u from auth.users where lower(email) = lower(btrim(target_email));

  if u.id is null then
    raise exception
      'No account exists for %. Add the user under Authentication in Supabase first, then grant access here.',
      btrim(target_email)
      using errcode = 'P0002';
  end if;

  if exists (select 1 from admin_users a where a.id = u.id) then
    raise exception 'That account is already an administrator.' using errcode = '23505';
  end if;

  insert into admin_users (id, email, name, created_by)
  values (
    u.id,
    u.email,
    coalesce(u.raw_user_meta_data ->> 'display_name', split_part(u.email, '@', 1)),
    auth.uid()
  )
  returning * into added;

  return to_jsonb(added);
end;
$$;

create or replace function public.admin_revoke(target uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  gone int;
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  if target = auth.uid() then
    raise exception 'You cannot remove your own access.' using errcode = '42501';
  end if;

  if (select count(*) from admin_users) <= 1 then
    raise exception 'At least one administrator must remain.' using errcode = '42501';
  end if;

  delete from admin_users where id = target;
  get diagnostics gone = row_count;

  if gone = 0 then
    raise exception 'That administrator no longer exists.' using errcode = 'P0002';
  end if;

  return jsonb_build_object('revoked', gone);
end;
$$;

/* Stamped on sign-in so the list can show who is actually using the console. */
create or replace function public.admin_touch()
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  update admin_users set last_seen_at = now() where id = auth.uid();
end;
$$;

-- ===========================================================================
-- Console queries, updated for the split
--
-- Administrators are no longer learners, so they drop out of the learner list
-- and stop being counted as learners.
-- ===========================================================================

create or replace function public.admin_overview()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  recordings bigint := 0;
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  if to_regclass('public.pronunciation_attempts') is not null then
    execute 'select count(*) from public.pronunciation_attempts' into recordings;
  end if;

  return json_build_object(
    'learners',          (select count(*) from profiles p
                           where not exists (select 1 from admin_users a where a.id = p.id)),
    'admins',            (select count(*) from admin_users),
    'signups_7d',        (select count(*) from profiles p
                           where p.created_at > now() - interval '7 days'
                             and not exists (select 1 from admin_users a where a.id = p.id)),
    'placed',            (select count(*) from enrollments where placed_at is not null),
    'active_7d',         (select count(distinct user_id) from xp_events
                           where occurred_at > now() - interval '7 days'),
    'lessons_completed', (select count(*) from lesson_completions),
    'xp_awarded',        (select coalesce(sum(amount), 0) from xp_events),
    'recordings',        recordings
  );
end;
$$;

-- The return type loses is_admin, so the old signature has to go first.
drop function if exists public.admin_learner_rows();

create or replace function public.admin_learner_rows()
returns table (
  user_id        uuid,
  display_name   text,
  email          text,
  created_at     timestamptz,
  course_title   text,
  level_code     text,
  placed_at      timestamptz,
  lessons_done   bigint,
  words_mastered bigint,
  total_xp       bigint,
  last_active    timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  return query
    select
      p.id, p.display_name, p.email, p.created_at,
      c.title, e.level_code, e.placed_at,
      coalesce(lc.n, 0), coalesce(vm.n, 0), coalesce(xp.total, 0), xp.last_at
    from profiles p
    left join courses c
      on c.id = p.course_id
    left join enrollments e
      on e.user_id = p.id and e.course_id = p.course_id
    left join lateral (
      select count(*) as n from lesson_completions l where l.user_id = p.id
    ) lc on true
    left join lateral (
      select count(*) as n from vocab_mastery v where v.user_id = p.id and v.mastery >= 3
    ) vm on true
    left join lateral (
      select sum(x.amount) as total, max(x.occurred_at) as last_at
        from xp_events x where x.user_id = p.id
    ) xp on true
    where not exists (select 1 from admin_users a where a.id = p.id)
    order by p.created_at desc;
end;
$$;

-- ===========================================================================
-- Retiring the flag
-- ===========================================================================

drop function if exists public.admin_set_role(uuid, boolean);

drop policy if exists "admins update profiles" on public.profiles;

alter table profiles drop column if exists is_admin;

revoke all on function public.admin_list()          from public, anon;
revoke all on function public.admin_grant(text)     from public, anon;
revoke all on function public.admin_revoke(uuid)    from public, anon;
revoke all on function public.admin_touch()         from public, anon;

grant execute on function public.admin_list()       to authenticated;
grant execute on function public.admin_grant(text)  to authenticated;
grant execute on function public.admin_revoke(uuid) to authenticated;
grant execute on function public.admin_touch()      to authenticated;
