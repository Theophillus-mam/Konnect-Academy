import React from "react";

/* Lucide-style icon set, drawn inline so there is no icon-font dependency. */
const P = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="4" rx="1.5" /><rect x="14" y="10" width="7" height="11" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
  book: <><path d="M2 4h5.5A3.5 3.5 0 0 1 11 7.5V20a2.8 2.8 0 0 0-2.8-2H2z" /><path d="M22 4h-5.5A3.5 3.5 0 0 0 13 7.5V20a2.8 2.8 0 0 1 2.8-2H22z" /></>,
  dumbbell: <><path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" /></>,
  trend: <><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></>,
  flame: <><path d="M12 22c4 0 7-2.8 7-7 0-4-3-6-4-9-2 2-3 3-4 3s-1.5-1-1.5-3C7 8 5 10 5 15c0 4.2 3 7 7 7z" /></>,
  medal: <><circle cx="12" cy="15" r="5" /><path d="M8.2 10.6 6 2h12l-2.2 8.6" /></>,
  check: <><circle cx="12" cy="12" r="9.5" /><path d="m8.5 12.2 2.5 2.5 4.7-5" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  play: <><circle cx="12" cy="12" r="9.5" /><path d="M10.2 8.6 15.5 12l-5.3 3.4z" /></>,
  chevR: <path d="m9 5 7 7-7 7" />,
  arrowR: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  arrowL: <><path d="M20 12H5" /><path d="m11 18-6-6 6-6" /></>,
  mic: <><rect x="9" y="2.5" width="6" height="11.5" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3.5" /></>,
  head: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13.5" width="4.5" height="7" rx="2" /><rect x="17" y="13.5" width="4.5" height="7" rx="2" /></>,
  pen: <><path d="M14 4.5 19.5 10 8 21.5H2.5V16z" /><path d="m12.5 6 5.5 5.5" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z" /></>,
  sparkle: <><path d="m12 2.5 2.2 6.3 6.3 2.2-6.3 2.2L12 19.5 9.8 13.2 3.5 11l6.3-2.2z" /><path d="m19 17.5.9 2.6 2.6.9-2.6.9-.9 2.6" /></>,
  case: <><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" /></>,
  cap: <><path d="M2.5 8.5 12 4l9.5 4.5L12 13z" /><path d="M6 10.6V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.4" /></>,
  x: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  bulb: <><path d="M9.5 17.5h5" /><path d="M10 21h4" /><path d="M12 3a6 6 0 0 1 3.5 10.9c-.6.5-.9 1-.9 1.6h-5.2c0-.6-.3-1.1-.9-1.6A6 6 0 0 1 12 3z" /></>,
  volume: <><path d="M11 5 6.5 9H3v6h3.5L11 19z" /><path d="M15.5 9.2a4 4 0 0 1 0 5.6" /><path d="M18.4 6.4a8 8 0 0 1 0 11.2" /></>,
  refresh: <><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" /><path d="M20.5 4v5h-5" /></>,
  clock: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6.8V12l3.4 2" /></>,
  zap: <path d="M13.5 2 4 13.5h6.5L10 22l9.5-11.5H13z" />,
  target: <><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>,
  users: <><circle cx="9" cy="8" r="3.6" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16.5 5a3.6 3.6 0 0 1 0 6.9" /><path d="M18 14.4a6.5 6.5 0 0 1 3.5 5.6" /></>,
  star: <path d="m12 3 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 16.6 6.5 19.7l1.3-6.1L3.2 9.4l6.2-.7z" />,
  gear: <><circle cx="12" cy="12" r="3.2" /><path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 1 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3.2a2 2 0 1 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 1 1 4 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a2 2 0 1 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1z" /></>,
  help: <><circle cx="12" cy="12" r="9.5" /><path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.7-2.6 2.7" /><path d="M12 17.2h.01" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 4.5h11l-2 3.5 2 3.5H5" /></>,
  globe: <><circle cx="12" cy="12" r="9.5" /><path d="M2.6 12h18.8" /><path d="M12 2.5a15 15 0 0 1 0 19 15 15 0 0 1 0-19z" /></>,
  doc: <><path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5z" /><path d="M14 2.5v5h5" /></>,
};

export default function Icon({ n, size = 20, sw = 1.8, style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto", ...style }} aria-hidden="true">
      {P[n]}
    </svg>
  );
}
