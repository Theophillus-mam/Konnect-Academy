import React from "react";
import Icon from "./Icon.jsx";

const Toast = ({ msg }) =>
  !msg ? null : (
    <div className="fade" style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 60,
      background: "var(--on-surface)", color: "#fff", padding: "12px 22px", borderRadius: 999,
      fontWeight: 600, fontSize: 14, boxShadow: "var(--shadow-lg)", display: "flex", gap: 8, alignItems: "center",
    }}>
      <Icon n="zap" size={16} /> {msg}
    </div>
  );

export default Toast;
