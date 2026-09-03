import { supabase, unwrap } from "../lib/supabase.js";

/**
 * Loads the whole course in one round trip per table. The catalogue is small
 * and identical for every learner, so it is fetched once on sign-in.
 */
/** Every language that has been switched on, for the picker. */
export async function loadLanguages() {
  return unwrap(
    await supabase
      .from("languages")
      .select("*, courses(id, code, title, description)")
      .eq("is_active", true)
      .order("sort_order")
  );
}

/**
 * Loads one course. Pass a course id to load a specific one; with no argument
 * it falls back to the first active language, so a learner with no enrolment
 * still gets something.
 */
export async function loadCourse(courseId) {
  let course;
  if (courseId) {
    course = unwrap(
      await supabase
        .from("courses")
        .select("*, languages!inner(code, name)")
        .eq("id", courseId)
        .maybeSingle()
    );
  }
  if (!course) {
    const courses = unwrap(
      await supabase
        .from("courses")
        .select("*, languages!inner(code, name, is_active, sort_order)")
        .eq("languages.is_active", true)
        .order("sort_order")
    );
    course = courses[0];
  }
  if (!course) {
    throw new Error(
      "No active course is available. Run the seed files and check that at least one language has is_active set."
    );
  }

  const [levels, modules, lessons, placement, vocabulary, practice, scenario] = await Promise.all([
    supabase.from("cefr_levels").select("*").order("sort_order").then(unwrap),

    supabase.from("modules").select("*").eq("course_id", course.id).order("sort_order").then(unwrap),

    supabase
      .from("lessons")
      .select("*, modules!inner(course_id), lesson_questions(*, lesson_options(*))")
      .eq("modules.course_id", course.id)
      .order("sort_order")
      .then(unwrap),

    supabase
      .from("placement_questions")
      .select("*, placement_options(*)")
      .eq("course_id", course.id)
      .order("sort_order")
      .then(unwrap),

    supabase.from("vocabulary").select("*").eq("course_id", course.id).order("sort_order").then(unwrap),

    supabase
      .from("practice_modules")
      .select("*, practice_exercises(count)")
      .eq("course_id", course.id)
      .order("sort_order")
      .then(unwrap),

    supabase
      .from("tutor_scenarios")
      .select("*, tutor_turns(*, tutor_replies(*))")
      .eq("course_id", course.id)
      .order("sort_order")
      .limit(1)
      .maybeSingle()
      .then(unwrap),
  ]);

  const moduleIds = new Set(modules.map((m) => m.id));
  const courseLessons = lessons.filter((l) => moduleIds.has(l.module_id));

  const sortNested = (rows, key) =>
    rows.map((r) => ({ ...r, [key]: [...(r[key] || [])].sort((a, b) => a.sort_order - b.sort_order) }));

  return {
    course,
    levels,
    modules: modules.map((m) => ({
      ...m,
      lessons: courseLessons.filter((l) => l.module_id === m.id).sort((a, b) => a.sort_order - b.sort_order),
    })),
    lessons: sortNested(courseLessons, "lesson_questions").map((l) => ({
      ...l,
      lesson_questions: sortNested(l.lesson_questions, "lesson_options"),
    })),
    placement: sortNested(placement, "placement_options"),
    vocabulary,
    practice: practice.map((p) => ({
      ...p,
      exercise_count: p.practice_exercises?.[0]?.count ?? 0,
    })),
    scenario: scenario
      ? {
          ...scenario,
          tutor_turns: sortNested(scenario.tutor_turns, "tutor_replies"),
        }
      : null,
  };
}
