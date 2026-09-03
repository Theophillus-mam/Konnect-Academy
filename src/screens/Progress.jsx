import React, { useState, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import Ring from "../components/Ring.jsx";
import { skillBand } from "../lib/stats.js";

export default function Progress({ s, content }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 100); return () => clearTimeout(t); }, []);
  // Real counts from the vocabulary the learner has actually touched.
  const learned = s.vocab.filter((v) => v.reviews > 0 || v.m > 0).length;
  const mastered = s.vocab.filter((v) => v.m === 3).length;
  const pct = learned === 0 ? 0 : Math.round((mastered / learned) * 100);
  const main = [["Reading", "book"], ["Writing", "pen"], ["Listening", "head"], ["Speaking", "mic"]];

  return (
    <div className="container stack">
      <div>
        <h1 className="display">Your progress</h1>
        <p className="body-lg muted" style={{ margin: "6px 0 0" }}>Everything you've done, measured against the CEFR scale.</p>
      </div>

      <div className="grid g-main">
        <div className="card">
          <div className="row" style={{ marginBottom: 6 }}>
            <span style={{ color: "var(--primary)" }}><Icon n="target" /></span>
            <h2 className="h2">CEFR mastery</h2>
          </div>
          <p className="small muted" style={{ marginTop: 0, marginBottom: 20 }}>Current proficiency across the four skills.</p>
          <div className="grid g-2" style={{ gap: 14 }}>
            {main.map(([k, ic]) => {
              const v = s.skills[k] ?? 0;
              return (
                <div key={k} className="card-quiet" style={{ borderRadius: 8, padding: 14 }}>
                  <div className="between" style={{ marginBottom: 10 }}>
                    <span className="row" style={{ gap: 8 }}>
                      <span style={{ color: "var(--on-surface-var)" }}><Icon n={ic} size={17} /></span>
                      <span className="label">{k}</span>
                    </span>
                    <span className={"pill " + (v >= 85 ? "pill-green" : v >= 65 ? "pill-terra" : "pill-grey")}>{skillBand(v)}</span>
                  </div>
                  <Bar v={show ? v : 0} tone={v >= 85 ? "green" : v >= 65 ? "" : "ochre"} h />
                </div>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ background: "linear-gradient(160deg,#fdf1ec,#fff)", textAlign: "center" }}>
          <span style={{ color: "var(--primary)" }}><Icon n="flame" size={38} /></span>
          <div className="display" style={{ fontSize: 46, margin: "6px 0 0" }}>{s.streak}</div>
          <div className="eyebrow" style={{ color: "var(--on-surface-var)" }}>Day streak</div>
          <div className="row" style={{ justifyContent: "center", gap: 10, marginTop: 20 }}>
            {[["star", "var(--tertiary)", "#ffe9d2"], ["check", "var(--secondary)", "var(--secondary-container)"], ["cap", "var(--outline)", "var(--sc-high)"]].map(([i, c, b], k) => (
              <span key={k} title="Achievement badge" style={{ width: 44, height: 44, borderRadius: "50%", background: b, color: c, display: "grid", placeItems: "center" }}>
                <Icon n={i} size={20} />
              </span>
            ))}
          </div>
          <div className="small muted" style={{ marginTop: 14 }}>
            {s.done.length} lesson{s.done.length === 1 ? "" : "s"} · {s.xp} XP this week
          </div>
        </div>
      </div>

      <div className="card card-accent">
        <div className="between wrap" style={{ gap: 28 }}>
          <div style={{ flex: "1 1 320px" }}>
            <div className="row" style={{ marginBottom: 6 }}>
              <span style={{ color: "var(--primary)" }}><Icon n="sparkle" /></span>
              <h2 className="h2">Vocabulary engine</h2>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>You are steadily building your professional lexicon.</p>
            <div className="row" style={{ gap: 40, marginTop: 20 }}>
              <div>
                <div className="display" style={{ fontSize: 38, color: "var(--primary)" }}>{learned}</div>
                <div className="eyebrow" style={{ color: "var(--on-surface-var)" }}>Words started</div>
              </div>
              <div>
                <div className="display" style={{ fontSize: 38, color: "var(--secondary)" }}>{mastered}</div>
                <div className="eyebrow" style={{ color: "var(--on-surface-var)" }}>Words mastered</div>
              </div>
            </div>
          </div>
          <Ring v={show ? pct : 0} size={168} sw={20} tone="var(--secondary)" track="var(--sc)">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{pct}%</div>
              <div className="small muted">mastery</div>
            </div>
          </Ring>
        </div>
      </div>
    </div>
  );
}
