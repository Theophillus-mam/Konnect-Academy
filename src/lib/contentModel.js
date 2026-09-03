/**
 * The content model, in one place.
 *
 * Each entry describes one editable table: the fields the form should show,
 * the columns the list should show, and which tables hang off it. The admin
 * content browser is generic and reads everything it needs from here, so
 * adding a column to a form is a one-line change rather than a new screen.
 *
 * `fk` is the column on the child that points back at the parent.
 */

export const ENTITIES = {
  languages: {
    label: "Languages",
    singular: "language",
    empty: "No languages yet. Add one to start building a course.",
    title: (r) => r.name,
    subtitle: (r) => r.code?.toUpperCase(),
    list: [
      { k: "name", label: "Name", primary: true },
      { k: "code", label: "Code", mono: true },
      { k: "is_active", label: "Visible", type: "bool" },
    ],
    fields: [
      { k: "name", label: "Name", type: "text", required: true, placeholder: "English" },
      { k: "code", label: "Code", type: "text", required: true, placeholder: "en",
        hint: "Short code used in the picker. Two letters is the convention." },
      { k: "is_active", label: "Visible to learners", type: "bool",
        hint: "Hidden languages stay in the database but disappear from the app." },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "courses", fk: "language_id" }],
  },

  courses: {
    label: "Courses",
    singular: "course",
    empty: "This language has no courses yet.",
    title: (r) => r.title,
    subtitle: (r) => r.code,
    list: [
      { k: "title", label: "Title", primary: true },
      { k: "code", label: "Code", mono: true },
      { k: "description", label: "Description", truncate: true },
    ],
    fields: [
      { k: "title", label: "Title", type: "text", required: true, placeholder: "English for work" },
      { k: "code", label: "Code", type: "text", required: true, placeholder: "en-work",
        hint: "Unique within the language." },
      { k: "description", label: "Description", type: "textarea" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [
      { entity: "modules", fk: "course_id" },
      { entity: "vocabulary", fk: "course_id" },
      { entity: "placement_questions", fk: "course_id" },
      { entity: "practice_modules", fk: "course_id" },
      { entity: "tutor_scenarios", fk: "course_id" },
    ],
  },

  modules: {
    label: "Modules",
    singular: "module",
    empty: "No modules yet. A module is a group of lessons on the learning path.",
    title: (r) => r.title,
    list: [
      { k: "title", label: "Title", primary: true },
      { k: "slug", label: "Slug", mono: true },
      { k: "blurb", label: "Blurb", truncate: true },
    ],
    fields: [
      { k: "title", label: "Title", type: "text", required: true },
      { k: "slug", label: "Slug", type: "text", required: true, hint: "Unique within the course." },
      { k: "icon", label: "Icon", type: "icon" },
      { k: "blurb", label: "Blurb", type: "textarea" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "lessons", fk: "module_id" }],
  },

  lessons: {
    label: "Lessons",
    singular: "lesson",
    empty: "No lessons in this module yet.",
    title: (r) => r.title,
    list: [
      { k: "title", label: "Title", primary: true },
      { k: "tag", label: "Tag" },
      { k: "est_minutes", label: "Minutes", type: "int" },
    ],
    fields: [
      { k: "title", label: "Title", type: "text", required: true },
      { k: "slug", label: "Slug", type: "text", required: true, hint: "Unique within the module." },
      { k: "tag", label: "Tag", type: "text", placeholder: "Grammar" },
      { k: "description", label: "Description", type: "textarea" },
      { k: "est_minutes", label: "Estimated minutes", type: "int" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "lesson_questions", fk: "lesson_id" }],
  },

  lesson_questions: {
    label: "Questions",
    singular: "question",
    empty: "This lesson has no questions yet.",
    title: (r) => r.prompt,
    list: [
      { k: "prompt", label: "Prompt", primary: true, truncate: true },
      { k: "explanation", label: "Explanation", truncate: true },
    ],
    fields: [
      { k: "prompt", label: "Prompt", type: "textarea", required: true },
      { k: "explanation", label: "Explanation", type: "textarea",
        hint: "Shown after the learner answers." },
      { k: "quote_from", label: "Quote attribution", type: "text" },
      { k: "quote_text", label: "Quote", type: "textarea" },
      { k: "audio_url", label: "Audio URL", type: "text" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "lesson_options", fk: "question_id" }],
  },

  lesson_options: {
    label: "Answers",
    singular: "answer",
    empty: "No answers yet. A question needs at least one correct answer.",
    title: (r) => r.body,
    list: [
      { k: "body", label: "Answer", primary: true },
      { k: "is_correct", label: "Correct", type: "bool" },
    ],
    fields: [
      { k: "body", label: "Answer", type: "textarea", required: true },
      { k: "is_correct", label: "This is the correct answer", type: "bool" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [],
  },

  vocabulary: {
    label: "Vocabulary",
    singular: "word",
    empty: "No vocabulary yet.",
    title: (r) => r.word,
    list: [
      { k: "word", label: "Word", primary: true },
      { k: "part_of_speech", label: "Part of speech" },
      { k: "definition", label: "Definition", truncate: true },
    ],
    fields: [
      { k: "word", label: "Word", type: "text", required: true },
      { k: "part_of_speech", label: "Part of speech", type: "select", optional: true,
        options: ["noun", "verb", "adjective", "adverb", "phrase", "preposition", "conjunction"] },
      { k: "definition", label: "Definition", type: "textarea", required: true },
      { k: "example", label: "Example sentence", type: "textarea" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [],
  },

  placement_questions: {
    label: "Placement test",
    singular: "placement question",
    empty: "No placement questions yet. Without them the test cannot place a learner.",
    title: (r) => r.prompt,
    list: [
      { k: "prompt", label: "Prompt", primary: true, truncate: true },
      { k: "skill", label: "Skill" },
      { k: "tag", label: "Tag" },
    ],
    fields: [
      { k: "prompt", label: "Prompt", type: "textarea", required: true },
      { k: "skill", label: "Skill", type: "select", required: true,
        options: ["Grammar", "Vocabulary", "Reading", "Listening", "Speaking", "Writing"],
        hint: "Scores are reported per skill, so this has to match the others exactly." },
      { k: "tag", label: "Tag", type: "text" },
      { k: "context", label: "Context", type: "textarea",
        hint: "Passage or setup shown above the prompt." },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "placement_options", fk: "question_id" }],
  },

  placement_options: {
    label: "Answers",
    singular: "answer",
    empty: "No answers yet.",
    title: (r) => r.body,
    list: [
      { k: "body", label: "Answer", primary: true },
      { k: "points", label: "Points", type: "int" },
    ],
    fields: [
      { k: "body", label: "Answer", type: "textarea", required: true },
      { k: "points", label: "Points", type: "int",
        hint: "Higher points place the learner at a higher level. There is no single right answer." },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [],
  },

  practice_modules: {
    label: "Practice",
    singular: "practice module",
    empty: "No practice modules yet.",
    title: (r) => r.name,
    list: [
      { k: "name", label: "Name", primary: true },
      { k: "slug", label: "Slug", mono: true },
      { k: "target_screen", label: "Opens" },
    ],
    fields: [
      { k: "name", label: "Name", type: "text", required: true },
      { k: "slug", label: "Slug", type: "text", required: true, hint: "Unique within the course." },
      { k: "icon", label: "Icon", type: "icon" },
      { k: "description", label: "Description", type: "textarea" },
      { k: "tone", label: "Tone", type: "select", optional: true,
        options: ["terra", "green", "ochre", "grey"], hint: "Colour of the card in the practice hub." },
      { k: "target_screen", label: "Opens", type: "select", optional: true,
        options: ["practice", "tutor", "vocab", "test"] },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "practice_exercises", fk: "practice_module_id" }],
  },

  practice_exercises: {
    label: "Exercises",
    singular: "exercise",
    empty: "No exercises yet. The practice hub counts these rows, so an empty module shows zero.",
    title: (r) => r.title,
    list: [{ k: "title", label: "Title", primary: true }],
    fields: [
      { k: "title", label: "Title", type: "text", required: true },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [],
  },

  tutor_scenarios: {
    label: "Tutor scenarios",
    singular: "scenario",
    empty: "No scenarios yet.",
    title: (r) => r.title,
    list: [
      { k: "title", label: "Title", primary: true },
      { k: "slug", label: "Slug", mono: true },
      { k: "level_code", label: "Level" },
    ],
    fields: [
      { k: "title", label: "Title", type: "text", required: true },
      { k: "slug", label: "Slug", type: "text", required: true, hint: "Unique within the course." },
      { k: "level_code", label: "Level", type: "level", optional: true },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "tutor_turns", fk: "scenario_id" }],
  },

  tutor_turns: {
    label: "Turns",
    singular: "turn",
    empty: "No turns yet. Each turn is one thing the tutor says.",
    title: (r) => r.prompt,
    list: [
      { k: "prompt", label: "Tutor says", primary: true, truncate: true },
      { k: "goal", label: "Goal", truncate: true },
    ],
    fields: [
      { k: "prompt", label: "Tutor says", type: "textarea", required: true },
      { k: "goal", label: "Goal", type: "text", hint: "Shown to the learner as what to aim for." },
      { k: "follow_up", label: "Follow-up", type: "textarea" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [{ entity: "tutor_replies", fk: "turn_id" }],
  },

  tutor_replies: {
    label: "Replies",
    singular: "reply",
    empty: "No replies yet. Give the learner at least two to choose between.",
    title: (r) => r.body,
    list: [
      { k: "body", label: "Reply", primary: true, truncate: true },
      { k: "score", label: "Score", type: "int" },
      { k: "feedback_kind", label: "Feedback" },
    ],
    fields: [
      { k: "body", label: "Reply", type: "textarea", required: true },
      { k: "score", label: "Score", type: "int", hint: "0 to 100." },
      { k: "feedback_kind", label: "Feedback kind", type: "select", optional: true,
        options: ["good", "note", "fix"] },
      { k: "feedback_body", label: "Feedback", type: "textarea" },
      { k: "fix_before", label: "Fix — before", type: "text" },
      { k: "fix_after", label: "Fix — after", type: "text" },
      { k: "sort_order", label: "Position", type: "int" },
    ],
    children: [],
  },
};

/** Icon names available to the icon picker, matching components/Icon.jsx. */
export const ICON_NAMES = [
  "grid", "book", "dumbbell", "trend", "flame", "medal", "check", "lock", "play",
  "mic", "head", "pen", "chat", "sparkle", "case", "cap", "bulb", "volume",
  "refresh", "clock", "zap", "target", "users", "star", "gear", "help", "flag",
  "globe", "doc",
];

/** A blank row for the add form, honouring the database defaults. */
export function blankRow(entity, siblings = []) {
  const spec = ENTITIES[entity];
  const row = {};
  for (const f of spec.fields) {
    if (f.type === "bool") row[f.k] = false;
    else if (f.type === "int") row[f.k] = 0;
    else row[f.k] = "";
  }
  if ("sort_order" in row) {
    row.sort_order = siblings.reduce((max, r) => Math.max(max, r.sort_order ?? 0), -1) + 1;
  }
  if (entity === "lessons" && "est_minutes" in row) row.est_minutes = 15;
  return row;
}

/** Trims strings and turns empty optional fields into null rather than "". */
export function cleanRow(entity, form) {
  const spec = ENTITIES[entity];
  const out = {};
  for (const f of spec.fields) {
    const v = form[f.k];
    if (f.type === "bool") out[f.k] = Boolean(v);
    else if (f.type === "int") out[f.k] = Number.isFinite(Number(v)) ? Number(v) : 0;
    else {
      const t = typeof v === "string" ? v.trim() : v;
      out[f.k] = t === "" || t == null ? (f.required ? "" : null) : t;
    }
  }
  return out;
}

/** Which required fields are still blank. */
export function missingFields(entity, form) {
  return ENTITIES[entity].fields
    .filter((f) => f.required && !String(form[f.k] ?? "").trim())
    .map((f) => f.label);
}
