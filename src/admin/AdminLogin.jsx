import React, { useState } from "react";
import Icon from "../components/Icon.jsx";

/**
 * Sign-in for the console. There is no sign-up here and there never should be:
 * administrator accounts are created in Supabase and granted access by an
 * existing admin, so a form that could create one would undo the separation.
 */
export default function AdminLogin({ onSubmit, busy, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSubmit(email.trim(), password);
  };

  return (
    <div className="admin-gate">
      <form className="admin-gate-card" onSubmit={submit}>
        <div className="admin-gate-mark">
          <Icon n="gear" size={22} />
        </div>
        <h1 className="h1" style={{ marginTop: 14 }}>Konnecta Academy</h1>
        <p className="muted" style={{ margin: "6px 0 26px" }}>
          Administrator sign-in. Learners sign in on the main site.
        </p>

        {error && (
          <div className="auth-error" style={{ textAlign: "left", marginBottom: 16 }}>{error}</div>
        )}

        <label className="form-line" style={{ textAlign: "left", marginBottom: 14 }}>
          <span className="label">Email</span>
          <input
            className="field"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.org"
          />
        </label>
        <label className="form-line" style={{ textAlign: "left", marginBottom: 22 }}>
          <span className="label">Password</span>
          <input
            className="field"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="small muted" style={{ margin: "22px 0 0" }}>
          Access is granted by another administrator. If you have not been given
          it yet, ask someone who has.
        </p>
      </form>

      <a className="admin-gate-back small" href="/">
        <Icon n="arrowL" size={15} /> Back to the learner site
      </a>
    </div>
  );
}
