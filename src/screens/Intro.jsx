import React from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import LanguagePicker from "../components/LanguagePicker.jsx";

export default function Intro({ s, go, actions }) {
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="between" style={{ marginBottom: 10 }}>
        <span className="label" style={{ color: "var(--primary)" }}>Introduction</span>
        <span className="small muted">Step 1 of 5</span>
      </div>
      <Bar v={20} />
      <div className="card fade" style={{ marginTop: 28, padding: 0, overflow: "hidden" }}>
        <div className="hero-band" style={{ borderRadius: 0, textAlign: "center", padding: "40px 28px 32px" }}>
          <div style={{ display: "inline-grid", placeItems: "center", width: 62, height: 62, borderRadius: 18, background: "var(--primary)", color: "#fff", marginBottom: 16 }}>
            <Icon n="cap" size={30} />
          </div>
          <h1 className="display">Let's find your starting point</h1>
        </div>
        <div style={{ padding: 28 }}>
          <p className="body-lg muted" style={{ textAlign: "center", margin: "0 0 26px" }}>
            Six short questions across the four skills{s.languageName ? ` in ${s.languageName}` : ""}. Your answers set
            your level and shape the lessons you get — there is nothing to revise for.
          </p>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="label muted" style={{ marginBottom: 8 }}>Studying the wrong language?</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LanguagePicker
                languages={s.languages}
                activeCourseId={s.course?.id}
                onSwitch={(id) => actions.switchCourse(id)}
                compact
              />
            </div>
          </div>

          <div className="grid g-2" style={{ gap: 12 }}>
            {[["book", "Reading"], ["head", "Listening"], ["pen", "Writing"], ["mic", "Speaking"]].map(([i, n]) => (
              <div key={n} className="card-quiet" style={{ borderRadius: 8, padding: "16px 12px", textAlign: "center" }}>
                <span style={{ color: "var(--secondary)" }}><Icon n={i} size={22} /></span>
                <div className="label" style={{ marginTop: 6 }}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#effaf3", borderRadius: 8, padding: 16, display: "flex", gap: 12, margin: "24px 0 28px" }}>
            <span style={{ color: "var(--secondary)", marginTop: 2 }}><Icon n="check" size={18} /></span>
            <div className="small">
              <strong>CEFR mapping.</strong> Results map to the Common European Framework, from A1 through C2 — the same
              scale employers and universities recognise.
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <button className="btn btn-primary" onClick={() => go("test")}>Start the test <Icon n="arrowR" size={18} /></button>
            <div className="small muted" style={{ marginTop: 12 }}>About 4 minutes</div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}
              onClick={() => go("dash")}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
