-- Konnecta Academy — row level security
--
-- Course content is public read-only (the anon key can fetch it, nobody can
-- write it from the client). Learner data is readable and writable only by
-- the learner it belongs to.

-- ===========================================================================
-- Content: readable by anyone, writable by nobody through the API
-- ===========================================================================

do $$
declare t text;
begin
  foreach t in array array[
    'languages', 'courses', 'cefr_levels', 'modules', 'lessons',
    'lesson_questions', 'lesson_options', 'placement_questions',
    'placement_options', 'vocabulary', 'practice_modules',
    'practice_exercises', 'tutor_scenarios', 'tutor_turns', 'tutor_replies'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "content is readable" on public.%I', t);
    execute format(
      'create policy "content is readable" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

-- ===========================================================================
-- Learner data: owner only
-- ===========================================================================

alter table public.profiles enable row level security;

drop policy if exists "read own profile"   on public.profiles;
drop policy if exists "insert own profile" on public.profiles;
drop policy if exists "update own profile" on public.profiles;

create policy "read own profile"   on public.profiles for select to authenticated using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array[
    'user_skills', 'lesson_completions', 'vocab_mastery', 'tutor_sessions', 'xp_events'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "owner reads"   on public.%I', t);
    execute format('drop policy if exists "owner inserts" on public.%I', t);
    execute format('drop policy if exists "owner updates" on public.%I', t);
    execute format('drop policy if exists "owner deletes" on public.%I', t);

    execute format('create policy "owner reads"   on public.%I for select to authenticated using (auth.uid() = user_id)', t);
    execute format('create policy "owner inserts" on public.%I for insert to authenticated with check (auth.uid() = user_id)', t);
    execute format('create policy "owner updates" on public.%I for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
    execute format('create policy "owner deletes" on public.%I for delete to authenticated using (auth.uid() = user_id)', t);
  end loop;
end $$;

-- ===========================================================================
-- Grants
--
-- Supabase grants the anon and authenticated roles broad table privileges by
-- default. RLS alone would still block writes to content (a table with no
-- INSERT policy denies inserts), but revoking the privilege as well means a
-- future policy added by mistake cannot quietly open content up to editing.
-- ===========================================================================

grant usage on schema public to anon, authenticated;

do $$
declare t text;
begin
  foreach t in array array[
    'languages', 'courses', 'cefr_levels', 'modules', 'lessons',
    'lesson_questions', 'lesson_options', 'placement_questions',
    'placement_options', 'vocabulary', 'practice_modules',
    'practice_exercises', 'tutor_scenarios', 'tutor_turns', 'tutor_replies'
  ]
  loop
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
  end loop;

  foreach t in array array[
    'profiles', 'user_skills', 'lesson_completions',
    'vocab_mastery', 'tutor_sessions', 'xp_events'
  ]
  loop
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;
