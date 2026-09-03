import React from "react";
import Icon from "../components/Icon.jsx";

export default function Practice({ s, go, content, ping }) {
  const PRACTICE = content.practice;
  const weakest = (Object.entries(s.skills).sort((a, b) => a[1] - b[1])[0] || ["Speaking"])[0];
  return (
    <div className="container stack">
      <div>
        <h1 className="display">Practice Hub</h1>
        <p className="body-lg muted" style={{ margin: "6px 0 0" }}>Short drills across all four skills. No lesson needed.</p>
      </div>

      <div>
        <div className="row" style={{ marginBottom: 14 }}>
          <span style={{ color: "var(--tertiary)" }}><Icon n="sparkle" /></span>
          <h2 className="h2">Recommended for you</h2>
        </div>
        <div className="card card-accent" style={{ background: "linear-gradient(120deg,#fff 60%,#fdf1ec 100%)" }}>
          <div className="between wrap" style={{ gap: 20 }}>
            <div style={{ flex: "1 1 320px" }}>
              <div className="row" style={{ marginBottom: 10 }}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: "#fbe3da", color: "var(--primary)", display: "grid", placeItems: "center" }}>
                  <Icon n="mic" size={18} />
                </span>
                <span className="eyebrow">Focus area: {weakest}</span>
              </div>
              <h3 className="h2">Interview practice with the AI tutor</h3>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                Your placement test flagged {weakest.toLowerCase()} as the gap. A live conversation drill gives feedback on
                grammar, vocabulary and fluency as you speak.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => go("tutor")}>Start focus practice</button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="h2" style={{ marginBottom: 16 }}>All modules</h2>
        <div className="grid g-2">
          {PRACTICE.map((p) => {
            const bg = { terra: ["#fbe3da", "var(--primary)"], ochre: ["#ffe9d2", "var(--tertiary)"], green: ["var(--secondary-container)", "var(--secondary)"], quiet: ["var(--sc)", "var(--on-surface-var)"] }[p.tone];
            return (
              <div key={p.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="row">
                  <span style={{ width: 42, height: 42, borderRadius: 10, background: bg[0], color: bg[1], display: "grid", placeItems: "center" }}>
                    <Icon n={p.icon} size={20} />
                  </span>
                  <h3 className="h2" style={{ fontSize: 21 }}>{p.name}</h3>
                </div>
                <p className="small muted" style={{ margin: 0, flex: 1 }}>{p.desc}</p>
                <div className="between" style={{ marginTop: 6 }}>
                  <span className="small muted">{p.n} exercises</span>
                  <button className="btn btn-secondary btn-sm"
                    onClick={() => (p.go === "tutor" ? go("tutor") : p.id === "wr" ? go("path") : ping(`${p.name} drills open in the full app`))}>
                    Start practice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
