import React from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import Ring from "../components/Ring.jsx";
import { DAYS } from "../lib/stats.js";

export default function Dashboard({ s, go, content }) {
  const { modules: MODULES, lessons: LESSONS } = content;
  const all = MODULES.flatMap((m) => m.lessons);
  const nextId = all.find((id) => !s.done.includes(id)) || all[0];
  const next = LESSONS[nextId];
  if (!next) return null;
  const pct = Math.min(100, (s.xp / s.goal) * 100);
  const due = s.vocab.filter((v) => v.m < 3).length;

  return (
    <div className="container stack">
      <div className="fade">
        <h1 className="display">Hi, {s.name}</h1>
        <p className="body-lg muted" style={{ margin: "4px 0 0" }}>
          {s.done.length === 0 ? "Ready to start? One lesson is about 15 minutes." : `${s.done.length} lesson${s.done.length > 1 ? "s" : ""} down. Keep the streak alive.`}
        </p>
      </div>

      <div className="grid g-main">
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="between">
            <span className="pill pill-terra">NEXT LESSON</span>
            <span className="small muted row" style={{ gap: 6 }}><Icon n="clock" size={15} /> 15 mins</span>
          </div>
          <h2 className="h1">{next.title}</h2>
          <p className="muted" style={{ margin: 0 }}>{next.desc}</p>
          <div className="between wrap" style={{ marginTop: "auto", paddingTop: 12 }}>
            <span className="small muted">{next.questions.length} questions · {next.tag}</span>
            <button className="btn btn-primary" onClick={() => go("lesson", { activeLesson: next.id })}>
              Start lesson <Icon n="arrowR" size={18} />
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <div className="card card-tight row" style={{ gap: 18 }}>
            <Ring v={(s.streak / 30) * 100} size={78} sw={8}>
              <span style={{ color: "var(--primary)" }}><Icon n="flame" size={26} /></span>
            </Ring>
            <div>
              <div className="h1" style={{ fontSize: 28 }}>{s.streak} days</div>
              <div className="eyebrow" style={{ color: "var(--on-surface-var)" }}>Current streak</div>
            </div>
          </div>
          <div className="card card-tight">
            <div className="label muted" style={{ marginBottom: 4 }}>Weekly goal</div>
            <div className="row" style={{ alignItems: "baseline", gap: 6, marginBottom: 12 }}>
              <span className="h1" style={{ fontSize: 30 }}>{s.xp}</span>
              <span className="muted">/ {s.goal} XP</span>
            </div>
            <Bar v={pct} tone="green" />
            <div className="small muted" style={{ marginTop: 8 }}>
              {pct >= 100 ? "Goal reached — well done." : `${s.goal - s.xp} XP to go`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid g-main">
        <div className="card card-accent">
          <div className="between" style={{ marginBottom: 16 }}>
            <h2 className="h2">Vocabulary mastery</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => go("vocab")}>View all</button>
          </div>
          <div className="grid g-2" style={{ gap: 12 }}>
            {s.vocab.slice(0, 3).map((v) => (
              <button key={v.w} className="card-quiet" style={{ borderRadius: 8, padding: 14, textAlign: "center" }} onClick={() => go("vocab")}>
                <div className="label" style={{ fontSize: 16 }}>{v.w}</div>
                <div className="dots" style={{ marginTop: 8 }}>
                  {[0, 1, 2].map((d) => <span key={d} className={"dot" + (d < v.m ? " on" : "")} />)}
                </div>
              </button>
            ))}
            <button className="card-quiet" style={{ borderRadius: 8, padding: 14, textAlign: "center", borderStyle: "dashed", borderColor: "var(--outline-var)" }} onClick={() => go("vocab")}>
              <div style={{ color: "var(--primary)", display: "grid", placeItems: "center" }}><Icon n="refresh" size={18} /></div>
              <div className="small muted" style={{ marginTop: 6 }}>{due} due for review</div>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="h2" style={{ marginBottom: 18 }}>This week</h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
            {s.week.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: "100%", height: `${Math.max(4, v)}%`, minHeight: 4, borderRadius: 6,
                  background: i === s.today ? "var(--primary)" : v > 0 ? "var(--secondary-container)" : "var(--sc-high)",
                  transition: "height .6s cubic-bezier(.2,.8,.2,1)",
                }} />
                <span className="small" style={{ color: i === s.today ? "var(--primary)" : "var(--on-surface-var)", fontWeight: i === s.today ? 700 : 400 }}>
                  {DAYS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
