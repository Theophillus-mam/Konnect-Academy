import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";

export default function Auth({ mode, actions, go, ping }) {
  const isSignUp = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("Career confidence");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [notice, setNotice] = useState(null);

  const switchMode = (next) => {
    setErr(null);
    setNotice(null);
    go(next);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setNotice(null);
    if (!email.trim() || !password) { setErr("Enter your email address and password."); return; }
    if (isSignUp && password.length < 6) { setErr("Passwords need at least 6 characters."); return; }

    setBusy(true);
    const { data, error } = isSignUp
      ? await actions.signUp(email.trim(), password, {
          display_name: name.trim() || email.split("@")[0],
          learning_goal: goal,
        })
      : await actions.signIn(email.trim(), password);
    setBusy(false);

    if (error) { setErr(error.message); return; }

    if (!isSignUp) {
      // The auth listener in useLearner picks the session up and routes onward.
      ping("Welcome back");
      return;
    }

    // Supabase answers a sign-up for an address that already exists with a
    // user carrying no identities, rather than an error, so that the form
    // cannot be used to discover who has an account. Say something useful
    // without confirming it either way.
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setPassword("");
      setNotice("That email may already have an account. Sign in below, or reset the password if you have forgotten it.");
      go("signin");
      return;
    }

    // Confirmation switched off: Supabase returns a session and the auth
    // listener takes them straight into the placement test.
    if (data?.session) {
      ping("Account created");
      return;
    }

    // Confirmation switched on: there is no session yet, so hand them to the
    // sign-in form with their email kept and the next step spelled out.
    setPassword("");
    setNotice("Account created. Check your inbox for the confirmation link, then sign in here.");
    go("signin");
    ping("Account created");
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel fade">
        <div className="brand" style={{ padding: 0, marginBottom: 26 }}>
          <div className="brand-mark"><img src="/konnect-logo.png" alt="Konnect Academy logo" /></div>
          <div>
            <div className="brand-name">Konnect Academy</div>
            <div className="brand-sub">LANGUAGE SCHOOL</div>
          </div>
        </div>

        <div className="eyebrow row" style={{ gap: 8 }}><Icon n={isSignUp ? "users" : "lock"} size={15} /> Account</div>
        <h1 className="display" style={{ margin: "8px 0 8px" }}>{isSignUp ? "Join Konnect Academy" : "Welcome back"}</h1>
        <p className="muted" style={{ margin: "0 0 24px" }}>
          {isSignUp
            ? "Create your learner profile for personalized English, French, or Portuguese practice."
            : "Sign in to continue your language path."}
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          {isSignUp && (
            <label className="form-line">
              <span className="label">Name</span>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>
          )}
          <label className="form-line">
            <span className="label">Email</span>
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="form-line">
            <span className="label">Password</span>
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters"
              autoComplete={isSignUp ? "new-password" : "current-password"} />
          </label>
          {isSignUp && (
            <label className="form-line">
              <span className="label">Learning goal</span>
              <select className="field" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option>Career confidence</option>
                <option>University readiness</option>
                <option>Interview practice</option>
                <option>Daily communication</option>
              </select>
            </label>
          )}

          {notice && (
            <div className="auth-notice row" style={{ gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "var(--secondary)", flex: "0 0 auto", marginTop: 2 }}><Icon n="check" size={16} /></span>
              <span>{notice}</span>
            </div>
          )}
          {err && <div className="auth-error">{err}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? "Working…" : isSignUp ? "Create account" : "Sign in"} <Icon n="arrowR" size={18} />
          </button>
        </form>

        <div className="auth-switch">
          <span className="small muted">{isSignUp ? "Already have a profile?" : "New to Konnect Academy?"}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => switchMode(isSignUp ? "signin" : "signup")}>
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </section>

      <aside className="auth-side fade">
        <span className="pill pill-green"><Icon n="check" size={13} /> Online or in person</span>
        <h2 className="h1" style={{ margin: "18px 0 10px" }}>
          Learn languages through real conversation.
        </h2>
        <p className="muted" style={{ margin: "0 0 22px" }}>
          Personalized classes, practical speaking tasks, and progress tracking for learners who want language they can use.
        </p>
        <div className="auth-path">
          {["Account", "Placement", "Dashboard", "Progress"].map((step, i) => (
            <div key={step} className="auth-step">
              <div className={"mod-dot" + (i === 0 ? "" : " done")} style={{ width: 36, height: 36, flex: "0 0 36px" }}>
                <Icon n={i === 0 ? "users" : i === 1 ? "target" : i === 2 ? "grid" : "trend"} size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="label">{step}</div>
                <Bar v={i === 0 ? 40 : 100} tone={i > 0 ? "green" : ""} h />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
