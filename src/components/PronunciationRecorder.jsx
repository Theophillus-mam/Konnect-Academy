import React, { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import useRecorder from "../hooks/useRecorder.js";
import {
  speechLocale, judge, formatDuration,
  isRecognitionSupported, isSynthesisSupported,
} from "../lib/pronunciation.js";

const VERDICT = {
  match:     { label: "Sounds right",        tone: "var(--secondary)", icon: "check" },
  ambiguous: { label: "Can't tell these apart", tone: "var(--tertiary)", icon: "help" },
  close:     { label: "Close",               tone: "var(--tertiary)",  icon: "bulb" },
  different: { label: "Not quite",           tone: "var(--primary)",   icon: "refresh" },
  unclear:   { label: "Couldn't hear that",  tone: "var(--outline)",   icon: "mic" },
};

const listWords = (words) =>
  words.length === 1
    ? `“${words[0]}”`
    : words.slice(0, -1).map((w) => `“${w}”`).join(", ") + ` and “${words[words.length - 1]}”`;

/**
 * Record yourself saying a word, play it back against a model pronunciation,
 * and optionally get a rough check from the browser's speech-to-text.
 *
 * The check is not a pronunciation score. It transcribes what you said and
 * compares the text, which catches a wrong word but cannot judge a good accent.
 * The UI says so, because a number here would be trusted more than it deserves.
 */
export default function PronunciationRecorder({ word, languageCode, onSave, saving, compact }) {
  const rec = useRecorder();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const recognitionRef = useRef(null);
  const checkToken = useRef(0);
  const locale = speechLocale(languageCode);

  // Starting a new word clears the previous attempt.
  useEffect(() => {
    checkToken.current++;
    try { recognitionRef.current?.abort?.(); } catch { /* already stopped */ }
    setChecking(false);
    rec.reset();
    setResult(null);
    setSaved(false);
    setSaveError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  useEffect(() => () => {
    try { recognitionRef.current?.abort?.(); } catch { /* already stopped */ }
    if (isSynthesisSupported()) window.speechSynthesis.cancel();
  }, []);

  /** Model pronunciation from the browser's own voices. */
  const speak = useCallback(() => {
    if (!isSynthesisSupported()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = locale;
    u.rate = 0.85;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang?.startsWith(locale.slice(0, 2)));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [word, locale]);

  /** Live speech-to-text while recording, where the browser supports it. */
  const startCheck = useCallback(() => {
    if (!isRecognitionSupported()) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    try {
      const r = new SR();
      r.lang = locale;
      r.interimResults = false;
      // One alternative, deliberately. Asking for several and keeping whichever
      // scored best against the target is marking your own homework: for a word
      // that sounds like the target, the recogniser will usually offer the
      // target as one of its guesses, so every attempt passed.
      r.maxAlternatives = 1;

      // A result that arrives after the learner has moved to another word
      // belongs to the previous one and is dropped.
      const token = ++checkToken.current;

      r.onresult = (e) => {
        if (token !== checkToken.current) return;
        const alt = e.results?.[0]?.[0];
        const heard = alt?.transcript || "";
        // Judged on the same transcript that is shown, so the verdict and the
        // "Heard:" line can never disagree.
        const outcome = judge(word, heard, {
          confidence: typeof alt?.confidence === "number" ? alt.confidence : null,
          languageCode,
        });
        setResult({ ...outcome, transcript: heard });
        setChecking(false);
      };
      r.onerror = (e) => {
        if (token !== checkToken.current) return;
        setResult(e?.error === "no-speech" ? { verdict: "unclear", score: 0, transcript: "" } : null);
        setChecking(false);
      };
      r.onend = () => { if (token === checkToken.current) setChecking(false); };
      recognitionRef.current = r;
      setChecking(true);
      r.start();
    } catch {
      setChecking(false);
    }
  }, [word, locale, languageCode]);

  const handleRecord = async () => {
    setResult(null);
    setSaved(false);
    setSaveError(null);
    await rec.start();
    startCheck();
  };

  const handleStop = () => {
    rec.stop();
    try { recognitionRef.current?.stop?.(); } catch { /* already stopped */ }
  };

  const handleSave = async () => {
    if (!rec.clip || !onSave) return;
    try {
      setSaveError(null);
      await onSave({
        blob: rec.clip.blob,
        mimeType: rec.clip.mimeType,
        durationMs: rec.clip.durationMs,
        transcript: result?.transcript || null,
        verdict: result?.verdict || null,
        score: result?.score ?? null,
      });
      setSaved(true);
    } catch (e) {
      setSaveError(e.message || "Could not save the recording.");
    }
  };

  if (rec.state === "unsupported") {
    return (
      <div className="rec-box">
        <p className="small muted" style={{ margin: 0 }}>
          This browser cannot record audio. Recording needs a recent Chrome, Edge, Firefox or Safari,
          served over HTTPS or on localhost.
        </p>
      </div>
    );
  }

  const recording = rec.state === "recording";
  const busy = rec.state === "requesting";
  const v = result ? VERDICT[result.verdict] : null;

  return (
    <div className={"rec-box" + (compact ? " compact" : "")}>
      <div className="between wrap" style={{ gap: 12 }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--on-surface-var)" }}>Say it out loud</div>
          <div className="rec-word">{word}</div>
        </div>
        {isSynthesisSupported() && (
          <button className="btn btn-secondary btn-sm" onClick={speak} disabled={speaking}>
            <Icon n="volume" size={16} /> {speaking ? "Playing…" : "Hear it"}
          </button>
        )}
      </div>

      <div className="rec-controls">
        <button
          className={"mic" + (recording ? " live" : "")}
          onClick={recording ? handleStop : handleRecord}
          disabled={busy}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          <Icon n={recording ? "check" : "mic"} size={24} />
        </button>

        <div className="rec-meter-wrap">
          {recording ? (
            <>
              <div className="rec-meter" aria-hidden="true">
                {Array.from({ length: 28 }).map((_, i) => {
                  const active = rec.level * 28 > i;
                  return (
                    <span
                      key={i}
                      className={"rec-bar" + (active ? " on" : "")}
                      style={{ height: `${active ? 18 + rec.level * 26 * ((i % 5) + 1) / 5 : 5}px` }}
                    />
                  );
                })}
              </div>
              <div className="small muted">
                Recording — {formatDuration(rec.elapsed)} of {formatDuration(rec.maxMs)}
              </div>
            </>
          ) : rec.clip ? (
            <>
              <audio className="rec-audio" src={rec.clip.url} controls preload="metadata" />
              <div className="small muted">Your recording — {formatDuration(rec.clip.durationMs)}</div>
            </>
          ) : (
            <div className="small muted">
              {busy ? "Waiting for microphone permission…" : "Tap the microphone, then read the word aloud."}
            </div>
          )}
        </div>
      </div>

      {rec.error && <div className="auth-error" style={{ marginTop: 12 }}>{rec.error}</div>}

      {checking && <div className="small muted" style={{ marginTop: 10 }}>Listening…</div>}

      {v && (
        <div className="rec-verdict fade" style={{ borderLeftColor: v.tone }}>
          <div className="row" style={{ gap: 8, color: v.tone }}>
            <Icon n={v.icon} size={17} />
            <span className="label">{v.label}</span>
          </div>
          {result.transcript && (
            <div className="small muted" style={{ marginTop: 4 }}>
              Heard: “{result.transcript}”
            </div>
          )}
          {result.verdict === "ambiguous" && result.confusedWith?.length > 0 && (
            <div className="small" style={{ marginTop: 6 }}>
              “{word}” sounds exactly like {listWords(result.confusedWith)}, so speech-to-text
              cannot tell which one you said. Use <strong>Hear it</strong> and compare with your
              recording instead.
            </div>
          )}
          <div className="small muted" style={{ marginTop: 6, fontStyle: "italic" }}>
            A rough check from speech-to-text — it compares the words, not your accent.
          </div>
        </div>
      )}

      {rec.clip && (
        <div className="row wrap" style={{ gap: 10, marginTop: 14 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { rec.reset(); setResult(null); setSaved(false); }}>
            <Icon n="refresh" size={16} /> Record again
          </button>
          {onSave && (
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || saved}>
              {saved ? "Saved" : saving ? "Saving…" : "Save attempt"} <Icon n="check" size={16} />
            </button>
          )}
        </div>
      )}

      {saveError && <div className="auth-error" style={{ marginTop: 12 }}>{saveError}</div>}

      {!isRecognitionSupported() && rec.clip && (
        <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>
          Automatic checking needs Chrome or Edge. You can still record, play back and compare
          against the model pronunciation.
        </p>
      )}
    </div>
  );
}
