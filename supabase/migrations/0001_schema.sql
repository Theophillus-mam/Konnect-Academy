-- Konnecta Academy — schema
-- Content tables are readable by everyone; progress tables are per-learner.

create extension if not exists pgcrypto;

-- ===========================================================================
-- Content
-- ===========================================================================

create table if not exists languages (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  is_active   boolean not null default false,
  sort_order  int  not null default 0
);

create table if not exists courses (
  id           uuid primary key default gen_random_uuid(),
  language_id  uuid not null references languages(id) on delete cascade,
  code         text not null,
  title        text not null,
  description  text,
  sort_order   int  not null default 0,
  unique (language_id, code)
);

create table if not exists cefr_levels (
  code        text primary key,
  name        text not null,
  min_points  int  not null,
  sort_order  int  not null default 0
);

create table if not exists modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  slug        text not null,
  title       text not null,
  icon        text,
  blurb       text,
  sort_order  int  not null default 0,
  unique (course_id, slug)
);

create table if not exists lessons (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references modules(id) on delete cascade,
  slug         text not null,
  title        text not null,
  tag          text,
  description  text,
  est_minutes  int  not null default 15,
  sort_order   int  not null default 0,
  unique (module_id, slug)
);

create table if not exists lesson_questions (
  id           uuid primary key default gen_random_uuid(),
  lesson_id    uuid not null references lessons(id) on delete cascade,
  sort_order   int  not null default 0,
  prompt       text not null,
  explanation  text,
  quote_from   text,
  quote_text   text,
  audio_url    text
);

create table if not exists lesson_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references lesson_questions(id) on delete cascade,
  sort_order   int  not null default 0,
  body         text not null,
  is_correct   boolean not null default false
);

create table if not exists placement_questions (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  skill       text not null,
  tag         text,
  context     text,
  prompt      text not null,
  sort_order  int  not null default 0
);

create table if not exists placement_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references placement_questions(id) on delete cascade,
  sort_order   int  not null default 0,
  body         text not null,
  points       int  not null default 0
);

create table if not exists vocabulary (
  id              uuid primary key default gen_random_uuid(),
  course_id       uuid not null references courses(id) on delete cascade,
  word            text not null,
  part_of_speech  text,
  definition      text not null,
  example         text,
  sort_order      int  not null default 0
);

create table if not exists practice_modules (
  id             uuid primary key default gen_random_uuid(),
  course_id      uuid not null references courses(id) on delete cascade,
  slug           text not null,
  name           text not null,
  icon           text,
  description    text,
  tone           text,
  target_screen  text,
  sort_order     int  not null default 0,
  unique (course_id, slug)
);

-- Exercises are rows so the Practice Hub can count them instead of
-- printing a number that was typed into the component.
create table if not exists practice_exercises (
  id                  uuid primary key default gen_random_uuid(),
  practice_module_id  uuid not null references practice_modules(id) on delete cascade,
  title               text not null,
  sort_order          int  not null default 0
);

create table if not exists tutor_scenarios (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  slug        text not null,
  title       text not null,
  level_code  text references cefr_levels(code),
  sort_order  int  not null default 0,
  unique (course_id, slug)
);

create table if not exists tutor_turns (
  id           uuid primary key default gen_random_uuid(),
  scenario_id  uuid not null references tutor_scenarios(id) on delete cascade,
  sort_order   int  not null default 0,
  goal         text,
  prompt       text not null,
  follow_up    text
);

create table if not exists tutor_replies (
  id             uuid primary key default gen_random_uuid(),
  turn_id        uuid not null references tutor_turns(id) on delete cascade,
  sort_order     int  not null default 0,
  body           text not null,
  score          int  not null default 0,
  feedback_kind  text check (feedback_kind in ('good', 'note', 'fix')),
  feedback_body  text,
  fix_before     text,
  fix_after      text
);

-- ===========================================================================
-- Learner data
-- ===========================================================================

create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  email           text,
  learning_goal   text,
  course_id       uuid references courses(id) on delete set null,
  level_code      text references cefr_levels(code),
  placed_at       timestamptz,
  weekly_goal_xp  int not null default 500,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists user_skills (
  user_id     uuid not null references auth.users(id) on delete cascade,
  skill       text not null,
  score       int  not null check (score between 0 and 100),
  updated_at  timestamptz not null default now(),
  primary key (user_id, skill)
);

create table if not exists lesson_completions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  lesson_id      uuid not null references lessons(id) on delete cascade,
  correct_count  int  not null default 0,
  total_count    int  not null default 0,
  xp_earned      int  not null default 0,
  completed_at   timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists vocab_mastery (
  user_id           uuid not null references auth.users(id) on delete cascade,
  vocabulary_id     uuid not null references vocabulary(id) on delete cascade,
  mastery           int  not null default 0 check (mastery between 0 and 3),
  review_count      int  not null default 0,
  last_reviewed_at  timestamptz not null default now(),
  primary key (user_id, vocabulary_id)
);

create table if not exists tutor_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  scenario_id   uuid not null references tutor_scenarios(id) on delete cascade,
  grammar       int,
  vocabulary    int,
  fluency       int,
  overall       int,
  completed_at  timestamptz not null default now()
);

-- Every XP award is an event. Streak and weekly activity are derived from
-- these rows rather than stored as counters that can drift.
create table if not exists xp_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      int  not null,
  source      text not null,
  occurred_at timestamptz not null default now()
);

create index if not exists xp_events_user_time_idx on xp_events (user_id, occurred_at desc);
create index if not exists lesson_completions_user_idx on lesson_completions (user_id);
create index if not exists vocab_mastery_user_idx on vocab_mastery (user_id);

-- ===========================================================================
-- New users get a profile automatically
-- ===========================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email, learning_goal, course_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'learning_goal',
    (select c.id from public.courses c
       join public.languages l on l.id = c.language_id
      where l.code = 'en' order by c.sort_order limit 1)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
