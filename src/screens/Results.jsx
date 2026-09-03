import React, { useState, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import { skillBand } from "../lib/stats.js";

export default function Results({ s, go, content }) {
  const firstLesson = content.modules[0]?.lessons[0];
  const entries = Object.entries(s.skills);
  // Skills arrive from user_skills, so guard the empty case rather than
  // reducing an empty array.
  const ranked = [...entries].sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 120); return () => clearTimeout(t); }, []);

  return (
    <div className="container stack" style={{ maxWidth: 940 }}>
      <div className="hero-band fade" style={{ textAlign: "center", padding: "40px 24px" }}>
        <h1 className="display" style={{ color: "var(--primary)" }}>Test complete</h1>
        <p className="body-lg muted" style={{ maxWidth: 520, margin: "12px auto 26px" }}>
          We looked at all six answers together. Here is where you're starting from — it will move as you work.
        </p>
        <div style={{ display: "inline-block", border: "2px solid var(--primary)", borderRadius: 12, padding: "16px 40px", background: "var(--sc-lowest)" }}>
          <div className="eyebrow">Overall level</div>
          <div style={{ fontSize: 46, fontWeight: 700, color: "var(--primary)", lineHeight: "52px" }}>{s.level}</div>
          <div className="label muted">{s.levelName}</div>
        </div>
      </div>

      <div className="grid g-main">
        <div className="card">
          <div className="row" style={{ marginBottom: 20 }}>
            <span style={{ color: "var(--primary)" }}><Icon n="trend" /></span>
            <h2 className="h2">Skill breakdown</h2>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {entries.map(([k, v]) => (
              <div key={k}>
                <div className="between" style={{ marginBottom: 6 }}>
                  <span className="label">{k}</span>
                  <span className="small muted">{skillBand(v)}</span>
                </div>
                <Bar v={show ? v : 0} tone={v >= 65 ? "" : "ochre"} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <div className="card" style={{ borderLeft: "4px solid var(--secondary)" }}>
            <div className="eyebrow" style={{ color: "var(--secondary)" }}>Strongest skill</div>
            <h3 className="h2" style={{ margin: "6px 0 8px" }}>{best?.[0] || "—"}</h3>
            <p className="small muted" style={{ margin: 0 }}>
              You handled the {(best?.[0] || "this skill").toLowerCase()} question cleanly. We'll keep this one stretched rather than drilled.
            </p>
          </div>
          <div className="card" style={{ borderLeft: "4px solid var(--tertiary)" }}>
            <div className="eyebrow" style={{ color: "var(--tertiary)" }}>Focus area</div>
            <h3 className="h2" style={{ margin: "6px 0 8px" }}>{worst?.[0] || "—"}</h3>
            <p className="small muted" style={{ margin: 0 }}>
              Early lessons will spend extra time here before moving on.
            </p>
          </div>
        </div>
      </div>

      <div className="card card-quiet" style={{ textAlign: "center", padding: 32 }}>
        <h2 className="h2">Your starting point</h2>
        <p className="muted" style={{ maxWidth: 520, margin: "10px auto 22px" }}>
          Based on your answers we've unlocked the workplace track at {s.level}, beginning with sentence structure.
        </p>
        <div className="card" style={{ maxWidth: 420, margin: "0 auto 22px", display: "flex", gap: 14, alignItems: "center", textAlign: "left" }}>
          <div className="mod-dot" style={{ width: 40, height: 40, flex: "0 0 40px" }}><Icon n="play" size={18} /></div>
          <div>
            <div className="eyebrow">Module 1 · Lesson 1</div>
            <div className="h3">Complex Sentences</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => go("lesson", { activeLesson: firstLesson })}>
          Start first lesson <Icon n="arrowR" size={18} />
        </button>
        <div><button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => go("dash")}>Go to dashboard</button></div>
      </div>
    </div>
  );
}
