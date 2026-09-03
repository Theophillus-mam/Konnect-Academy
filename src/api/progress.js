import { supabase, unwrap } from "../lib/supabase.js";

/** Everything the signed-in learner has done so far. */
export async function loadProgress(userId) {
  const [profile, enrollments, skills, completions, mastery, events] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle().then(unwrap),
    supabase.from("enrollments").select("*").eq("user_id", userId).then(unwrap),
    supabase.from("user_skills").select("*").eq("user_id", userId).then(unwrap),
    supabase.from("lesson_completions").select("*").eq("user_id", userId).then(unwrap),
    supabase.from("vocab_mastery").select("*").eq("user_id", userId).then(unwrap),
    // 120 days is more than enough to draw the streak and the current week.
    supabase
      .from("xp_events")
      .select("*")
      .eq("user_id", userId)
      .gte("occurred_at", new Date(Date.now() - 120 * 86400000).toISOString())
      .order("occurred_at", { ascending: false })
      .then(unwrap),
  ]);

  return { profile, enrollments, skills, completions, mastery, events };
}

export async function awardXp(userId, amount, source, courseId = null) {
  return unwrap(
    await supabase
      .from("xp_events")
      .insert({ user_id: userId, amount, source, course_id: courseId })
      .select()
      .single()
  );
}

export async function saveLessonCompletion(userId, lessonId, correct, total, xp, courseId) {
  const row = unwrap(
    await supabase
      .from("lesson_completions")
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          correct_count: correct,
          total_count: total,
          xp_earned: xp,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      )
      .select()
      .single()
  );
  await awardXp(userId, xp, `lesson:${lessonId}`, courseId);
  return row;
}

export async function savePlacement(userId, { courseId, levelCode, skills }) {
  const now = new Date().toISOString();

  // The level belongs to this course, not to the learner as a whole.
  await supabase
    .from("enrollments")
    .upsert(
      { user_id: userId, course_id: courseId, level_code: levelCode, placed_at: now },
      { onConflict: "user_id,course_id" }
    )
    .then(unwrap);

  const rows = Object.entries(skills).map(([skill, score]) => ({
    user_id: userId,
    course_id: courseId,
    skill,
    score,
    updated_at: now,
  }));
  return unwrap(
    await supabase.from("user_skills").upsert(rows, { onConflict: "user_id,course_id,skill" }).select()
  );
}

export async function saveVocabMastery(userId, vocabularyId, mastery, reviewCount) {
  return unwrap(
    await supabase
      .from("vocab_mastery")
      .upsert(
        {
          user_id: userId,
          vocabulary_id: vocabularyId,
          mastery,
          review_count: reviewCount,
          last_reviewed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,vocabulary_id" }
      )
      .select()
      .single()
  );
}

export async function saveTutorSession(userId, scenarioId, scores) {
  return unwrap(
    await supabase
      .from("tutor_sessions")
      .insert({
        user_id: userId,
        scenario_id: scenarioId,
        grammar: Math.round(scores.Grammar),
        vocabulary: Math.round(scores.Vocabulary),
        fluency: Math.round(scores.Fluency),
        overall: Math.round((scores.Grammar + scores.Vocabulary + scores.Fluency) / 3),
      })
      .select()
      .single()
  );
}

export async function updateProfile(userId, patch) {
  return unwrap(
    await supabase
      .from("profiles")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()
  );
}

/** Switch the learner to another course, enrolling them if it is their first time. */
export async function setActiveCourse(userId, courseId) {
  await supabase
    .from("enrollments")
    .upsert({ user_id: userId, course_id: courseId }, { onConflict: "user_id,course_id", ignoreDuplicates: true })
    .then(unwrap);

  return unwrap(
    await supabase
      .from("profiles")
      .update({ course_id: courseId, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()
  );
}
