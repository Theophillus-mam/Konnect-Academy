import { createClient } from "@supabase/supabase-js";

const env = (typeof import.meta !== "undefined" && import.meta.env) || {};
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

/**
 * A second client, with its own storage key.
 *
 * Both pages are served from the same origin, so they share localStorage. On
 * the default key an admin signing in would silently replace the session on
 * the learner page, and signing out of one would sign out of the other. A
 * distinct storageKey keeps the two sessions genuinely independent: someone
 * can be signed in as an admin on /admin and as a learner on / at the same
 * time, on the same browser, without either one disturbing the other.
 */
export const supabaseAdmin = isConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "konnect-admin-auth",
      },
    })
  : null;

export function unwrap({ data, error }) {
  if (error) throw error;
  return data;
}
