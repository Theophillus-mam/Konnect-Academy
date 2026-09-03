import React, { useCallback, useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import Modal from "../components/Modal.jsx";
import { Loading, ErrorState } from "../components/States.jsx";
import { listAdmins, grantAdmin, revokeAdmin } from "../api/admin.js";

const fmt = (v) =>
  v ? new Date(v).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Never";

export default function Administrators({ ping }) {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(null);

  const load = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);
      setRows(await listAdmins());
      setStatus("ready");
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const grant = async () => {
    if (!email.trim()) { setFormError("Enter an email address."); return; }
    try {
      setBusy(true);
      setFormError(null);
      await grantAdmin(email.trim());
      setAdding(false);
      setEmail("");
      ping("Administrator added");
      load();
    } catch (e) {
      setFormError(e.message || "Could not grant access");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    try {
      setBusy(true);
      await revokeAdmin(confirming.id);
      setRows((rs) => rs.filter((r) => r.id !== confirming.id));
      setConfirming(null);
      ping("Access removed");
    } catch (e) {
      ping(e.message || "Could not remove access");
    } finally {
      setBusy(false);
    }
  };

  if (status === "loading") return <Loading label="Loading administrators…" />;
  if (status === "error") return <ErrorState error={error} onRetry={load} />;

  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="between wrap">
        <div>
          <h2 className="h2">Administrators</h2>
          <p className="small muted" style={{ margin: "2px 0 0" }}>
            Accounts that can open this console. Separate from learner accounts.
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setAdding(true); setFormError(null); }}>
          <Icon n="users" size={16} /> Add administrator
        </button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Added</th>
              <th>Last signed in</th>
              <th style={{ width: 1 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="avatar" style={{ width: 34, height: 34, flex: "0 0 34px", fontSize: 14 }}>
                      {(r.name || r.email || "A")[0].toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="label">
                        {r.name || "Unnamed"}
                        {r.is_you && <span className="pill pill-grey" style={{ marginLeft: 8 }}>You</span>}
                      </div>
                      <div className="small muted">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td className="small muted">{fmt(r.created_at)}</td>
                <td className="small muted">{fmt(r.last_seen_at)}</td>
                <td>
                  <div className="row" style={{ justifyContent: "flex-end" }}>
                    <button
                      className="btn btn-ghost btn-sm danger"
                      onClick={() => setConfirming(r)}
                      disabled={r.is_you || rows.length === 1}
                      title={r.is_you ? "You cannot remove your own access" : undefined}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adding && (
        <Modal
          title="Add an administrator"
          onClose={() => setAdding(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setAdding(false)} disabled={busy}>Cancel</button>
              <button className="btn btn-primary" onClick={grant} disabled={busy}>
                {busy ? "Granting…" : "Grant access"}
              </button>
            </>
          }
        >
          <p className="muted" style={{ margin: "0 0 18px" }}>
            The person needs a Supabase account first. Create it under
            Authentication → Users in the Supabase dashboard, then grant access
            to that email here. Creating accounts needs a key that must never
            reach a browser, which is why it happens there rather than here.
          </p>
          {formError && <div className="auth-error" style={{ marginBottom: 14 }}>{formError}</div>}
          <label className="form-line">
            <span className="label">Email</span>
            <input
              className="field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && grant()}
              placeholder="colleague@school.org"
            />
          </label>
        </Modal>
      )}

      {confirming && (
        <Modal
          title="Remove console access?"
          onClose={() => setConfirming(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setConfirming(null)}>Keep it</button>
              <button className="btn btn-danger" onClick={revoke} disabled={busy}>
                {busy ? "Removing…" : "Remove access"}
              </button>
            </>
          }
        >
          <p style={{ margin: "0 0 10px" }}>
            <strong>{confirming.name || confirming.email}</strong> will no longer be able to open the console.
          </p>
          <p className="muted small" style={{ margin: 0 }}>
            Their Supabase account stays. To remove that as well, delete the
            user under Authentication in the Supabase dashboard.
          </p>
        </Modal>
      )}
    </div>
  );
}
