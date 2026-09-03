import React, { useCallback, useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import Toast from "../components/Toast.jsx";
import { Loading, ErrorState, SetupNeeded } from "../components/States.jsx";
import { supabaseAdmin, isConfigured } from "../lib/supabaseAdmin.js";
import { loadAdminData, checkIsAdmin, touchAdmin } from "../api/admin.js";
import AdminLogin from "./AdminLogin.jsx";
import Overview from "./Overview.jsx";
import Learners from "./Learners.jsx";
import Content from "./Content.jsx";
import Administrators from "./Administrators.jsx";

const TABS = [
  { id: "overview", label: "Overview", icon: "trend" },
  { id: "learners", label: "Learners", icon: "users" },
  { id: "content",  label: "Content",  icon: "book" },
  { id: "admins",   label: "Administrators", icon: "gear" },
];

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [gate, setGate] = useState("checking");   // checking | out | in
  const [signInError, setSignInError] = useState(null);
  const [busy, setBusy] = useState(false);

  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");

  const ping = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }, []);

  // Restore a session on load, and follow it afterwards. Because this client
  // has its own storage key, this only ever sees admin sessions.
  useEffect(() => {
    if (!isConfigured) { setGate("out"); return; }
    let alive = true;

    supabaseAdmin.auth.getSession().then(async ({ data }) => {
      if (!alive) return;
      if (!data.session) { setGate("out"); return; }
      // A learner's credentials can open a session here, so membership is
      // checked before the console is shown, not just at sign-in.
      const ok = await checkIsAdmin().catch(() => false);
      if (!alive) return;
      if (!ok) { await supabaseAdmin.auth.signOut(); setGate("out"); return; }
      setSession(data.session);
      setGate("in");
      touchAdmin().catch(() => {});
    });

    const { data: sub } = supabaseAdmin.auth.onAuthStateChange((_e, s) => {
      if (!alive) return;
      if (!s) { setSession(null); setGate("out"); setData(null); }
    });

    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = async (email, password) => {
    setBusy(true);
    setSignInError(null);
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (error) {
      setBusy(false);
      setSignInError(error.message);
      return;
    }

    const ok = await checkIsAdmin().catch(() => false);
    if (!ok) {
      await supabaseAdmin.auth.signOut();
      setBusy(false);
      // Deliberately the same wording as a wrong password: saying "that is a
      // learner account" would confirm which addresses exist.
      setSignInError("Those details do not open an administrator account.");
      return;
    }

    setSession(data.session);
    setGate("in");
    setBusy(false);
    touchAdmin().catch(() => {});
  };

  const signOut = async () => {
    await supabaseAdmin.auth.signOut();
    setSession(null);
    setData(null);
    setGate("out");
  };

  const load = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      setData(await loadAdminData());
      setStatus("ready");
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  }, []);

  // Content edits move the overview figures, so they are refetched on the way
  // back rather than left stale.
  useEffect(() => {
    if (gate === "in" && (tab === "overview" || tab === "learners")) load();
  }, [gate, tab, load]);

  if (!isConfigured) return <div className="af admin-shell"><SetupNeeded /></div>;
  if (gate === "checking") return <div className="af admin-shell"><Loading label="Checking your session…" /></div>;
  if (gate === "out") return <AdminLogin onSubmit={signIn} busy={busy} error={signInError} />;

  const email = session?.user?.email || "";
  const needsData = tab === "overview" || tab === "learners";

  const body = () => {
    if (tab === "content") return <Content ping={ping} />;
    if (tab === "admins") return <Administrators ping={ping} />;
    if (status === "loading" && !data) return <Loading label="Loading the console…" />;
    if (status === "error") return <ErrorState error={error} onRetry={load} />;
    if (!data) return null;
    return tab === "overview"
      ? <Overview data={data} />
      : <Learners data={data} ping={ping} />;
  };

  return (
    <div className="af admin-shell">
      <main className="main">
        <header className="topbar">
          <div className="topbar-brand">
            <span className="admin-badge"><Icon n="gear" size={16} /></span>
            Konnect Academy
            <span className="pill pill-grey" style={{ marginLeft: 6 }}>Console</span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            {needsData && (
              <button className="btn btn-ghost btn-sm" onClick={load} disabled={status === "loading"}>
                <Icon n="refresh" size={16} /> {status === "loading" ? "Refreshing…" : "Refresh"}
              </button>
            )}
            <span className="small muted admin-who">{email}</span>
            <button className="btn btn-secondary btn-sm" onClick={signOut}>Sign out</button>
          </div>
        </header>

        <div className="container stack">
          <div className="admin-tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={"admin-tab" + (tab === t.id ? " active" : "")}
                onClick={() => setTab(t.id)}
              >
                <Icon n={t.icon} size={17} /> {t.label}
              </button>
            ))}
          </div>

          <div className="fade">{body()}</div>
        </div>
      </main>

      <Toast msg={toast} />
    </div>
  );
}
