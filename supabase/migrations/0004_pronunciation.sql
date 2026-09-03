-- Konnect Academy — pronunciation recordings
--
-- Learners record themselves saying a vocabulary word. The audio goes to
-- Supabase Storage; this table holds the metadata and the rough speech-to-text
-- check where the browser supports it.

create table if not exists pronunciation_attempts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  course_id      uuid references courses(id) on delete set null,
  vocabulary_id  uuid not null references vocabulary(id) on delete cascade,
  word           text not null,
  storage_path   text,
  mime_type      text,
  duration_ms    int  not null default 0,
  transcript     text,
  -- Deliberately coarse. This comes from browser speech-to-text, not from a
  -- pronunciation model, so it must not be presented as a precise score.
  verdict        text check (verdict in ('match', 'close', 'different', 'unclear')),
  match_score    int  check (match_score between 0 and 100),
  created_at     timestamptz not null default now()
);

create index if not exists pronunciation_user_word_idx
  on pronunciation_attempts (user_id, vocabulary_id, created_at desc);

alter table pronunciation_attempts enable row level security;

drop policy if exists "owner reads"   on pronunciation_attempts;
drop policy if exists "owner inserts" on pronunciation_attempts;
drop policy if exists "owner updates" on pronunciation_attempts;
drop policy if exists "owner deletes" on pronunciation_attempts;

create policy "owner reads"   on pronunciation_attempts for select to authenticated using (auth.uid() = user_id);
create policy "owner inserts" on pronunciation_attempts for insert to authenticated with check (auth.uid() = user_id);
create policy "owner updates" on pronunciation_attempts for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner deletes" on pronunciation_attempts for delete to authenticated using (auth.uid() = user_id);

revoke all on pronunciation_attempts from anon;
grant select, insert, update, delete on pronunciation_attempts to authenticated;

-- ===========================================================================
-- Storage bucket
--
-- Private, so recordings are reachable only through a signed URL. Every object
-- is stored under the learner's own user id, and the policies below key off
-- that first path segment.
-- ===========================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recordings', 'recordings', false, 5242880,
  array['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/mpeg', 'audio/wav']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "learners read own recordings"   on storage.objects;
drop policy if exists "learners upload own recordings" on storage.objects;
drop policy if exists "learners delete own recordings" on storage.objects;

create policy "learners read own recordings" on storage.objects for select to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "learners upload own recordings" on storage.objects for insert to authenticated
  with check (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "learners delete own recordings" on storage.objects for delete to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);
