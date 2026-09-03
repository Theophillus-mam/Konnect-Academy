-- Konnecta Academy — admin role and console
--
-- Everything a learner touches is owner-only, which is right, but it means a
-- school administrator cannot see a single row that is not their own. This
-- migration adds an admin flag, widens the policies for admins only, and
-- exposes three read functions so the console does not have to pull every
-- xp_events row into the browser to count them.
--
-- Run this after 0004_pronunciation.sql.
--
-- To make the first admin, run this once with your own address:
--   update profiles set is_admin = true where email = 'you@example.com';

alter table profiles add column if not exists is_admin boolean not null default false;

create index if not exists profiles_is_admin_idx on profiles (is_admin) where is_admin;

-- ===========================================================================
-- The role check
--
-- security definer, so it reads profiles without going back through row level
-- security. Without that, a policy on profiles that asks "is this caller an
-- admin?" would have to read profiles to answer, and Postgres would recurse.
-- ===========================================================================

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = uid), false);
$$;

revoke all on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated;

-- ===========================================================================
-- Admin read access
--
-- These sit alongside the existing owner-only policies. Postgres ORs multiple
-- permissive policies together, so a learner still reaches their own rows and
-- an admin additionally reaches everyone's. Nothing here grants anon access.
-- ===========================================================================

drop policy if exists "admins read all profiles" on public.profiles;
drop policy if exists "admins update profiles"   on public.profiles;

create policy "admins read all profiles" on public.profiles for select to authenticated
  using (public.is_admin());
create policy "admins update profiles" on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array[
    'enrollments', 'user_skills', 'lesson_completions', 'vocab_mastery',
    'tutor_sessions', 'xp_events'
  ]
  loop
    execute format('drop policy if exists "admins read all" on public.%I', t);
    execute format(
      'create policy "admins read all" on public.%I for select to authenticated using (public.is_admin())', t);
  end loop;

  -- Only present once 0004 has run.
  if to_regclass('public.pronunciation_attempts') is not null then
    execute 'drop policy if exists "admins read all" on public.pronunciation_attempts';
    execute 'create policy "admins read all" on public.pronunciation_attempts
               for select to authenticated using (public.is_admin())';
  end if;
end $$;

-- ===========================================================================
-- Console queries
--
-- Aggregated in the database. The alternative — selecting every xp_events row
-- and summing in JavaScript — gets slow at a few hundred learners and sends a
-- lot of data to the browser for four numbers.
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

  -- Counted dynamically so this migration still runs if 0004 was skipped.
  if to_regclass('public.pronunciation_attempts') is not null then
    execute 'select count(*) from public.pronunciation_attempts' into recordings;
  end if;

  return json_build_object(
    'learners',          (select count(*) from profiles),
    'admins',            (select count(*) from profiles where is_admin),
    'signups_7d',        (select count(*) from profiles where created_at > now() - interval '7 days'),
    'placed',            (select count(*) from enrollments where placed_at is not null),
    'active_7d',         (select count(distinct user_id) from xp_events
                           where occurred_at > now() - interval '7 days'),
    'lessons_completed', (select count(*) from lesson_completions),
    'xp_awarded',        (select coalesce(sum(amount), 0) from xp_events),
    'recordings',        recordings
  );
end;
$$;

create or replace function public.admin_learner_rows()
returns table (
  user_id        uuid,
  display_name   text,
  email          text,
  is_admin       boolean,
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
      p.id,
      p.display_name,
      p.email,
      p.is_admin,
      p.created_at,
      c.title,
      e.level_code,
      e.placed_at,
      coalesce(lc.n, 0),
      coalesce(vm.n, 0),
      coalesce(xp.total, 0),
      xp.last_at
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
    order by p.created_at desc;
end;
$$;

create or replace function public.admin_course_rows()
returns table (
  course_id  uuid,
  title      text,
  language   text,
  is_active  boolean,
  learners   bigint,
  placed     bigint,
  lessons    bigint,
  vocabulary bigint
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
      c.id,
      c.title,
      l.name,
      l.is_active,
      coalesce(en.n, 0),
      coalesce(en.p, 0),
      coalesce(ls.n, 0),
      coalesce(vb.n, 0)
    from courses c
    join languages l on l.id = c.language_id
    left join lateral (
      select count(*) as n, count(*) filter (where e.placed_at is not null) as p
        from enrollments e where e.course_id = c.id
    ) en on true
    left join lateral (
      select count(*) as n from lessons le
        join modules m on m.id = le.module_id
       where m.course_id = c.id
    ) ls on true
    left join lateral (
      select count(*) as n from vocabulary v where v.course_id = c.id
    ) vb on true
    order by l.sort_order, c.sort_order;
end;
$$;

-- ===========================================================================
-- Granting and revoking admin
--
-- Goes through a function rather than a plain update so the self-demotion
-- guard cannot be forgotten. Locking the last admin out of the console is
-- recoverable only from the SQL editor.
-- ===========================================================================

create or replace function public.admin_set_role(target uuid, make_admin boolean)
returns json
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  updated profiles;
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  if target = auth.uid() and make_admin = false then
    raise exception 'You cannot remove your own admin access.' using errcode = '42501';
  end if;

  if make_admin = false and (select count(*) from profiles where is_admin) <= 1 then
    raise exception 'At least one administrator must remain.' using errcode = '42501';
  end if;

  update profiles
     set is_admin = make_admin,
         updated_at = now()
   where id = target
  returning * into updated;

  if updated.id is null then
    raise exception 'No learner with that id.' using errcode = 'P0002';
  end if;

  return json_build_object('id', updated.id, 'is_admin', updated.is_admin);
end;
$$;

revoke all on function public.admin_overview()                    from public, anon;
revoke all on function public.admin_learner_rows()                from public, anon;
revoke all on function public.admin_course_rows()                 from public, anon;
revoke all on function public.admin_set_role(uuid, boolean)       from public, anon;

grant execute on function public.admin_overview()                 to authenticated;
grant execute on function public.admin_learner_rows()             to authenticated;
grant execute on function public.admin_course_rows()              to authenticated;
grant execute on function public.admin_set_role(uuid, boolean)    to authenticated;
