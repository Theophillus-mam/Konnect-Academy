import React, { useState, useMemo } from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";
import PronunciationRecorder from "../components/PronunciationRecorder.jsx";

export default function Vocab({ s, content, actions, notify }) {
  const [speakFor, setSpeakFor] = useState(null);   // vocabulary id being recorded
  const [savingRec, setSavingRec] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [mode, setMode] = useState("grid");
  const [busy, setBusy] = useState(false);
  const queue = useMemo(() => s.vocab.map((v, i) => i).filter((i) => s.vocab[i].m < 3), [s.vocab]);
  const cur = s.vocab[queue[idx % Math.max(1, queue.length)]];

  const grade = async (up) => {
    const card = s.vocab[queue[idx % Math.max(1, queue.length)]];
    if (!card || busy) return;
    const next = Math.max(0, Math.min(3, card.m + (up ? 1 : -1)));
    try {
      setBusy(true);
      setFlip(false);
      await actions.gradeVocab(card.id, next, card.reviews + 1, up);
      if (up) notify("+5 XP · word reviewed");
      setIdx((x) => x + 1);
    } catch (err) {
      notify(err.message || "Could not save the review");
    } finally {
      setBusy(false);
    }
  };

  const mastered = s.vocab.filter((v) => v.m === 3).length;

  return (
    <div className="container stack">
      <div className="card card-accent">
        <div className="between wrap" style={{ gap: 20 }}>
          <div style={{ flex: "1 1 340px" }}>
            <div className="eyebrow row" style={{ gap: 8 }}><Icon n="sparkle" size={15} /> Vocabulary engine</div>
            <h1 className="display" style={{ margin: "8px 0 6px" }}>Workplace English</h1>
            <p className="muted" style={{ margin: 0, maxWidth: 520 }}>
              The words that carry professional conversations. Cards you get wrong come back sooner.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setMode(mode === "grid" ? "review" : "grid"); setFlip(false); }}>
            <Icon n={mode === "grid" ? "zap" : "grid"} size={18} />
            {mode === "grid" ? "Start review" : "Back to list"}
          </button>
        </div>
      </div>

      <div className="between">
        <h2 className="h2">{mode === "grid" ? "Your words" : "Spaced repetition review"}</h2>
        <span className="chip"><span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--secondary)" }} />
          {mastered} of {s.vocab.length} mastered</span>
      </div>

      {mode === "grid" ? (
        <div className="grid g-3">
          {s.vocab.map((v) => (
            <div key={v.w} className={"card " + (v.m === 3 ? "card-accent-g" : "card-accent")}>
              <div className="between">
                <h3 className="h2" style={{ fontSize: 21 }}>{v.w}</h3>
                <span style={{ color: v.m === 3 ? "var(--secondary)" : "var(--sc-highest)" }}><Icon n="check" size={20} /></span>
              </div>
              <div className="small muted" style={{ fontStyle: "italic", marginBottom: 10 }}>{v.pos}</div>
              <div style={{ marginBottom: 12 }}>{v.def}</div>
              <div className="card-quiet" style={{ borderRadius: 8, padding: 12, fontSize: 14, lineHeight: "22px" }}>
                “{v.ex.split(new RegExp(`(${v.w.split(" ")[0]}\\w*)`, "i")).map((part, i) =>
                  part.toLowerCase().startsWith(v.w.split(" ")[0].toLowerCase())
                    ? <strong key={i} style={{ color: "var(--primary)" }}>{part}</strong> : part)}”
              </div>
              <button
                className="btn btn-secondary btn-sm btn-block"
                style={{ marginTop: 14 }}
                onClick={() => setSpeakFor(speakFor === v.id ? null : v.id)}
              >
                <Icon n="mic" size={16} /> {speakFor === v.id ? "Close recorder" : "Practise saying it"}
              </button>

              {speakFor === v.id && (
                <div style={{ marginTop: 14 }}>
                  <PronunciationRecorder
                    word={v.w}
                    languageCode={s.languageCode}
                    saving={savingRec}
                    compact
                    onSave={async (clip) => {
                      setSavingRec(true);
                      try {
                        const { uploadError } = await actions.savePronunciation(v.id, v.w, clip);
                        notify(uploadError ? "Attempt saved, audio upload failed" : "Recording saved");
                      } finally {
                        setSavingRec(false);
                      }
                    }}
                  />
                </div>
              )}

              <div className="between" style={{ marginTop: 14 }}>
                <span className="small muted">Mastery</span>
                <span className="label" style={{ color: v.m === 3 ? "var(--secondary)" : "var(--primary)" }}>{Math.round((v.m / 3) * 100)}%</span>
              </div>
              <Bar v={(v.m / 3) * 100} tone={v.m === 3 ? "green" : ""} h />
            </div>
          ))}
        </div>
      ) : queue.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <span style={{ color: "var(--secondary)" }}><Icon n="check" size={42} /></span>
          <h3 className="h2" style={{ margin: "12px 0 6px" }}>Nothing due</h3>
          <p className="muted" style={{ margin: 0 }}>Every word is at full mastery. New words arrive with the next lesson.</p>
        </div>
      ) : (
        <div style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
          <div className={"vcard" + (flip ? " flipped" : "")} onClick={() => setFlip((f) => !f)}
            role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setFlip((f) => !f)}>
            <div className="vinner">
              <div className="vface">
                <div className="eyebrow">Do you know this word?</div>
                <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-.02em" }}>{cur.w}</div>
                <div className="muted" style={{ fontStyle: "italic" }}>{cur.pos}</div>
                <div className="small muted" style={{ marginTop: 14 }}>Tap to reveal</div>
              </div>
              <div className="vface back">
                <div className="eyebrow" style={{ color: "var(--secondary)" }}>{cur.w}</div>
                <div className="h3" style={{ marginTop: 8 }}>{cur.def}</div>
                <div className="card-quiet" style={{ borderRadius: 8, padding: 12, marginTop: 14, fontSize: 14, fontStyle: "italic" }}>
                  “{cur.ex}”
                </div>
              </div>
            </div>
          </div>
          {flip && (
            <div style={{ marginTop: 18 }}>
              <PronunciationRecorder
                word={cur.w}
                languageCode={s.languageCode}
                saving={savingRec}
                compact
                onSave={async (clip) => {
                  setSavingRec(true);
                  try {
                    const { uploadError } = await actions.savePronunciation(cur.id, cur.w, clip);
                    notify(uploadError ? "Attempt saved, audio upload failed" : "Recording saved");
                  } finally {
                    setSavingRec(false);
                  }
                }}
              />
            </div>
          )}

          <div className="row" style={{ gap: 12, marginTop: 20 }}>
            <button className="btn btn-secondary btn-block" disabled={busy} onClick={() => grade(false)}>Still learning</button>
            <button className="btn btn-primary btn-block" disabled={busy} onClick={() => grade(true)}>I know this</button>
          </div>
          <div className="small muted" style={{ textAlign: "center", marginTop: 14 }}>
            {queue.length} card{queue.length > 1 ? "s" : ""} in the queue · {s.reviewed} reviewed today
          </div>
        </div>
      )}
    </div>
  );
}
