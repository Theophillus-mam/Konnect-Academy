-- Konnecta Academy — the ambiguous pronunciation verdict
--
-- 0004 constrained verdict to match, close, different and unclear. The checker
-- now has a fifth outcome: the transcript matched, but the target word has
-- homophones, so a textual comparison cannot be evidence that the right word
-- was said. Saving one of those attempts would fail the CHECK, so the
-- constraint is widened here.
--
-- Run this after 0007_admin_accounts.sql.

-- Dropped by lookup rather than by name: an inline column CHECK is normally
-- named <table>_<column>_check, but Postgres appends a digit if that name is
-- already taken, so hard-coding it can silently miss.
do $$
declare c text;
begin
  for c in
    select con.conname
      from pg_constraint con
      join pg_class rel on rel.oid = con.conrelid
      join pg_namespace ns on ns.oid = rel.relnamespace
     where ns.nspname = 'public'
       and rel.relname = 'pronunciation_attempts'
       and con.contype = 'c'
       and pg_get_constraintdef(con.oid) ilike '%verdict%'
  loop
    execute format('alter table public.pronunciation_attempts drop constraint %I', c);
  end loop;
end $$;

alter table pronunciation_attempts
  add constraint pronunciation_attempts_verdict_check
  check (verdict in ('match', 'close', 'different', 'unclear', 'ambiguous'));

comment on column pronunciation_attempts.verdict is
  'match: transcript equalled the target. ambiguous: transcript matched but the '
  'word has homophones, so speech-to-text cannot confirm which was said. '
  'close: near miss on a phrase. different: something else. unclear: nothing '
  'usable heard, or the recogniser reported low confidence.';
