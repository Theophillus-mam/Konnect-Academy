import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase, isConfigured } from "../lib/supabase.js";
import { loadCourse, loadLanguages } from "../api/content.js";
import * as progressApi from "../api/progress.js";
import { savePronunciationAttempt } from "../api/recordings.js";
import {
  computeStreak, weeklyXp, weeklyTotal, weekBars, weekdayIndex, dayKey, levelForPoints,
} from "../lib/stats.js";

/**
 * Reshapes database rows into the structures the screens already expect, so
 * the presentation layer did not have to be rewritten around PostgREST's
 * column names.
 */
function shapeContent(raw) {
  if (!raw) return null;

  const lessons = {};
  for (const l of raw.lessons) {
    lessons[l.id] = {
      id: l.id,
      slug: l.slug,
      title: l.title,
      tag: l.tag,
      desc: l.description,
      minutes: l.est_minutes,
      questions: l.lesson_questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        why: q.explanation,
        audio: Boolean(q.audio_url),
        quote: q.quote_text ? { from: q.quote_from, text: q.quote_text } : null,
        options: q.lesson_options.map((o) => o.body),
        answer: q.lesson_options.findIndex((o) => o.is_correct),
      })),
    };
  }

  return {
    course: raw.course,
    levels: raw.levels.map((l) => ({ code: l.code, name: l.name, min: l.min_points })),
    modules: raw.modules.map((m) => ({
      id: m.id,
      title: m.title,
      icon: m.icon,
      blurb: m.blurb,
      lessons: m.lessons.map((l) => l.id),
    })),
    lessons,
    placement: raw.placement.map((p) => ({
      id: p.id,
      skill: p.skill,
      tag: p.tag,
      context: p.context,
      prompt: p.prompt,
      options: p.placement_options.map((o) => ({ t: o.body, p: o.points })),
    })),
    vocabulary: raw.vocabulary,
    practice: raw.practice.map((p) => ({
      id: p.slug,
      name: p.name,
      icon: p.icon,
      desc: p.description,
      tone: p.tone,
      go: p.target_screen,
      n: p.exercise_count,
    })),
    scenario: raw.scenario && {
      id: raw.scenario.id,
      title: raw.scenario.title,
      turns: raw.scenario.tutor_turns.map((t) => ({
        goal: t.goal,
        says: t.prompt,
        then: t.follow_up,
        replies: t.tutor_replies.map((r) => ({
          t: r.body,
          score: r.score,
          fb:
            r.feedback_kind === "fix"
              ? { fix: [r.fix_before, r.fix_after] }
              : r.feedback_kind === "good"
              ? { good: r.feedback_body }
              : r.feedback_kind === "note"
              ? { note: r.feedback_body }
              : null,
        })),
      })),
    },
  };
}

export default function useLearner() {
  const [session, setSession] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [content, setContent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState(isConfigured ? "loading" : "unconfigured");
  const [error, setError] = useState(null);
  const [screen, setScreen] = useState("signin");
  const [activeLesson, setActiveLesson] = useState(null);
  const mounted = useRef(true);
  const authEventSeen = useRef(false);

  // StrictMode mounts, unmounts and remounts in development. The cleanup below
  // runs during that first simulated unmount, so this flag must be set back to
  // true on every mount - otherwise the auth listener below bails out forever
  // and sign-in never updates the session.
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // --- auth session -------------------------------------------------------
  useEffect(() => {
    if (!isConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted.current && !authEventSeen.current) setSession(data?.session ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, next) => {
      if (!mounted.current) return;
      authEventSeen.current = true;
      setSession(next);
      if (!next) { setProgress(null); setScreen("signin"); }
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  const refreshProgress = useCallback(async () => {
    if (!userId) return null;
    const p = await progressApi.loadProgress(userId);
    if (mounted.current) setProgress(p);
    return p;
  }, [userId]);

  // --- initial load -------------------------------------------------------
  useEffect(() => {
    if (!isConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        setStatus("loading");
        setError(null);

        const langs = await loadLanguages();
        if (cancelled) return;
        setLanguages(langs);

        if (userId) {
          // Load progress first so we know which course they were last on.
          const p = await progressApi.loadProgress(userId);
          if (cancelled) return;
          const course = await loadCourse(p.profile?.course_id);
          if (cancelled) return;
          setContent(shapeContent(course));
          setProgress(p);

          const enrolled = (p.enrollments || []).find((e) => e.course_id === course.id);
          setScreen(enrolled?.placed_at ? "dash" : "intro");
        } else {
          const course = await loadCourse();
          if (cancelled) return;
          setContent(shapeContent(course));
          setScreen("signin");
        }
        if (!cancelled) setStatus("ready");
      } catch (e) {
        if (!cancelled) { setError(e); setStatus("error"); }
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // --- derived learner state ---------------------------------------------
  const s = useMemo(() => {
    const profile = progress?.profile;
    const events = progress?.events || [];
    const levels = content?.levels || [];
    const courseId = content?.course?.id;
    // Level and placement are per course, so a B1 in French does not make the
    // learner B1 in Portuguese.
    const enrolment = (progress?.enrollments || []).find((e) => e.course_id === courseId);
    const level = levels.find((l) => l.code === enrolment?.level_code);
    const masteryById = new Map((progress?.mastery || []).map((m) => [m.vocabulary_id, m]));
    const today = dayKey(new Date());

    return {
      screen,
      activeLesson,
      signedIn: Boolean(session),
      name: profile?.display_name || session?.user?.email?.split("@")[0] || "Learner",
      email: profile?.email || session?.user?.email || "",
      learningGoal: profile?.learning_goal || "Career confidence",
      placed: Boolean(enrolment?.placed_at),
      level: enrolment?.level_code || "—",
      levelName: level?.name || "Not yet placed",
      skills: Object.fromEntries(
        (progress?.skills || []).filter((r) => r.course_id === courseId).map((r) => [r.skill, r.score])
      ),
      languages,
      course: content?.course || null,
      courseTitle: content?.course?.title || "",
      languageName: content?.course?.languages?.name || "",
      languageCode: content?.course?.languages?.code || "en",
      xp: weeklyTotal(events),
      goal: profile?.weekly_goal_xp ?? 500,
      streak: computeStreak(events),
      week: weekBars(weeklyXp(events)),
      today: weekdayIndex(new Date()),
      done: (progress?.completions || []).map((c) => c.lesson_id),
      completions: progress?.completions || [],
      vocab: (content?.vocabulary || []).map((v) => ({
        id: v.id,
        w: v.word,
        pos: v.part_of_speech,
        def: v.definition,
        ex: v.example,
        m: masteryById.get(v.id)?.mastery ?? 0,
        reviews: masteryById.get(v.id)?.review_count ?? 0,
      })),
      reviewed: (progress?.mastery || []).filter((m) => dayKey(m.last_reviewed_at) === today).length,
    };
  }, [progress, content, session, screen, activeLesson, languages]);

  // --- actions ------------------------------------------------------------
  const go = useCallback((next, extra = {}) => {
    if (extra.activeLesson !== undefined) setActiveLesson(extra.activeLesson);
    setScreen(next);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  const actions = useMemo(() => ({
    go,

    // An administrator account has no learner profile to show, so it is
    // turned away here and pointed at the console rather than dropped into an
    // empty dashboard. The two sessions are stored under different keys, so
    // signing out here cannot disturb a console session in another tab.
    signIn: async (email, password) => {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) return res;

      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin) {
        await supabase.auth.signOut();
        return {
          data: { session: null, user: null },
          error: { message: "That is an administrator account. Sign in at /admin instead." },
        };
      }
      return res;
    },

    signUp: (email, password, meta) =>
      supabase.auth.signUp({ email, password, options: { data: meta } }),

    signOut: async () => { await supabase.auth.signOut(); setProgress(null); setScreen("signin"); },

    completeLesson: async (lessonId, correct, total) => {
      const xp = 20 + correct * 15;
      await progressApi.saveLessonCompletion(userId, lessonId, correct, total, xp, content?.course?.id);
      await refreshProgress();
      return xp;
    },

    gradeVocab: async (vocabularyId, nextMastery, reviewCount, earnXp) => {
      await progressApi.saveVocabMastery(userId, vocabularyId, nextMastery, reviewCount);
      if (earnXp) await progressApi.awardXp(userId, 5, `vocab:${vocabularyId}`, content?.course?.id);
      await refreshProgress();
    },

    submitPlacement: async (points, skills) => {
      const level = levelForPoints(points, (content?.levels || []).map((l) => ({ ...l, min_points: l.min })));
      await progressApi.savePlacement(userId, {
        courseId: content?.course?.id,
        levelCode: level?.code,
        skills,
      });
      await refreshProgress();
      return level;
    },

    finishTutor: async (scores) => {
      if (content?.scenario) await progressApi.saveTutorSession(userId, content.scenario.id, scores);
      await progressApi.awardXp(userId, 40, "tutor:session", content?.course?.id);
      await refreshProgress();
    },

    saveProfile: async (patch) => {
      await progressApi.updateProfile(userId, patch);
      await refreshProgress();
    },

    /** Store a pronunciation attempt and award XP for practising aloud. */
    savePronunciation: async (vocabularyId, word, clip) => {
      const res = await savePronunciationAttempt({
        userId,
        courseId: content?.course?.id,
        vocabularyId,
        word,
        blob: clip.blob,
        mimeType: clip.mimeType,
        durationMs: clip.durationMs,
        transcript: clip.transcript,
        verdict: clip.verdict,
        score: clip.score,
      });
      await progressApi.awardXp(userId, 5, `pronunciation:${vocabularyId}`, content?.course?.id);
      await refreshProgress();
      return res;
    },

    /** Change language. Loads the new course and its enrolment, then routes. */
    switchCourse: async (courseId) => {
      if (!userId || courseId === content?.course?.id) return;
      setStatus("loading");
      try {
        await progressApi.setActiveCourse(userId, courseId);
        const [course, p] = await Promise.all([
          loadCourse(courseId),
          progressApi.loadProgress(userId),
        ]);
        if (!mounted.current) return;
        setContent(shapeContent(course));
        setProgress(p);
        const enrolled = (p.enrollments || []).find((e) => e.course_id === courseId);
        setActiveLesson(null);
        setScreen(enrolled?.placed_at ? "dash" : "intro");
        setStatus("ready");
      } catch (e) {
        setError(e);
        setStatus("error");
      }
    },

    refresh: refreshProgress,
  }), [userId, refreshProgress, content, go, languages]);

  return { status, error, session, content, s, actions };
}
