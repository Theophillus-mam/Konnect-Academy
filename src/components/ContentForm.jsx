import React from "react";
import Icon from "./Icon.jsx";
import { ENTITIES, ICON_NAMES } from "../lib/contentModel.js";

/** Renders the form for one content table from its field specification. */
export default function ContentForm({ entity, form, setForm, levels = [], missing = [] }) {
  const spec = ENTITIES[entity];
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isMissing = (f) => missing.includes(f.label);

  return (
    <div className="form-grid">
      {spec.fields.map((f) => {
        const id = `f-${entity}-${f.k}`;
        const invalid = isMissing(f);

        if (f.type === "bool") {
          return (
            <label key={f.k} className="check-line" htmlFor={id}>
              <input
                id={id}
                type="checkbox"
                checked={Boolean(form[f.k])}
                onChange={(e) => set(f.k, e.target.checked)}
              />
              <span>
                <span className="label">{f.label}</span>
                {f.hint && <span className="small muted" style={{ display: "block" }}>{f.hint}</span>}
              </span>
            </label>
          );
        }

        let control;
        if (f.type === "textarea") {
          control = (
            <textarea
              id={id}
              className={"field" + (invalid ? " field-bad" : "")}
              rows={f.k === "prompt" || f.k === "definition" ? 3 : 2}
              value={form[f.k] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => set(f.k, e.target.value)}
            />
          );
        } else if (f.type === "int") {
          control = (
            <input
              id={id}
              className="field"
              type="number"
              value={form[f.k] ?? 0}
              onChange={(e) => set(f.k, e.target.value === "" ? "" : Number(e.target.value))}
            />
          );
        } else if (f.type === "select" || f.type === "level" || f.type === "icon") {
          const options =
            f.type === "level" ? levels.map((l) => ({ v: l.code, t: `${l.code} — ${l.name}` }))
            : f.type === "icon" ? ICON_NAMES.map((n) => ({ v: n, t: n }))
            : f.options.map((o) => ({ v: o, t: o }));
          control = (
            <div className="row" style={{ gap: 10 }}>
              <select
                id={id}
                className={"field" + (invalid ? " field-bad" : "")}
                value={form[f.k] ?? ""}
                onChange={(e) => set(f.k, e.target.value)}
              >
                <option value="">{f.optional || !f.required ? "None" : "Choose one"}</option>
                {options.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
              </select>
              {f.type === "icon" && form[f.k] && (
                <span className="icon-preview"><Icon n={form[f.k]} size={20} /></span>
              )}
            </div>
          );
        } else {
          control = (
            <input
              id={id}
              className={"field" + (invalid ? " field-bad" : "")}
              value={form[f.k] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => set(f.k, e.target.value)}
            />
          );
        }

        return (
          <div key={f.k} className={"form-line" + (f.type === "textarea" ? " form-wide" : "")}>
            <label className="label" htmlFor={id}>
              {f.label}
              {f.required && <span className="req" aria-hidden="true"> *</span>}
            </label>
            {control}
            {invalid
              ? <span className="small field-msg">{f.label} is required.</span>
              : f.hint && <span className="small muted">{f.hint}</span>}
          </div>
        );
      })}
    </div>
  );
}
