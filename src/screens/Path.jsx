import React from "react";
import Icon from "../components/Icon.jsx";
import Bar from "../components/Bar.jsx";

export default function Path({ s, go, content, ping }) {
  const { modules: MODULES, lessons: LESSONS } = content;
  const statusOf = (id, idx, all) => {
    if (s.done.includes(id)) return "done";
    const firstOpen = all.find((x) => !s.done.includes(x));
    return id === firstOpen ? "open" : "locked";
  };
  const flat = MODULES.flatMap((m) => m.lessons);

  return (
    <div className="container stack">
      <div>
        <h1 className="display" style={{ color: "var(--primary)" }}>{s.level} · {s.courseTitle || "Learning Path"}</h1>
        <p className="body-lg muted" style={{ maxWidth: 640, margin: "8px 0 0" }}>
          Professional communication first, then the everyday situations around it. Finish a lesson to open the next.
        </p>
      </div>

      {MODULES.map((m, mi) => {
        const doneCount = m.lessons.filter((l) => s.done.includes(l)).length;
        return (
          <div key={m.id} style={{ position: "relative" }}>
            {mi < MODULES.length - 1 && <div className="spine" />}
            <div className="row" style={{ marginBottom: 20, gap: 16 }}>
              <div className={"mod-dot" + (doneCount === m.lessons.length ? " done" : "")}><Icon n={m.icon} /></div>
              <div>
                <h2 className="h2">{m.title}</h2>
                <div className="small muted">Module {mi + 1} · {doneCount}/{m.lessons.length} lessons complete</div>
              </div>
            </div>
            <div className="grid g-3" style={{ paddingLeft: 64 }}>
              {m.lessons.map((id) => {
                const l = LESSONS[id];
                const st = statusOf(id, 0, flat);
                return (
                  <button key={id} className={"lesson-card " + (st === "done" ? "done" : st === "open" ? "active" : "lock")}
                    onClick={() => (st === "locked" ? ping("Finish the lesson before this one first") : go("lesson", { activeLesson: id }))}>
                    <div className="between">
                      <span className={"pill " + (st === "done" ? "pill-green" : st === "open" ? "pill-terra" : "pill-grey")}>
                        {st === "done" ? "Completed" : st === "open" ? "Up next" : "Locked"}
                      </span>
                      <span style={{ color: st === "done" ? "var(--secondary)" : st === "open" ? "var(--primary)" : "var(--outline)" }}>
                        <Icon n={st === "done" ? "check" : st === "open" ? "play" : "lock"} />
                      </span>
                    </div>
                    <h3 className="h2" style={{ fontSize: 21 }}>{l.title}</h3>
                    <p className="small muted" style={{ margin: 0, flex: 1 }}>{l.desc}</p>
                    {st === "done" && <Bar v={100} tone="green" h />}
                    {st === "open" && <span className="label" style={{ color: "var(--primary)" }}>Start now →</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
