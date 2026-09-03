-- Konnect Academy — multilingual enrolment
--
-- Before this migration a learner had one CEFR level (profiles.level_code) and
-- one set of skill scores. That only works while a single language is active.
-- A learner studying French and Portuguese is B1 in one and A2 in the other,
-- so level and skills move to a per-course enrolment.

-- ===========================================================================
-- Enrolments
-- ===========================================================================

create table if not exists enrollments (
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references courses(id) on delete cascade,
  level_code  text references cefr_levels(code),
  placed_at   timestamptz,
  started_at  timestamptz not null default now(),
  primary key (user_id, course_id)
);

create index if not exists enrollments_user_idx on enrollments (user_id);

-- Skills are per course as well: the placement test is language-specific.
alter table user_skills add column if not exists course_id uuid references courses(id) on delete cascade;

-- Existing rows belong to whichever course the learner was already on.
update user_skills s
   set course_id = p.course_id
  from profiles p
 where s.user_id = p.id
   and s.course_id is null;

-- Drop any skill rows that cannot be attributed, then make the column required
-- and put the course into the primary key.
delete from user_skills where course_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
     where table_name = 'user_skills' and constraint_type = 'PRIMARY KEY'
       and constraint_name = 'user_skills_pkey'
  ) then
    alter table user_skills drop constraint user_skills_pkey;
  end if;
end $$;

alter table user_skills alter column course_id set not null;
alter table user_skills add primary key (user_id, course_id, skill);

-- Tag XP with the course it was earned in. The streak stays school-wide -
-- studying any language keeps it alive - but per-course reporting is possible.
alter table xp_events add column if not exists course_id uuid references courses(id) on delete set null;

-- Carry existing learners across so nobody loses their placement.
insert into enrollments (user_id, course_id, level_code, placed_at)
select p.id, p.course_id, p.level_code, p.placed_at
  from profiles p
 where p.course_id is not null
on conflict (user_id, course_id) do nothing;

comment on column profiles.course_id is
  'The course the learner is currently studying. Level and placement now live in enrollments.';

-- ===========================================================================
-- Security for the new table
-- ===========================================================================

alter table enrollments enable row level security;

drop policy if exists "owner reads"   on enrollments;
drop policy if exists "owner inserts" on enrollments;
drop policy if exists "owner updates" on enrollments;
drop policy if exists "owner deletes" on enrollments;

create policy "owner reads"   on enrollments for select to authenticated using (auth.uid() = user_id);
create policy "owner inserts" on enrollments for insert to authenticated with check (auth.uid() = user_id);
create policy "owner updates" on enrollments for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner deletes" on enrollments for delete to authenticated using (auth.uid() = user_id);

revoke all on enrollments from anon;
grant select, insert, update, delete on enrollments to authenticated;
