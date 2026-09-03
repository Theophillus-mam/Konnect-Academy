import React, { useCallback, useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import Modal from "../components/Modal.jsx";
import ContentForm from "../components/ContentForm.jsx";
import { Loading, ErrorState } from "../components/States.jsx";
import {
  ENTITIES, blankRow, cleanRow, missingFields,
} from "../lib/contentModel.js";
import {
  listRows, saveRow, deleteRow, swapOrder, listLevels, countChildren,
} from "../api/adminContent.js";

const trunc = (s, n = 70) => {
  const t = String(s ?? "");
  return t.length > n ? t.slice(0, n - 1) + "…" : t;
};

export default function Content({ ping }) {
  // The trail from the root down to whatever is open. Each step remembers the
  // row it drilled into and which of that row's child tables is showing.
  const [trail, setTrail] = useState([]);
  const [childTab, setChildTab] = useState(null);

  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [levels, setLevels] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(null);   // { row, isNew }
  const [form, setForm] = useState({});
  const [missing, setMissing] = useState([]);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const parent = trail.length ? trail[trail.length - 1] : null;
  const entity = parent ? childTab : "languages";
  const spec = entity ? ENTITIES[entity] : null;
  const fk = useMemo(() => {
    if (!parent || !entity) return null;
    return ENTITIES[parent.entity].children.find((c) => c.entity === entity)?.fk ?? null;
  }, [parent, entity]);

  useEffect(() => { listLevels().then(setLevels).catch(() => setLevels([])); }, []);

  const load = useCallback(async () => {
    if (!entity) return;
    try {
      setStatus("loading");
      setError(null);
      const data = await listRows(entity, { fk, parentId: parent?.row.id });
      setRows(data);

      // How many things hang off each row, so the list can say "4 lessons"
      // instead of making someone click in to find out it is empty.
      const firstChild = ENTITIES[entity].children[0];
      setCounts(firstChild && data.length
        ? await countChildren(firstChild.entity, firstChild.fk, data.map((r) => r.id))
        : {});
      setStatus("ready");
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  }, [entity, fk, parent]);

  useEffect(() => { load(); }, [load]);

  const drillInto = (row) => {
    const kids = ENTITIES[entity].children;
    if (!kids.length) { openEdit(row); return; }
    setTrail((t) => [...t, { entity, row }]);
    setChildTab(kids[0].entity);
  };

  const goToCrumb = (index) => {
    if (index < 0) { setTrail([]); setChildTab(null); return; }
    const next = trail.slice(0, index + 1);
    setTrail(next);
    setChildTab(ENTITIES[next[next.length - 1].entity].children[0].entity);
  };

  const openEdit = (row) => {
    setEditing({ row, isNew: false });
    setForm({ ...row });
    setMissing([]);
  };

  const openNew = () => {
    setEditing({ row: null, isNew: true });
    setForm(blankRow(entity, rows));
    setMissing([]);
  };

  const save = async () => {
    const gaps = missingFields(entity, form);
    if (gaps.length) { setMissing(gaps); return; }
    try {
      setSaving(true);
      const payload = cleanRow(entity, form);
      if (fk && parent) payload[fk] = parent.row.id;
      const saved = await saveRow(entity, payload, editing.isNew ? null : editing.row.id);
      setRows((rs) => {
        const next = editing.isNew ? [...rs, saved] : rs.map((r) => (r.id === saved.id ? saved : r));
        return next.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      });
      setEditing(null);
      ping(editing.isNew ? `${cap(spec.singular)} added` : "Saved");
    } catch (e) {
      ping(e.message || "Could not save that");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const row = confirming;
    try {
      setBusyId(row.id);
      await deleteRow(entity, row.id);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      setConfirming(null);
      ping(`${cap(spec.singular)} deleted`);
    } catch (e) {
      ping(e.message || "Could not delete that");
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, delta) => {
    const a = rows[index], b = rows[index + delta];
    if (!a || !b) return;
    try {
      setBusyId(a.id);
      await swapOrder(entity, a.id, b.id);
      setRows((rs) => {
        const next = [...rs];
        const so = next[index].sort_order;
        next[index] = { ...next[index], sort_order: next[index + delta].sort_order };
        next[index + delta] = { ...next[index + delta], sort_order: so };
        return next.sort((x, y) => (x.sort_order ?? 0) - (y.sort_order ?? 0));
      });
    } catch (e) {
      ping(e.message || "Could not reorder those");
    } finally {
      setBusyId(null);
    }
  };

  if (status === "error") return <ErrorState error={error} onRetry={load} />;

  const childSpec = spec?.children?.[0];

  return (
    <div className="stack" style={{ gap: 20 }}>
      <nav className="crumbs" aria-label="Content location">
        <button className={"crumb" + (trail.length ? "" : " here")} onClick={() => goToCrumb(-1)}>
          <Icon n="globe" size={15} /> Languages
        </button>
        {trail.map((step, i) => (
          <React.Fragment key={step.row.id}>
            <span className="crumb-sep" aria-hidden="true"><Icon n="chevR" size={14} /></span>
            <button
              className={"crumb" + (i === trail.length - 1 ? " here" : "")}
              onClick={() => goToCrumb(i)}
            >
              {trunc(ENTITIES[step.entity].title(step.row), 34)}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {parent && ENTITIES[parent.entity].children.length > 1 && (
        <div className="subtabs" role="tablist">
          {ENTITIES[parent.entity].children.map((c) => (
            <button
              key={c.entity}
              role="tab"
              aria-selected={childTab === c.entity}
              className={"subtab" + (childTab === c.entity ? " active" : "")}
              onClick={() => setChildTab(c.entity)}
            >
              {ENTITIES[c.entity].label}
            </button>
          ))}
        </div>
      )}

      <div className="between wrap">
        <div>
          <h2 className="h2">{spec.label}</h2>
          {parent && (
            <p className="small muted" style={{ margin: "2px 0 0" }}>
              In {trunc(ENTITIES[parent.entity].title(parent.row), 48)}
            </p>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          <Icon n="pen" size={16} /> Add {spec.singular}
        </button>
      </div>

      {status === "loading"
        ? <Loading label={`Loading ${spec.label.toLowerCase()}…`} />
        : rows.length === 0
        ? (
          <div className="card card-quiet" style={{ textAlign: "center", padding: 40 }}>
            <p className="muted" style={{ margin: "0 0 16px" }}>{spec.empty}</p>
            <button className="btn btn-primary btn-sm" onClick={openNew}>
              Add the first {spec.singular}
            </button>
          </div>
        )
        : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 74 }}>Order</th>
                  {spec.list.map((c) => <th key={c.k} className={c.type === "int" ? "num" : ""}>{c.label}</th>)}
                  {childSpec && <th className="num">{ENTITIES[childSpec.entity].label}</th>}
                  <th style={{ width: 1 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id}>
                    <td>
                      <div className="row" style={{ gap: 2 }}>
                        <button
                          className="icon-button icon-button-sm"
                          onClick={() => move(i, -1)}
                          disabled={i === 0 || busyId === r.id}
                          aria-label="Move up"
                        >↑</button>
                        <button
                          className="icon-button icon-button-sm"
                          onClick={() => move(i, 1)}
                          disabled={i === rows.length - 1 || busyId === r.id}
                          aria-label="Move down"
                        >↓</button>
                      </div>
                    </td>
                    {spec.list.map((c) => (
                      <td key={c.k} className={c.type === "int" ? "num" : ""}>
                        {c.type === "bool"
                          ? <span className={"pill " + (r[c.k] ? "pill-green" : "pill-grey")}>
                              {r[c.k] ? "Yes" : "No"}
                            </span>
                          : c.primary
                          ? <button className="link-cell" onClick={() => drillInto(r)}>
                              {trunc(r[c.k], c.truncate ? 60 : 90) || "Untitled"}
                            </button>
                          : <span className={c.mono ? "mono small" : "small muted"}>
                              {c.truncate ? trunc(r[c.k], 48) : (r[c.k] ?? "—")}
                            </span>}
                      </td>
                    ))}
                    {childSpec && (
                      <td className="num small muted">{counts[r.id] ?? 0}</td>
                    )}
                    <td>
                      <div className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                        {spec.children.length > 0 && (
                          <button className="btn btn-ghost btn-sm" onClick={() => drillInto(r)}>
                            Open <Icon n="chevR" size={15} />
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(r)}>Edit</button>
                        <button
                          className="btn btn-ghost btn-sm danger"
                          onClick={() => setConfirming(r)}
                          disabled={busyId === r.id}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {editing && (
        <Modal
          title={editing.isNew ? `New ${spec.singular}` : `Edit ${spec.singular}`}
          subtitle={parent ? `In ${trunc(ENTITIES[parent.entity].title(parent.row), 44)}` : null}
          onClose={() => setEditing(null)}
          wide
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : editing.isNew ? `Add ${spec.singular}` : "Save changes"}
              </button>
            </>
          }
        >
          <ContentForm
            entity={entity}
            form={form}
            setForm={setForm}
            levels={levels}
            missing={missing}
          />
        </Modal>
      )}

      {confirming && (
        <Modal
          title={`Delete this ${spec.singular}?`}
          onClose={() => setConfirming(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setConfirming(null)}>Keep it</button>
              <button className="btn btn-danger" onClick={remove} disabled={busyId === confirming.id}>
                {busyId === confirming.id ? "Deleting…" : "Delete"}
              </button>
            </>
          }
        >
          <p style={{ margin: "0 0 10px" }}>
            <strong>{trunc(spec.title(confirming), 80) || "Untitled"}</strong>
          </p>
          {spec.children.length > 0 && (
            <p className="muted small" style={{ margin: 0 }}>
              Everything inside it goes too — {spec.children.map((c) => ENTITIES[c.entity].label.toLowerCase()).join(", ")}
              {" "}— and learner progress that points at it. This cannot be undone.
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
