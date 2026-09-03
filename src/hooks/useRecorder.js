import { useCallback, useEffect, useRef, useState } from "react";
import { pickMimeType, isRecordingSupported } from "../lib/pronunciation.js";

const MAX_MS = 15000; // a word or short phrase; stops runaway recordings

/**
 * Wraps MediaRecorder for short pronunciation clips.
 *
 * Handles the parts that bite: microphone permission being denied, browsers
 * that only accept audio/mp4, releasing the microphone track afterwards (or
 * the browser keeps showing the recording indicator), and revoking object URLs
 * so long sessions do not leak memory.
 */
export default function useRecorder() {
  const [state, setState] = useState("idle"); // idle | requesting | recording | ready | denied | unsupported
  const [error, setError] = useState(null);
  const [clip, setClip] = useState(null);     // { blob, url, mimeType, durationMs }
  const [level, setLevel] = useState(0);      // 0–1, for the meter
  const [elapsed, setElapsed] = useState(0);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const startedRef = useRef(0);
  const urlRef = useRef(null);
  const timeoutRef = useRef(null);

  const releaseStream = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timeoutRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current?.state !== "closed") audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevel(0);
  }, []);

  // Tear everything down on unmount, including any object URL still held.
  useEffect(() => () => {
    releaseStream();
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, [releaseStream]);

  useEffect(() => {
    if (!isRecordingSupported()) setState("unsupported");
  }, []);

  const meter = useCallback((stream) => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
        setLevel(peak);
        setElapsed(Date.now() - startedRef.current);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Metering is decorative; recording continues without it.
    }
  }, []);

  const start = useCallback(async () => {
    if (!isRecordingSupported()) { setState("unsupported"); return; }
    setError(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const type = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setClip({ blob, url, mimeType: type, durationMs: Date.now() - startedRef.current });
        setState("ready");
        releaseStream();
      };

      startedRef.current = Date.now();
      setElapsed(0);
      recorder.start();
      setState("recording");
      meter(stream);
      timeoutRef.current = setTimeout(() => {
        if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      }, MAX_MS);
    } catch (e) {
      releaseStream();
      const denied = e?.name === "NotAllowedError" || e?.name === "SecurityError";
      setState(denied ? "denied" : "idle");
      setError(
        denied
          ? "Microphone access was blocked. Allow it in your browser's address bar and try again."
          : e?.message || "Could not start recording."
      );
    }
  }, [meter, releaseStream]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    else releaseStream();
  }, [releaseStream]);

  const reset = useCallback(() => {
    if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; }
    setClip(null);
    setElapsed(0);
    setState(isRecordingSupported() ? "idle" : "unsupported");
  }, []);

  return { state, error, clip, level, elapsed, start, stop, reset, maxMs: MAX_MS };
}
