/**
 * Pure helpers for the pronunciation recorder.
 *
 * Deliberately no scoring model here. Judging a pronunciation properly needs a
 * trained acoustic model; anything this file could invent would be a number
 * that looks authoritative and means nothing. What it does instead is compare
 * a speech-to-text transcript against the target word, which is a real but
 * rough signal, and is labelled as such in the UI.
 *
 * The comparison is built to fail closed. A textual method cannot tell two
 * words apart when they sound the same, so where that applies it reports that
 * it cannot tell, rather than guessing and calling it a pass.
 */

import { homophonesOf } from "./homophones.js";

/** BCP-47 tag for speech synthesis and recognition, from the course language. */
export function speechLocale(languageCode) {
  return { en: "en-GB", fr: "fr-FR", pt: "pt-PT" }[languageCode] || "en-GB";
}

/** Lowercase, strip accents and punctuation, so "négocier" matches "negocier". */
export function normalise(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein distance between two strings. */
export function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = row;
  }
  return prev[b.length];
}

/** 0–1 similarity between a transcript and the target phrase. */
export function similarity(target, heard) {
  const a = normalise(target);
  const b = normalise(heard);
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const longest = Math.max(a.length, b.length);
  return (longest - editDistance(a, b)) / longest;
}

/**
 * Below this, the recogniser is telling us it is guessing, so the transcript
 * is not worth judging. Some engines never populate confidence and report 0;
 * that is treated as "not reported" rather than as no confidence.
 */
export const MIN_CONFIDENCE = 0.5;

/**
 * Turn a transcript into a verdict.
 *
 * Two things this deliberately does not do.
 *
 * It does not compare a single word loosely. Fuzzy matching on a short word
 * passes near misses: one substitution in a nine-letter word still scores 0.89,
 * so "negotiate" would accept "negotiated". A one-word target has to come back
 * exactly. Phrases keep the fuzzy threshold, where a dropped article should not
 * fail an otherwise good attempt.
 *
 * It does not claim a pass on a word that has homophones. The recogniser picks
 * between "there" and "their" on context and frequency, never on the audio,
 * because the audio is the same. A transcript that reads "there" is therefore
 * no evidence that "there" was said, and reporting it as correct is the bug
 * this replaced. Those cases return "ambiguous", which the interface explains.
 */
export function judge(target, heard, options = {}) {
  const { confidence = null, languageCode = "en" } = options;

  const a = normalise(target);
  const b = normalise(heard);

  if (!b) return { verdict: "unclear", score: 0 };

  if (typeof confidence === "number" && confidence > 0 && confidence < MIN_CONFIDENCE) {
    return { verdict: "unclear", score: 0, confidence };
  }

  const s = similarity(target, heard);
  const singleWord = Boolean(a) && !a.includes(" ");
  const confusable = singleWord ? homophonesOf(a, languageCode) : [];

  if (a === b) {
    return confusable.length
      ? { verdict: "ambiguous", score: s, confusedWith: confusable }
      : { verdict: "match", score: s };
  }

  // Heard a different spelling that sounds identical: same situation, and the
  // learner may well have said the right word.
  if (confusable.includes(b)) {
    return { verdict: "ambiguous", score: s, confusedWith: confusable };
  }

  if (!singleWord && s >= 0.85) return { verdict: "match", score: s };
  if (s >= 0.6) return { verdict: "close", score: s };
  return { verdict: "different", score: s };
}

/** Pick a container the browser will actually record. Safari only does mp4. */
export function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  return candidates.find((t) => MediaRecorder.isTypeSupported?.(t)) || null;
}

export const extensionFor = (mimeType) =>
  !mimeType ? "webm" : mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";

/** Storage path, namespaced by user so the policies can key off the prefix. */
export function recordingPath(userId, vocabularyId, mimeType) {
  return `${userId}/${vocabularyId}/${Date.now()}.${extensionFor(mimeType)}`;
}

export const formatDuration = (ms) => {
  const total = Math.max(0, Math.round(ms / 100) / 10);
  return `${total.toFixed(1)}s`;
};

export const isRecordingSupported = () =>
  typeof navigator !== "undefined" &&
  Boolean(navigator.mediaDevices?.getUserMedia) &&
  typeof MediaRecorder !== "undefined";

export const isRecognitionSupported = () =>
  typeof window !== "undefined" &&
  Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

export const isSynthesisSupported = () =>
  typeof window !== "undefined" && Boolean(window.speechSynthesis);
