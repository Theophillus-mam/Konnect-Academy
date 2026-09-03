import React from "react";

/* Horizontal progress bar. `tone` picks the fill colour, `h` renders the thin variant. */
export default function Bar({ v, tone = "", h }) {
  return (
    <div className={"bar" + (h ? " bar-sm" : "")}>
      <div className={"bar-fill " + tone} style={{ width: Math.max(0, Math.min(100, v)) + "%" }} />
    </div>
  );
}
