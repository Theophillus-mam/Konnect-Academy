import React, { useState } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";

export default function Test({ s, go, content, actions, ping }) {
  const PLACEMENT = content.placement;
  const [saving, setSaving] = useState(false);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [answers, setAnswers] = useState([]);
  const q = PLACEMENT[i];
  const last = i === PLACEMENT.length - 1;

  const next = async () => {
    const all = [...answers, q.options[pick].p];
    if (!last) { setAnswers(all); setPick(null); setI(i + 1); window.scrollTo?.({ top: 0, behavior: "smooth" }); return; }

    // Score the test, then persist the level and per-skill breakdown.
    const total = all.reduce((a, b) => a + b, 0);
    const skills = {};
    PLACEMENT.forEach((qq, k) => { skills[qq.skill] = [38, 66, 90][all[k]]; });
    try {
      setSaving(true);
      await actions.submitPlacement(total, skills);
      go("results");
    } catch (err) {
      ping(err.message || "Could not save your results");
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="between" style={{ marginBottom: 10 }}>
        <span className="label" style={{ color: "var(--primary)" }}>{q.skill} · {q.tag}</span>
        <span className="small muted">Question {i + 1} of {PLACEMENT.length}</span>
      </div>
      <Bar v={((i + 1) / PLACEMENT.length) * 100} />
      <div className="card fade" key={i} style={{ marginTop: 26 }}>
        {q.context && <div className="quote" style={{ marginBottom: 20, fontStyle: "italic" }}>{q.context}</div>}
        <h2 className="h2" style={{ marginBottom: 22 }}>{q.prompt}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {q.options.map((o, k) => (
            <button key={k} className={"opt" + (pick === k ? " sel" : "")} onClick={() => setPick(k)}>
              <span className="radio" /><span>{o.t}</span>
            </button>
          ))}
        </div>
        <hr className="rule" style={{ margin: "24px 0 20px" }} />
        <div className="between">
          <span className="small muted">No wrong turns — a guess still tells us something.</span>
          <button className="btn btn-primary" disabled={pick === null || saving} onClick={next}>
            {saving ? "Saving…" : last ? "See my level" : "Next"} <Icon n="arrowR" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
