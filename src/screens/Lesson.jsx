import React, { useState, useEffect } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import Ring from "../components/Ring.jsx";

export default function Lesson({ s, go, content, actions, notify }) {
  const { modules: MODULES, lessons: LESSONS } = content;
  const l = LESSONS[s.activeLesson] || Object.values(LESSONS)[0];
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(12);
  const [done, setDone] = useState(false);
  const [earned, setEarned] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const q = l.questions[i];
  const isRight = pick === q.answer;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => Math.min(45, x + 1)), 220);
    return () => clearInterval(id);
  }, [playing]);
  useEffect(() => { if (t >= 45) setPlaying(false); }, [t]);

  const check = () => { setChecked(true); if (pick === q.answer) setCorrect((c) => c + 1); };
  const advance = async () => {
    if (i < l.questions.length - 1) { setI(i + 1); setPick(null); setChecked(false); setT(12); setPlaying(false); return; }
    try {
      setSaving(true);
      setSaveError(null);
      const xp = await actions.completeLesson(l.id, correct, l.questions.length);
      setEarned(xp);
      notify(`+${xp} XP saved`);
      setDone(true);
    } catch (err) {
      setSaveError(err.message || "Could not save your progress");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    const all = l.questions.length;
    const nextId = MODULES.flatMap((m) => m.lessons).find((id) => id !== l.id && !s.done.includes(id));
    return (
      <div className="container fade" style={{ maxWidth: 560 }}>
        <div className="card" style={{ textAlign: "center", padding: 40, marginTop: 40 }}>
          <Ring v={(correct / all) * 100} size={132} sw={12} tone={correct === all ? "var(--secondary)" : "var(--primary)"}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{correct}/{all}</div>
              <div className="small muted">correct</div>
            </div>
          </Ring>
          <h2 className="h1" style={{ margin: "22px 0 8px" }}>{l.title} complete</h2>
          <p className="muted" style={{ margin: "0 0 6px" }}>
            {correct === all ? "A clean run — nothing to review here."
              : correct >= all - 1 ? "Strong. The one you missed will come back in practice."
              : "Worth a second pass. The explanations are the useful part."}
          </p>
          <div className="row" style={{ justifyContent: "center", gap: 8, margin: "18px 0 26px" }}>
            <span className="pill pill-ochre"><Icon n="zap" size={13} /> +{earned} XP</span>
            <span className="pill pill-green"><Icon n="flame" size={13} /> Streak kept</span>
          </div>
          <div className="row" style={{ gap: 12, justifyContent: "center" }} >
            <button className="btn btn-secondary" onClick={() => go("path")}>Back to path</button>
            {nextId && (
              <button className="btn btn-primary" onClick={() => {
                setDone(false); setI(0); setPick(null); setChecked(false); setCorrect(0);
                go("lesson", { activeLesson: nextId });
              }}>
                Next lesson <Icon n="arrowR" size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const pct = Math.round(((i + (checked ? 1 : 0)) / l.questions.length) * 100);

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="between" style={{ marginBottom: 10 }}>
        <button className="btn btn-ghost btn-sm" style={{ padding: 0 }} onClick={() => go("path")}>
          <Icon n="arrowL" size={16} /> Leave lesson
        </button>
        <span className="label" style={{ color: "var(--primary)" }}>{pct}% complete</span>
      </div>
      <Bar v={pct} />

      <div className="card fade" key={i} style={{ marginTop: 24 }}>
        <span className="pill pill-ochre">{l.tag} · {l.title}</span>
        <h2 className="h1" style={{ margin: "16px 0 8px", fontSize: 26, lineHeight: "34px" }}>{q.prompt}</h2>

        {q.quote && (
          <div className="quote" style={{ margin: "20px 0" }}>
            <div className="label muted" style={{ marginBottom: 6 }}>From: {q.quote.from}</div>
            <div style={{ fontStyle: "italic" }}>“{q.quote.text}”</div>
          </div>
        )}

        {q.audio && (
          <div style={{ background: "#effaf3", borderRadius: 8, padding: 14, display: "flex", alignItems: "center", gap: 14, margin: "18px 0" }}>
            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause audio" : "Play audio"}
              style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--secondary)", color: "#fff", display: "grid", placeItems: "center", flex: "0 0 42px" }}>
              <Icon n={playing ? "volume" : "play"} size={20} />
            </button>
            <div style={{ flex: 1 }}>
              <Bar v={(t / 45) * 100} tone="green" h />
              <div className="between small muted" style={{ marginTop: 6 }}>
                <span>0:{String(t).padStart(2, "0")}</span><span>0:45</span>
              </div>
            </div>
            <span className="small muted" style={{ whiteSpace: "nowrap" }}>Audio simulated</span>
          </div>
        )}

        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {q.options.map((o, k) => {
            let cls = "opt";
            if (checked) {
              if (k === q.answer) cls += " ok";
              else if (k === pick) cls += " bad shake";
              else cls += " dim";
            } else if (pick === k) cls += " sel";
            return (
              <button key={k} className={cls} disabled={checked} onClick={() => setPick(k)}>
                <span className="radio" /><span>{o}</span>
              </button>
            );
          })}
        </div>

        {checked && (
          <div className="fade" style={{
            marginTop: 20, padding: 18, borderRadius: 8,
            background: isRight ? "#effaf3" : "var(--error-container)",
            borderLeft: `4px solid ${isRight ? "var(--secondary)" : "var(--error)"}`,
          }}>
            <div className="row" style={{ marginBottom: 6, color: isRight ? "var(--secondary)" : "var(--on-error-container)" }}>
              <Icon n={isRight ? "check" : "bulb"} size={18} />
              <span className="label">{isRight ? "That's it" : "Not quite"}</span>
            </div>
            <p className="small" style={{ margin: 0 }}>{q.why}</p>
          </div>
        )}

        {saveError && <div className="auth-error" style={{ marginTop: 16 }}>{saveError}</div>}

        <hr className="rule" style={{ margin: "24px 0 18px" }} />
        <div className="between">
          <span className="small muted">Question {i + 1} of {l.questions.length}</span>
          {checked ? (
            <button className="btn btn-primary" onClick={advance} disabled={saving}>
              {saving ? "Saving…" : i === l.questions.length - 1 ? "Finish lesson" : "Next question"} <Icon n="arrowR" size={18} />
            </button>
          ) : (
            <button className="btn btn-primary" disabled={pick === null} onClick={check}>
              Check answer <Icon n="check" size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
