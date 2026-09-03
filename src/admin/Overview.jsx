import React from "react";

const nf = new Intl.NumberFormat();

export default function Overview({ data }) {
  const o = data.overview;
  const stats = [
    { n: o.learners, l: "Learners", sub: `${nf.format(o.signups_7d)} joined this week` },
    { n: o.active_7d, l: "Active this week", sub: `${nf.format(o.placed)} placed by the test` },
    { n: o.lessons_completed, l: "Lessons completed", sub: `${nf.format(o.recordings)} recordings saved` },
    { n: o.xp_awarded, l: "XP awarded", sub: `${nf.format(o.admins)} ${o.admins === 1 ? "admin" : "admins"}` },
  ];

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="stat-grid">
        {stats.map((st) => (
          <div key={st.l} className="stat">
            <div className="stat-n">{nf.format(st.n ?? 0)}</div>
            <div className="stat-l">{st.l}</div>
            <div className="small muted" style={{ marginTop: 6 }}>{st.sub}</div>
          </div>
        ))}
      </div>

      <section className="stack" style={{ gap: 14 }}>
        <h2 className="h2">Courses at a glance</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Course</th>
                <th>Language</th>
                <th className="num">Enrolled</th>
                <th className="num">Placed</th>
                <th className="num">Lessons</th>
                <th className="num">Vocabulary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data.courses || []).map((c) => (
                <tr key={c.course_id}>
                  <td className="label">{c.title}</td>
                  <td>{c.language}</td>
                  <td className="num">{nf.format(c.learners)}</td>
                  <td className="num">{nf.format(c.placed)}</td>
                  <td className="num">{nf.format(c.lessons)}</td>
                  <td className="num">{nf.format(c.vocabulary)}</td>
                  <td>
                    <span className={"pill " + (c.is_active ? "pill-green" : "pill-grey")}>
                      {c.is_active ? "Live" : "Hidden"}
                    </span>
                  </td>
                </tr>
              ))}
              {!(data.courses || []).length && (
                <tr><td className="tbl-empty muted" colSpan={7}>No courses yet. Add one under Content.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          Counts come from the database, not the seed files, so they follow whatever you change under Content.
        </p>
      </section>
    </div>
  );
}
