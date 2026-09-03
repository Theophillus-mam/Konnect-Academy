import { supabaseAdmin as supabase, unwrap } from "../lib/supabaseAdmin.js";

/**
 * The console's reads. Each one is a security definer function that checks
 * is_admin() first, so a learner who guesses the endpoint gets a 403 rather
 * than a filtered result they might mistake for the whole school.
 */

export async function loadOverview() {
  return unwrap(await supabase.rpc("admin_overview"));
}

export async function loadLearners() {
  return unwrap(await supabase.rpc("admin_learner_rows"));
}

export async function loadCourses() {
  return unwrap(await supabase.rpc("admin_course_rows"));
}

/** Everything the console shows, in one round trip. */
export async function loadAdminData() {
  const [overview, learners, courses] = await Promise.all([
    loadOverview(),
    loadLearners(),
    loadCourses(),
  ]);
  return { overview, learners, courses };
}

/** Membership check, run before the console is shown. */
export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) throw error;
  return Boolean(data);
}

export async function touchAdmin() {
  return unwrap(await supabase.rpc("admin_touch"));
}

export async function listAdmins() {
  return unwrap(await supabase.rpc("admin_list"));
}

export async function grantAdmin(email) {
  return unwrap(await supabase.rpc("admin_grant", { target_email: email }));
}

export async function revokeAdmin(userId) {
  return unwrap(await supabase.rpc("admin_revoke", { target: userId }));
}

/** Learner list as CSV, for the school's own records. */
export function learnersToCsv(rows) {
  const head = [
    "Name", "Email", "Course", "Level", "Lessons completed",
    "Words mastered", "Total XP", "Last active", "Joined",
  ];
  const cell = (v) => {
    const t = v == null ? "" : String(v);
    return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
  };
  const body = rows.map((r) => [
    r.display_name, r.email,
    r.course_title, r.level_code, r.lessons_done, r.words_mastered, r.total_xp,
    r.last_active ? new Date(r.last_active).toISOString().slice(0, 10) : "",
    r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : "",
  ].map(cell).join(","));

  return [head.join(","), ...body].join("\n");
}
