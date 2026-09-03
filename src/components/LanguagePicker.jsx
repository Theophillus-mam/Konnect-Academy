import React from "react";
import Icon from "./Icon.jsx";

const FLAG = { en: "EN", fr: "FR", pt: "PT" };

/**
 * Switches the learner between active languages. Each language keeps its own
 * CEFR level and placement, so switching never overwrites the other course.
 */
export default function LanguagePicker({ languages, activeCourseId, onSwitch, compact }) {
  const options = (languages || []).flatMap((l) =>
    (l.courses || []).map((c) => ({ courseId: c.id, code: l.code, name: l.name, title: c.title }))
  );
  if (options.length < 2) return null;

  return (
    <div className={"lang-picker" + (compact ? " compact" : "")}>
      {!compact && <div className="lang-label">Language</div>}
      <div className="lang-row" role="group" aria-label="Choose your language">
        {options.map((o) => {
          const active = o.courseId === activeCourseId;
          return (
            <button
              key={o.courseId}
              className={"lang-btn" + (active ? " active" : "")}
              onClick={() => onSwitch(o.courseId)}
              aria-pressed={active}
              title={o.title}
            >
              <span className="lang-code">{FLAG[o.code] || o.code.toUpperCase()}</span>
              {!compact && <span className="lang-name">{o.name}</span>}
              {active && <Icon n="check" size={15} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
