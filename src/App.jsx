import React from "react";

import Icon from "./components/Icon.jsx";
import Toast from "./components/Toast.jsx";
import LanguagePicker from "./components/LanguagePicker.jsx";
import { Loading, ErrorState, SetupNeeded } from "./components/States.jsx";
import useLearner from "./hooks/useLearner.js";
import { isConfigured } from "./lib/supabase.js";

import Intro from "./screens/Intro.jsx";
import Test from "./screens/Test.jsx";
import Results from "./screens/Results.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import Path from "./screens/Path.jsx";
import Lesson from "./screens/Lesson.jsx";
import Practice from "./screens/Practice.jsx";
import Vocab from "./screens/Vocab.jsx";
import Tutor from "./screens/Tutor.jsx";
import Progress from "./screens/Progress.jsx";
import Auth from "./screens/Auth.jsx";
import Profile from "./screens/Profile.jsx";

/**
 * Root component. All learner state now lives in Supabase; useLearner loads
 * it, derives the figures the screens show, and exposes the mutations.
 */
export default function App() {
  const { status, error, session, content, s, actions } = useLearner();
  const [toast, setToast] = React.useState("");

  const ping = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const go = actions.go;

  // Every mutation writes to Supabase, then the derived figures refresh.
  const notify = (msg) => msg && ping(msg);

  const nav = [
    { id: "dash", label: "Home", icon: "grid" },
    { id: "path", label: "Courses", icon: "book" },
    { id: "practice", label: "Practice", icon: "dumbbell" },
    { id: "vocab", label: "Vocabulary", icon: "sparkle" },
    { id: "progress", label: "Progress", icon: "trend" },
    { id: "profile", label: "Profile", icon: "users" },
  ];
  const navFor = (id) => (["lesson", "result", "results"].includes(id) ? "path" : id === "tutor" ? "practice" : id);
  const chrome = Boolean(session) && !["intro", "test", "results", "lesson", "tutor", "signin", "signup"].includes(s.screen);

  const view = () => {
    switch (s.screen) {
      case "signin":
      case "signup":
        return <Auth mode={s.screen === "signup" ? "signup" : "signin"} actions={actions} go={go} ping={ping} />;
      case "intro":    return <Intro s={s} go={go} actions={actions} />;
      case "test":     return <Test s={s} go={go} content={content} actions={actions} ping={ping} />;
      case "results":  return <Results s={s} go={go} content={content} />;
      case "dash":     return <Dashboard s={s} go={go} content={content} />;
      case "path":     return <Path s={s} go={go} content={content} ping={ping} />;
      case "lesson":   return <Lesson s={s} go={go} content={content} actions={actions} notify={notify} />;
      case "practice": return <Practice s={s} go={go} content={content} ping={ping} />;
      case "vocab":    return <Vocab s={s} content={content} actions={actions} notify={notify} />;
      case "tutor":    return <Tutor s={s} go={go} content={content} actions={actions} notify={notify} />;
      case "progress": return <Progress s={s} content={content} />;
      case "profile":  return <Profile s={s} go={go} actions={actions} ping={ping} />;
      default:         return null;
    }
  };

  // Gate on connection, then load, then auth.
  if (!isConfigured) return <div className="af"><main className="main"><SetupNeeded /></main></div>;
  if (status === "error") return <div className="af"><main className="main"><ErrorState error={error} onRetry={() => window.location.reload()} /></main></div>;
  if (status === "loading" || !content) return <div className="af"><main className="main"><Loading /></main></div>;

  return (
    <div className="af">
      {chrome && (
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"><img src="/konnect-logo.png" alt="Konnect Academy logo" /></div>
            <div>
              <div className="brand-name">Konnecta Academy</div>
              <div className="brand-sub">LANGUAGE SCHOOL</div>
            </div>
          </div>
          <button className="who who-button" onClick={() => go("profile")}>
            <div className="avatar">{(s.name || "L")[0]}</div>
            <div style={{ minWidth: 0 }}>
              <div className="label">Welcome back</div>
              <div className="small muted">Level: {s.level} {s.levelName}</div>
            </div>
          </button>
          {nav.map((n) => (
            <button key={n.id} className={"nav-item" + (navFor(s.screen) === n.id ? " active" : "")} onClick={() => go(n.id)}>
              <Icon n={n.icon} /> {n.label}
            </button>
          ))}
          <LanguagePicker
            languages={s.languages}
            activeCourseId={s.course?.id}
            onSwitch={(id) => actions.switchCourse(id)}
          />

          <div className="sidebar-foot">
            <button className="btn btn-primary btn-block" onClick={() => ping("Live classes are not part of this demo")}>
              Book a class
            </button>
            <button className="nav-item" onClick={() => actions.refresh().then(() => ping("Refreshed from the database"))}>
              <Icon n="refresh" /> Refresh data
            </button>
            <button className="nav-item" onClick={() => go("profile")}>
              <Icon n="gear" /> Account settings
            </button>
            <button className="nav-item" onClick={() => actions.signOut()}>
              <Icon n="lock" /> Sign out
            </button>
          </div>
        </aside>
      )}

      <main className="main">
        {chrome && (
          <div className="topbar">
            <div className="topbar-brand">
              <img src="/konnect-logo.png" alt="Konnect Academy logo" />
              <span>Konnecta Academy</span>
            </div>
            <div className="topbar-stats">
              <div className="chip" title="Day streak"><span style={{ color: "var(--primary)" }}><Icon n="flame" size={16} /></span>{s.streak}</div>
              <div className="chip" title="Weekly XP"><span style={{ color: "var(--tertiary)" }}><Icon n="medal" size={16} /></span>{s.xp}</div>
              <button className="avatar avatar-button" onClick={() => go("profile")} title="Profile" style={{ width: 34, height: 34, flex: "0 0 34px", fontSize: 14 }}>{(s.name || "L")[0]}</button>
            </div>
          </div>
        )}
        {view()}
      </main>

      {chrome && (
        <nav className="tabbar">
          {nav.map((n) => (
            <button key={n.id} className={"tab" + (navFor(s.screen) === n.id ? " active" : "")} onClick={() => go(n.id)}>
              <Icon n={n.icon} size={22} /> {n.label}
            </button>
          ))}
        </nav>
      )}
      <Toast msg={toast} />
    </div>
  );
}
