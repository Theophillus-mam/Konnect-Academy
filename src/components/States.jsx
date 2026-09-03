import React from "react";
import Icon from "./Icon.jsx";

export function Loading({ label = "Loading your course…" }) {
  return (
    <div className="state-screen">
      <div className="spinner" aria-hidden="true" />
      <p className="muted" style={{ marginTop: 18 }}>{label}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-screen">
      <span style={{ color: "var(--error)" }}><Icon n="x" size={34} /></span>
      <h2 className="h2" style={{ margin: "14px 0 6px" }}>Couldn't reach the database</h2>
      <p className="muted" style={{ maxWidth: 460, margin: "0 0 20px" }}>
        {error?.message || "The request to Supabase failed."}
      </p>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try again</button>}
    </div>
  );
}

/** Shown when the .env file has not been filled in yet. */
export function SetupNeeded() {
  return (
    <div className="state-screen">
      <span style={{ color: "var(--tertiary)" }}><Icon n="gear" size={34} /></span>
      <h2 className="h2" style={{ margin: "14px 0 6px" }}>Connect Supabase to continue</h2>
      <p className="muted" style={{ maxWidth: 520, margin: "0 0 18px" }}>
        Copy <code>.env.example</code> to <code>.env</code> and add your project URL and anon key,
        then run the migrations and seed in the Supabase SQL editor.
      </p>
      <pre className="setup-code">{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}</pre>
    </div>
  );
}
