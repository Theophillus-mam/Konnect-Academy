# Konnect Academy

An interactive English-learning app, built from the `stitch_afrifluent_english` design export.

The ten static screens from the export are implemented as one connected app with shared
state: the placement test sets your level, lessons award XP and unlock the next card,
and vocabulary reviews feed the charts on the progress screen.


## Supabase setup

The app reads all of its content and stores all learner progress in Supabase.
Nothing is hardcoded in the components any more.

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the files in this order:
   - `supabase/migrations/0001_schema.sql` — tables, indexes, new-user trigger
   - `supabase/migrations/0002_rls.sql` — row level security policies and grants
   - `supabase/seed.sql` — the English course content (safe to re-run)
   - `supabase/migrations/0003_multilingual.sql` — per-course enrolment
   - `supabase/seed_fr_pt.sql` — French and Portuguese content, and switches every language on
   - `supabase/migrations/0004_pronunciation.sql` — recordings table and storage bucket
   - `supabase/migrations/0005_admin.sql` — the admin role, its policies, and the console's queries
   - `supabase/migrations/0006_admin_content.sql` — the content editing functions
   - `supabase/migrations/0007_admin_accounts.sql` — separate administrator accounts
   - `supabase/migrations/0008_pronunciation_verdicts.sql` — the ambiguous verdict
3. Copy `.env.example` to `.env` and paste in your project URL and anon key
   from Project Settings → API.
4. `npm install && npm run dev`.

Until `.env` is filled in the app shows a setup screen instead of failing.

### What lives in the database

| Area | Tables |
| --- | --- |
| Catalogue | `languages`, `courses`, `cefr_levels`, `modules`, `lessons` |
| Lesson content | `lesson_questions`, `lesson_options` |
| Placement test | `placement_questions`, `placement_options` |
| Vocabulary | `vocabulary` |
| Practice hub | `practice_modules`, `practice_exercises` |
| Speaking tutor | `tutor_scenarios`, `tutor_turns`, `tutor_replies` |
| Learner progress | `profiles`, `enrollments`, `user_skills`, `lesson_completions`, `vocab_mastery`, `tutor_sessions`, `xp_events` |
| Administration | `profiles.is_admin`, plus the `admin_*` functions |

Content tables are readable by anyone and writable by nobody through the API.
Learner tables are readable and writable only by the learner who owns the row,
enforced by `auth.uid() = user_id` policies.

### Figures that used to be invented

These were literal values typed into components. They are now derived from
rows, in `src/lib/stats.js`:

| Figure | Where it comes from now |
| --- | --- |
| Day streak | consecutive days with an `xp_events` row |
| Weekly activity chart | `xp_events` grouped by day of the current week |
| Weekly XP total | sum of this week's `xp_events` |
| CEFR level and skill bars | `profiles.level_code` and `user_skills`, written by the placement test |
| Lesson unlocking | presence of a `lesson_completions` row |
| Words started / mastered | `vocab_mastery` rows |
| Practice exercise counts | `count` of `practice_exercises` per module |

Because XP is an event log rather than a counter, the streak and the weekly
chart cannot drift away from what the learner actually did.

## Architecture

```
src/
├── lib/
│   ├── supabase.js     # client + isConfigured guard
│   └── stats.js        # pure functions: streak, weekly XP, CEFR banding
├── api/
│   ├── content.js      # loads the course catalogue
│   └── progress.js     # reads and writes learner progress
├── hooks/
│   └── useLearner.js   # session, loading, derived state, mutations
├── components/         # Icon, Bar, Ring, Toast, States
└── screens/            # one file per screen, all take plain props
```

`useLearner` reshapes database rows into the structures the screens already
expected, so the presentation layer did not need rewriting around PostgREST
column names.

## State

All learner state lives in `App.jsx` and is passed down as props. There is no router
and no state library — `s.screen` selects the active screen, which keeps the data flow
easy to follow at this size.

```js
{
  screen, name, placed,
  level, levelName, skills,     // set by the placement test
  xp, goal, streak, week, today,// dashboard + progress figures
  done, activeLesson,           // lesson completion, drives unlocking
  vocab, reviewed,              // spaced-repetition mastery
}
```

Three helpers are threaded down to the screens:

| Helper | Purpose |
| --- | --- |
| `go(screen, extra)` | navigate, optionally patching state (e.g. `activeLesson`) |
| `set(patch)` | merge a patch, or pass a function for updates based on previous state |
| `award(xp, msg)` | add XP, grow today's activity bar, show a toast |

Swapping to a real router or a reducer later means changing `App.jsx` only; the
screens take plain props.

## Design system

`src/styles.css` implements the tokens from the export's `DESIGN.md` as custom
properties, so colour and spacing changes happen in one place.

| Token | Value | Used for |
| --- | --- | --- |
| `--primary` | `#a2390e` | terracotta: primary actions, progress, brand |
| `--secondary` | `#3f6653` | deep forest green: success and completed states |
| `--tertiary` | `#8b4c11` | ochre: badges and accents, used sparingly |
| `--surface` | `#faf8ff` | soft bone background |
| `--on-surface` | `#171b2b` | slate blue text, avoids pure black |

Type is Public Sans throughout, on the 8px spacing rhythm, with content capped at
1140px. Cards use the 8px / 16px radius pair from the spec, and vocabulary cards
keep their 4px terracotta top border.

## Notes and limitations

- **Audio is simulated.** No audio files shipped with the design export, so
  listening questions animate a timeline without sound. `lesson_questions.audio_url`
  is where a real file URL goes.
- **The microphone button submits typed text.** Real speech input needs the Web
  Speech API and a microphone permission prompt.
- **The tutor is scripted,** not a live model. The turns and replies are rows in
  `tutor_turns` and `tutor_replies`; scoring weights the chosen reply.
- **All three languages are active.** English, French and Portuguese each have a
  full course: 6 lessons, a placement test, 8 vocabulary words, 4 practice modules
  and a speaking scenario. The French and Portuguese content is a first pass and
  should be reviewed by a native-speaker teacher before it goes in front of
  paying learners.
- **Email confirmation is on by default in Supabase.** For local testing, turn
  it off under Authentication → Providers → Email, or confirm the address before
  signing in.

## Languages

All three languages are switched on. A learner picks one on the placement screen
or from the sidebar, and can change at any time.

Level and placement are held per course in `enrollments`, and `user_skills` rows
carry a `course_id`. A learner can be B1 in English and A2 in French without one
overwriting the other. Switching language loads that course's modules, lessons,
vocabulary and tutor scenario, and takes the learner to the placement test only
if they have not been placed in that language yet.

The XP streak is deliberately school-wide: studying any language keeps it alive.
`xp_events.course_id` records which course the XP came from if you later want to
report per language.

To add a fourth language, insert a row in `languages`, a `course` pointing at it,
and its content. No migration is needed and no code changes are required.

## Pronunciation recording

On the vocabulary screen a learner can open a recorder for any word, hear a
model pronunciation, record themselves, play it back, and save the attempt.

- **Capture** uses `MediaRecorder`. Clips are capped at 15 seconds and the
  microphone track is released as soon as recording stops, so the browser's
  recording indicator does not stay on.
- **Model pronunciation** uses the browser's own speech synthesis, in the voice
  matching the course language (`en-GB`, `fr-FR`, `pt-PT`). No audio files needed.
- **Storage** is a private Supabase bucket, `recordings`, capped at 5 MB per file.
  Objects are stored under `{user_id}/{vocabulary_id}/{timestamp}.{ext}` and the
  storage policies key off that first path segment, so learners can only reach
  their own clips. Playback uses a signed URL.
- **Metadata** goes to `pronunciation_attempts`, protected by the same
  owner-only policies as the rest of the learner tables.

### On the accuracy check

Where the browser supports it (Chrome and Edge), the recorder runs speech-to-text
while you speak and compares the transcript against the target word, reporting
one of three verdicts: sounds right, close, or not quite.

**This is not a pronunciation score.** It compares words, not sounds, so it
catches the wrong word but cannot judge an accent, and it will misfire on
homophones. Real assessment needs a trained acoustic model — a paid API such as
Azure Pronunciation Assessment or Speechace would be the route if you want a
defensible number. The UI states the limitation next to every verdict rather
than presenting a percentage that looks more meaningful than it is.

Browsers without speech-to-text still record, play back and compare against the
model pronunciation, which is the part that actually helps most learners.

### Requirements

Microphone capture needs a secure context: HTTPS in production, or `localhost`
in development. On a plain-HTTP staging URL the recorder will report that the
browser cannot record.


## Administration

The console is a separate page with its own sign-in, at `/admin`. It is a
second Vite entry point (`admin.html`), not a route inside the learner app, so
none of its code ships in the learner bundle.

An administrator is a separate account, not a learner with a flag set. There
is no way to promote a learner and no sign-up form on the console.

### Making the first administrator

1. In Supabase, go to Authentication → Users → Add user, and create the account
   with an email and password.
2. Run this once in the SQL editor:

```sql
insert into admin_users (id, email, name)
select id, email, split_part(email, '@', 1)
  from auth.users
 where email = 'you@school.org';
```

After that, administrators are added from the console itself: create the user
under Authentication in Supabase, then grant them access on the Administrators
tab. Creating auth users needs the service_role key, which must never reach a
browser, which is why that step stays in the dashboard.

Anyone upgrading from the previous version is carried across automatically —
`0007` copies everyone who had `profiles.is_admin` set into `admin_users`
before dropping the column.

### What the console holds

Four tabs.

**Overview** — learners, sign-ups this week, learners active this week,
learners placed, lessons completed, XP awarded, recordings saved and the admin
count, then a per-course summary. Administrator accounts are excluded from the
learner figures.

**Learners** — one row each: name, email, course, CEFR level, lessons
completed, words mastered, total XP, last active. Searchable, sortable on any
column, exportable as CSV.

**Content** — the course material itself, editable in place. It opens on the
list of languages and drills down through the model:

```
Languages
└── Courses
    ├── Modules ── Lessons ── Questions ── Answers
    ├── Vocabulary
    ├── Placement test ── Answers
    ├── Practice ── Exercises
    └── Tutor scenarios ── Turns ── Replies
```

A breadcrumb tracks where you are, tabs switch between the tables that hang off
the same parent, and every level supports add, edit, reorder and delete. Delete
says what the cascade will take with it before it does anything.

`cefr_levels` is deliberately not editable. The CEFR ladder is fixed, other
tables reference it by code, and it is keyed on `code` rather than `id`.

**Administrators** — who can open the console. Access is granted by email and
revoked by row. You cannot remove your own access, and the last administrator
cannot be removed at all: recovering from that needs the SQL editor.

### Two sign-ins, one Supabase project

Supabase Auth is a single user pool, so the separation is enforced in three
places rather than by running a second auth backend:

- **Separate sessions.** Both pages are served from the same origin and so
  share `localStorage`. The console's client uses its own `storageKey`
  (`konnect-admin-auth`), so the two sessions are independent: you can be
  signed in as an administrator on `/admin` and as a learner on `/` in the same
  browser, and signing out of one leaves the other alone. Without this, one
  sign-in would silently overwrite the other.
- **The console refuses learner accounts.** A learner's password will open a
  Supabase session, so membership of `admin_users` is checked before the
  console renders — on sign-in and again on every page load, not only once.
  The refusal is worded the same as a wrong password, so the form cannot be
  used to find out which addresses exist.
- **The learner app refuses administrator accounts.** They have no learner
  profile worth showing, so they are turned away and pointed at `/admin`.

None of this is what protects the data. That is row level security: every
policy and function still asks `public.is_admin()`, which `0007` redefines to
read `admin_users`. A stolen learner token cannot read another learner's rows
whatever page it is used on.

### How the permissions work

Learner tables stay owner-only. `0005_admin.sql` adds a second, permissive
policy to each one for admins; Postgres ORs permissive policies together, so a
learner still sees only their own rows and an admin additionally sees
everyone's. `anon` gains nothing.

The check itself lives in `public.is_admin()`, which is `security definer` so
that it can read its table without going back through row level security — a
policy that had to read a table to evaluate itself would recurse.

The console reads learner data through `security definer` functions rather than
selecting the tables directly:

| Function | Returns |
| --- | --- |
| `admin_overview()` | The headline figures, counted in the database |
| `admin_learner_rows()` | One aggregated row per learner, administrators excluded |
| `admin_course_rows()` | One row per course |
| `admin_list()` | The administrator accounts |
| `admin_grant(email)` / `admin_revoke(id)` | Console access |

Each one raises `42501` if the caller is not an admin, so a learner who calls
the endpoint directly gets a refusal rather than a filtered result they might
mistake for the whole school. Aggregating in SQL also keeps the browser from
downloading every `xp_events` row just to total it.

### How content editing works

`0002_rls.sql` revokes insert, update and delete on every content table from
the `authenticated` role, so that a policy added by mistake later cannot
quietly open content up to editing. `0006_admin_content.sql` keeps that: the
grants stay revoked and editing goes through `security definer` functions
instead.

| Function | Does |
| --- | --- |
| `admin_content_save(entity, payload, row_id)` | Inserts when `row_id` is null, updates otherwise |
| `admin_content_delete(entity, row_id)` | Deletes one row, cascading as the foreign keys say |
| `admin_content_swap_order(entity, id_a, id_b)` | Swaps two `sort_order` values in one statement |

`entity` is checked against a fixed list of content tables, so the functions
cannot be pointed at `profiles`. Only the keys present in the payload are
written, which means a column left out of a form keeps its default on insert
and its current value on update, and keys that are not columns of the table are
ignored rather than raising.

Reordering is one statement so a failed second update cannot leave two rows
sharing a position.

### Adding a field to a form

`src/lib/contentModel.js` describes every editable table: the fields the form
shows, the columns the list shows, and what hangs off it. The content browser
is generic and reads it all from there, so adding a column to a form is a line
in that file rather than a new screen. The database functions pick up the new
column automatically, since they resolve columns from `information_schema` at
call time.

### Deploying the console

`npm run build` produces two pages: `dist/index.html` for learners and
`dist/admin.html` for the console. `vercel.json` rewrites `/admin` to
`/admin.html` so the tidy URL works; without it the console is still reachable
at `/admin.html`. `admin.html` carries `noindex, nofollow`.

## Signing up

Sign-up hands the learner to the sign-in form rather than leaving them on a
form that appears to have done nothing:

- **Email confirmation on** (the Supabase default) — no session comes back, so
  the form switches to sign-in, keeps the email address, clears the password,
  and says to check the inbox first.
- **Email confirmation off** — a session comes back and the auth listener
  routes straight to the placement test, as before.
- **Address already registered** — Supabase answers with a user carrying no
  identities rather than an error, so the account cannot be probed for. The
  form switches to sign-in and suggests signing in or resetting the password,
  without confirming whether the address exists.


## The pronunciation check

Recording, playback and the model pronunciation all work on their own. The
automatic check on top is browser speech-to-text comparing text, not a
pronunciation model, and the interface says so.

It reports one of five things:

| Verdict | Means |
| --- | --- |
| Sounds right | The transcript was exactly the target, and the target has no homophones |
| Can't tell these apart | The target sounds identical to another word, so the transcript proves nothing |
| Close | A phrase came back nearly right, or a single word came back near-miss |
| Not quite | Something else was heard |
| Couldn't hear that | Nothing usable, or the recogniser reported low confidence |

### Why "can't tell these apart" exists

Speech-to-text picks between "there", "their" and "they're" using context and
word frequency. It never picks using the audio, because the audio is the same.
On a single word there is no context, so the transcript is close to a coin toss
between the members of the group — which means a transcript reading "there" is
not evidence that "there" was said.

`src/lib/homophones.js` lists those groups per language. When the target is in
one, the check says it cannot tell rather than claiming a pass, and points the
learner at the model pronunciation instead. Words outside the list are
unaffected.

### Single words are matched exactly

Fuzzy matching is kept for phrases, where dropping an article should not fail
an otherwise good attempt. It is not used on single words: one substitution in
a nine-letter word still scores 0.89 similarity, which used to let "negotiated"
pass as "negotiate". A one-word target now has to come back exactly.
