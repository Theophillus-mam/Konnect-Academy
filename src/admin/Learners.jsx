import React, { useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import { learnersToCsv } from "../api/admin.js";

const nf = new Intl.NumberFormat();

function when(value) {
  if (!value) return "—";
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

const columns = [
  { key: "display_name", label: "Learner" },
  { key: "course_title", label: "Course" },
  { key: "level_code", label: "Level" },
  { key: "lessons_done", label: "Lessons", num: true },
  { key: "words_mastered", label: "Words", num: true },
  { key: "total_xp", label: "XP", num: true },
  { key: "last_active", label: "Last active" },
];

export default function Learners({ data, ping }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "last_active", dir: "desc" });

  const learners = useMemo(() => {
    const rows = data?.learners || [];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) =>
          `${r.display_name || ""} ${r.email || ""} ${r.course_title || ""}`.toLowerCase().includes(q))
      : rows;

    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key];
      if (x == null && y == null) return 0;
      if (x == null) return 1;          // blanks always sink
      if (y == null) return -1;
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return String(x).localeCompare(String(y)) * dir;
    });
  }, [data, query, sort]);

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key
      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { key, dir: typeof (data?.learners?.[0]?.[key]) === "number" ? "desc" : "asc" }));

  const exportCsv = () => {
    const blob = new Blob([learnersToCsv(learners)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `konnect-learners-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    ping(`Exported ${learners.length} ${learners.length === 1 ? "learner" : "learners"}`);
  };

  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="between wrap">
        <h2 className="h2">Learners</h2>
        <div className="admin-toolbar">
          <input
            className="field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or course"
            aria-label="Search learners"
          />
          <button className="btn btn-secondary btn-sm" onClick={exportCsv} disabled={!learners.length}>
            <Icon n="doc" size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.num ? "num" : ""} aria-sort={
                  sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
                }>
                  <button className="th-sort" onClick={() => toggleSort(c.key)}>
                    {c.label}
                    {sort.key === c.key && <span aria-hidden="true">{sort.dir === "asc" ? " ↑" : " ↓"}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {learners.map((r) => (
              <tr key={r.user_id}>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="avatar" style={{ width: 34, height: 34, flex: "0 0 34px", fontSize: 14 }}>
                      {(r.display_name || r.email || "L")[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="label">{r.display_name || "Unnamed"}</div>
                      <div className="small muted">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td>{r.course_title || "—"}</td>
                <td>
                  {r.level_code
                    ? <span className="pill pill-grey">{r.level_code}</span>
                    : <span className="small muted">Not placed</span>}
                </td>
                <td className="num">{nf.format(r.lessons_done)}</td>
                <td className="num">{nf.format(r.words_mastered)}</td>
                <td className="num">{nf.format(r.total_xp)}</td>
                <td className="small muted">{when(r.last_active)}</td>
              </tr>
            ))}
            {!learners.length && (
              <tr>
                <td className="tbl-empty muted" colSpan={columns.length}>
                  {query ? "No learner matches that search." : "Nobody has signed up yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
