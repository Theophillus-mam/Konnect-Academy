import React, { useState, useEffect, useRef } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import Ring from "../components/Ring.jsx";

export default function Tutor({ s, go, content, actions, notify }) {
  const TUTOR = content.scenario?.turns || [];
  const [turn, setTurn] = useState(0);
  if (!TUTOR.length) return null;
  const [log, setLog] = useState([{ who: "tutor", text: TUTOR[0].says }]);
  const [fb, setFb] = useState([]);
  const [scores, setScores] = useState({ Grammar: 70, Vocabulary: 68, Fluency: 72 });
  const [typing, setTyping] = useState(false);
  const [free, setFree] = useState("");
  const [over, setOver] = useState(false);
  const [hint, setHint] = useState(false);
  const endRef = useRef(null);
  const scoresRef = useRef(scores);
  useEffect(() => { scoresRef.current = scores; }, [scores]);
  const step = TUTOR[Math.min(turn, TUTOR.length - 1)];

  useEffect(() => { endRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" }); }, [log, typing]);

  const overall = Math.round((scores.Grammar + scores.Vocabulary + scores.Fluency) / 3);

  const send = (reply) => {
    setLog((l) => [...l, { who: "me", text: reply.t }]);
    setTyping(true);
    setScores((p) => ({
      Grammar: Math.max(30, Math.min(99, p.Grammar + (reply.score - 1.5) * 7)),
      Vocabulary: Math.max(30, Math.min(99, p.Vocabulary + (reply.score - 1.5) * 6)),
      Fluency: Math.max(30, Math.min(99, p.Fluency + (reply.score - 1.5) * 5)),
    }));
    if (reply.fb) setFb((f) => [reply.fb, ...f].slice(0, 3));
    setTimeout(() => {
      setTyping(false);
      const isLast = turn >= TUTOR.length - 1;
      setLog((l) => [...l, { who: "tutor", text: step.then }]);
      if (isLast) {
        setOver(true);
        actions.finishTutor(scoresRef.current)
          .then(() => notify("+40 XP · session saved"))
          .catch((err) => notify(err.message || "Could not save the session"));
      } else {
        setTurn((t) => t + 1);
        setTimeout(() => setLog((l) => [...l, { who: "tutor", text: TUTOR[turn + 1].says }]), 700);
      }
    }, 1100);
  };

  const sendFree = () => {
    if (!free.trim()) return;
    const words = free.trim().split(/\s+/).length;
    send({ t: free.trim(), score: words > 12 ? 3 : words > 6 ? 2 : 1, fb: words > 12
      ? { good: "Good length — you gave the interviewer something to follow up on." }
      : { note: "Try a longer answer. Two or three sentences gives the interviewer room to ask more." } });
    setFree("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" style={{ padding: 0 }} onClick={() => go("practice")}>
          <Icon n="x" size={18} /> End session
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="label">Interview practice</div>
          <div className="small muted">Level: {s.level} {s.levelName}</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setHint((h) => !h)}>
          <Icon n="bulb" size={16} /> Hint
        </button>
      </div>

      <div className="container" style={{ paddingTop: 24 }}>
        <div className="grid g-main" style={{ alignItems: "start" }}>
          <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 520 }}>
            <div className="row" style={{ padding: 16, background: "var(--sc)", gap: 12 }}>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--secondary-container)", color: "var(--secondary)", display: "grid", placeItems: "center" }}>
                <Icon n="flag" size={17} />
              </span>
              <div>
                <div className="eyebrow" style={{ color: "var(--on-surface-var)" }}>Current goal</div>
                <div className="label">{step.goal}</div>
              </div>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {log.map((m, i) => (
                <div key={i} className="fade" style={{ display: "flex", flexDirection: "column", alignItems: m.who === "me" ? "flex-end" : "flex-start" }}>
                  <div className={"bubble " + (m.who === "me" ? "me" : "tutor")}>{m.text}</div>
                  {m.who === "tutor" && (
                    <button className="btn btn-ghost btn-sm small row" style={{ gap: 5, padding: "4px 0", minHeight: 0 }}>
                      <Icon n="volume" size={14} /> Listen
                    </button>
                  )}
                </div>
              ))}
              {typing && (
                <div className="bubble tutor muted small fade" style={{ width: "fit-content" }}>Tutor is responding…</div>
              )}
              <div ref={endRef} />
            </div>

            <div style={{ borderTop: "1px solid var(--sc-highest)", padding: 18 }}>
              {over ? (
                <div style={{ textAlign: "center" }}>
                  <div className="row" style={{ justifyContent: "center", color: "var(--secondary)", marginBottom: 8 }}>
                    <Icon n="check" size={20} /><span className="label">Session complete — {overall}/100</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => go("practice")}>Back to practice</button>
                </div>
              ) : (
                <>
                  {hint && (
                    <div className="fade" style={{ background: "#fff6ec", borderLeft: "4px solid var(--tertiary)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                      <div className="small"><strong style={{ color: "var(--tertiary)" }}>Hint: </strong>
                        Aim for two or three sentences. Name the fact, then add one specific detail — a place, a number, or a result.</div>
                    </div>
                  )}
                  <div className="small muted" style={{ marginBottom: 10 }}>Choose a reply, or write your own:</div>
                  <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                    {step.replies.map((r, i) => (
                      <button key={i} className="opt" disabled={typing} style={{ padding: "12px 14px" }} onClick={() => send(r)}>
                        <span style={{ color: "var(--primary)", marginTop: 2 }}><Icon n="chat" size={16} /></span>
                        <span className="small">{r.t}</span>
                      </button>
                    ))}
                  </div>
                  <div className="row" style={{ gap: 10 }}>
                    <input className="field" placeholder="Type your answer…" value={free} disabled={typing}
                      onChange={(e) => setFree(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendFree()} />
                    <button className="mic" style={{ width: 46, height: 46 }} onClick={sendFree} aria-label="Send answer">
                      <Icon n="mic" size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            <div className="card">
              <div className="eyebrow" style={{ color: "var(--on-surface-var)", marginBottom: 14 }}>Live conversation score</div>
              <div className="row" style={{ gap: 16, marginBottom: 18 }}>
                <Ring v={overall} size={80} sw={8} tone="var(--secondary)">
                  <span style={{ fontWeight: 700, fontSize: 24 }}>{overall}</span>
                </Ring>
                <div>
                  <div className="h2">{overall >= 85 ? "Excellent" : overall >= 70 ? "Solid" : "Building"}</div>
                  <div className="small muted">{overall >= 70 ? "Keep it up." : "Longer answers will lift this."}</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {Object.entries(scores).map(([k, v]) => (
                  <div key={k}>
                    <div className="between small" style={{ marginBottom: 5 }}>
                      <span className="label">{k}</span><span className="muted">{Math.round(v)}%</span>
                    </div>
                    <Bar v={v} tone={v >= 75 ? "green" : ""} h />
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="between" style={{ marginBottom: 14 }}>
                <h3 className="h3">Feedback</h3>
                <span style={{ color: "var(--tertiary)" }}><Icon n="bulb" size={18} /></span>
              </div>
              {fb.length === 0 && <p className="small muted" style={{ margin: 0 }}>Answer the tutor and corrections appear here as you go.</p>}
              <div style={{ display: "grid", gap: 12 }}>
                {fb.map((f, i) => (
                  <div key={i} className="fade" style={{ padding: 12, borderRadius: 8, background: f.fix ? "var(--error-container)" : "var(--sc-low)" }}>
                    {f.fix && (
                      <>
                        <div className="small row" style={{ color: "var(--on-error-container)", gap: 6 }}>
                          <Icon n="x" size={14} /> <s>{f.fix[0]}</s>
                        </div>
                        <div className="small row" style={{ color: "var(--secondary)", gap: 6, marginTop: 4 }}>
                          <Icon n="check" size={14} /> {f.fix[1]}
                        </div>
                      </>
                    )}
                    {f.good && <div className="small"><strong style={{ color: "var(--secondary)" }}>Nice: </strong>{f.good}</div>}
                    {f.note && <div className="small"><strong style={{ color: "var(--tertiary)" }}>Tip: </strong>{f.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
