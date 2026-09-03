/**
 * Pure functions that turn raw rows into the figures the UI shows.
 *
 * Nothing here is stored as a counter: the streak, the weekly chart and the
 * XP totals are all derived from the xp_events table, so they cannot drift
 * out of step with what the learner actually did.
 */

const DAY_MS = 86400000;
export const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Local YYYY-MM-DD, so day boundaries follow the learner's clock. */
export const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
};

/** Monday index: JS getDay() is Sunday-first, the UI week is Monday-first. */
export const weekdayIndex = (d) => (new Date(d).getDay() + 6) % 7;

export function startOfWeek(now = new Date()) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return new Date(d.getTime() - weekdayIndex(d) * DAY_MS);
}

/**
 * Consecutive days with at least one XP event, counting back from today.
 * Yesterday still counts as alive so the streak does not break mid-morning.
 */
export function computeStreak(events, now = new Date()) {
  if (!events?.length) return 0;
  const days = new Set(events.map((e) => dayKey(e.occurred_at)));
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let cursor = today;
  if (!days.has(dayKey(cursor))) {
    cursor = new Date(cursor.getTime() - DAY_MS);
    if (!days.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

/** XP earned per day for the current week, Monday first. */
export function weeklyXp(events, now = new Date()) {
  const start = startOfWeek(now).getTime();
  const week = [0, 0, 0, 0, 0, 0, 0];
  for (const e of events || []) {
    const t = new Date(e.occurred_at).getTime();
    if (t < start) continue;
    const i = Math.floor((t - start) / DAY_MS);
    if (i >= 0 && i < 7) week[i] += e.amount;
  }
  return week;
}

export const weeklyTotal = (events, now = new Date()) =>
  weeklyXp(events, now).reduce((a, b) => a + b, 0);

/** Scale raw XP to bar heights, so the tallest day fills the chart. */
export function weekBars(week) {
  const max = Math.max(...week, 1);
  return week.map((v) => (v === 0 ? 0 : Math.round((v / max) * 100)));
}

/** Map a 0–100 skill score onto a CEFR band. */
export const skillBand = (v) => (v >= 85 ? "B2" : v >= 65 ? "B1" : v >= 45 ? "A2" : "A1");

/** Highest level whose threshold the placement score reaches. */
export function levelForPoints(points, levels) {
  const sorted = [...(levels || [])].sort((a, b) => b.min_points - a.min_points);
  return sorted.find((l) => points >= l.min_points) || sorted[sorted.length - 1] || null;
}
