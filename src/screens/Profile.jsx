import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import LanguagePicker from "../components/LanguagePicker.jsx";
import Bar from "../components/Bar.jsx";
import Ring from "../components/Ring.jsx";

export default function Profile({ s, go, actions, ping }) {
  const [name, setName] = useState(s.name);
  const [email, setEmail] = useState(s.email);
  const [goal, setGoal] = useState(s.learningGoal);
  const [busy, setBusy] = useState(false);
  const completion = Math.min(100, Math.round((s.xp / Math.max(1, s.goal)) * 100));
  const mastered = s.vocab.filter((v) => v.m === 3).length;

  const save = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      await actions.saveProfile({
        display_name: name.trim() || s.name,
        email: email.trim() || s.email,
        learning_goal: goal,
      });
      ping("Profile updated");
    } catch (err) {
      ping(err.message || "Could not save your profile");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container stack">
      <div className="between wrap fade">
        <div>
          <h1 className="display">Profile</h1>
          <p className="body-lg muted" style={{ margin: "4px 0 0" }}>Your account, learning target, and current path.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => go("dash")}>
          <Icon n="arrowL" size={18} /> Back to dashboard
        </button>
      </div>

      <div className="grid g-main">
        <form className="card card-accent" onSubmit={save} style={{ display: "grid", gap: 16 }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="avatar profile-avatar">{(name || "A")[0]}</div>
            <div>
              <h2 className="h2">{name || "Learner"}</h2>
              <div className="small muted">{s.level} {s.levelName} learner</div>
            </div>
          </div>

          <label className="form-line">
            <span className="label">Name</span>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="form-line">
            <span className="label">Email</span>
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="form-line">
            <span className="label">Learning goal</span>
            <select className="field" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>Career confidence</option>
              <option>University readiness</option>
              <option>Interview practice</option>
              <option>Daily communication</option>
            </select>
          </label>

          <div>
            <span className="label">Language you are studying</span>
            <p className="small muted" style={{ margin: "4px 0 10px" }}>
              Each language keeps its own level and progress. Switching does not affect the other courses.
            </p>
            <LanguagePicker
              languages={s.languages}
              activeCourseId={s.course?.id}
              onSwitch={(id) => actions.switchCourse(id)}
            />
          </div>

          <div className="row wrap" style={{ gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"} <Icon n="check" size={18} /></button>
            <button className="btn btn-ghost" type="button" onClick={() => actions.signOut()}>Sign out</button>
          </div>
        </form>

        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <Ring v={completion} size={116} sw={12} tone="var(--secondary)">
              <span style={{ fontWeight: 700, fontSize: 26 }}>{completion}%</span>
            </Ring>
            <h3 className="h2" style={{ margin: "14px 0 4px" }}>Weekly goal</h3>
            <p className="small muted" style={{ margin: 0 }}>{s.xp} of {s.goal} XP</p>
          </div>
          <div className="card card-tight">
            <div className="between small" style={{ marginBottom: 8 }}>
              <span className="label">Lessons complete</span>
              <span className="muted">{s.done.length}</span>
            </div>
            <Bar v={Math.min(100, s.done.length * 16)} tone="green" />
            <div className="between small" style={{ margin: "16px 0 8px" }}>
              <span className="label">Words mastered</span>
              <span className="muted">{mastered} of {s.vocab.length}</span>
            </div>
            <Bar v={(mastered / s.vocab.length) * 100} />
          </div>
        </div>
      </div>
    </div>
  );
}
