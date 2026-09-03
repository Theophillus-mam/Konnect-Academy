import { supabase, unwrap } from "../lib/supabase.js";
import { recordingPath } from "../lib/pronunciation.js";

export const BUCKET = "recordings";

/**
 * Uploads a clip and records the attempt.
 *
 * The audio row is written even if the upload fails, so a learner's practice
 * history is not lost to a flaky connection; storage_path is simply null.
 */
export async function savePronunciationAttempt({
  userId, courseId, vocabularyId, word, blob, mimeType, durationMs, transcript, verdict, score,
}) {
  let storagePath = null;
  let uploadError = null;

  if (blob) {
    const path = recordingPath(userId, vocabularyId, mimeType);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: mimeType, upsert: false });
    if (error) uploadError = error;
    else storagePath = path;
  }

  const row = unwrap(
    await supabase
      .from("pronunciation_attempts")
      .insert({
        user_id: userId,
        course_id: courseId,
        vocabulary_id: vocabularyId,
        word,
        storage_path: storagePath,
        mime_type: mimeType,
        duration_ms: Math.round(durationMs || 0),
        transcript: transcript || null,
        verdict: verdict || null,
        match_score: score == null ? null : Math.round(score * 100),
      })
      .select()
      .single()
  );

  return { row, uploadError };
}

export async function listAttempts(userId, vocabularyId) {
  return unwrap(
    await supabase
      .from("pronunciation_attempts")
      .select("*")
      .eq("user_id", userId)
      .eq("vocabulary_id", vocabularyId)
      .order("created_at", { ascending: false })
      .limit(5)
  );
}

/** Short-lived URL for playing back a stored clip. */
export async function signedUrl(storagePath, seconds = 3600) {
  if (!storagePath) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, seconds);
  if (error) throw error;
  return data?.signedUrl ?? null;
}

export async function deleteAttempt(userId, attempt) {
  if (attempt.storage_path) {
    await supabase.storage.from(BUCKET).remove([attempt.storage_path]);
  }
  return unwrap(
    await supabase.from("pronunciation_attempts").delete().eq("id", attempt.id).eq("user_id", userId)
  );
}
