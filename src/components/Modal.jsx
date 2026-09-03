import React, { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

/**
 * A dialog that takes the focus, gives it back where it came from, and closes
 * on Escape. Tab is kept inside while it is open, otherwise a keyboard user
 * walks straight out of the dialog into the page behind it.
 */
export default function Modal({ title, subtitle, onClose, children, footer, wide = false }) {
  const panel = useRef(null);
  const returnTo = useRef(null);

  useEffect(() => {
    returnTo.current = document.activeElement;
    const first = panel.current?.querySelector(
      "input, textarea, select, button:not([data-close])"
    );
    (first || panel.current)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); return; }
      if (e.key !== "Tab") return;

      const focusable = [...panel.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )];
      if (!focusable.length) return;
      const firstEl = focusable[0], lastEl = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };

    document.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
      returnTo.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-veil" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={"modal" + (wide ? " modal-wide" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panel}
        tabIndex={-1}
      >
        <div className="modal-head">
          <div style={{ minWidth: 0 }}>
            <h2 className="h2">{title}</h2>
            {subtitle && <p className="small muted" style={{ margin: "2px 0 0" }}>{subtitle}</p>}
          </div>
          <button className="icon-button" onClick={onClose} data-close aria-label="Close">
            <Icon n="x" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
