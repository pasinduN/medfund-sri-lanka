"use client";

import { useReducer, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import AdminReviewQueue from "./AdminReviewQueue";
import AdminActionDialog from "./AdminActionDialog";
import ProgressBar from "./ProgressBar";
import { allAccounts } from "@/lib/demoAuth";
import { closeCampaign, raisedSoFar, readCampaignRecord, saveRecord as saveCampaign } from "@/lib/campaignStore";
import { readDonorRecord, saveDonor } from "@/lib/donorStore";
import { clearHold, setHold, useHolds } from "@/lib/moderationStore";
import { notify } from "@/lib/notificationStore";
import { formatDate } from "@/lib/dates";
import { formatRs } from "@/lib/format";

const noSubscribe = () => () => {};

// Admin screens stay in English: they are used by the MedFund team, not the public.
// Anything the patient or donor sees (reasons, notifications) still goes through i18n.
export default function AdminDashboard({ applications, patients }) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const holds = useHolds();
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const [tab, setTab] = useState("patients");
  const [dialog, setDialog] = useState(null);
  // the demo stores are read directly below, so bump this after each action to redraw
  const [, refresh] = useReducer((n) => n + 1, 0);

  if (!mounted) return <div className="panel profile-loading" aria-busy="true" />;

  if (user?.role !== "admin") {
    return (
      <div className="panel empty-state">
        <span className="glyph">🛡</span>
        <h3>Admins only</h3>
        <p>Log in with an admin account to review campaigns and donors.</p>
        <Link className="btn btn-blue" href="/login">{t("nav_login")}</Link>
      </div>
    );
  }

  const accounts = allAccounts();
  const campaignOf = (a) => readCampaignRecord(a.id);
  const ownerOf = (patientId) => accounts.find((a) => campaignOf(a)?.campaign?.patientId === patientId);
  const patientById = (id) => patients.find((p) => p.id === id);

  const closeRequests = accounts
    .map((account) => ({ account, record: campaignOf(account) }))
    .filter(({ record }) => record?.campaign?.status === "close_requested");

  const liveCampaigns = patients.filter((p) => !p.closed && holds[p.id]?.status !== "closed");

  const donorAccounts = accounts
    .map((account) => ({ account, record: readDonorRecord(account.id) }))
    .filter(({ record }) => record && record.status !== "unregistered");
  const newDonors = donorAccounts.filter(({ record }) => record.verified === false);

  // ---------- campaign actions ----------
  // TODO: PATCH /api/admin/campaigns/{id} — the backend also records which admin did it, for the audit log

  const approveClose = ({ account, record }) => {
    const p = patientById(record.campaign.patientId);
    saveCampaign(account.id, closeCampaign(record, p, "request"));
    setHold(p.id, "closed", "mod_r_request");
    notify(account.id, "close_approved");
    refresh();
  };

  const keepOpen = ({ account, record }) => {
    saveCampaign(account.id, { ...record, campaign: { ...record.campaign, status: "live", request: undefined } });
    clearHold(record.campaign.patientId);
    notify(account.id, "close_rejected");
    refresh();
  };

  const pause = (p, reason) => {
    setHold(p.id, "paused", reason);
    notify(ownerOf(p.id)?.id, "admin_paused", { reason });
    setDialog(null);
  };

  const resume = (p) => {
    clearHold(p.id);
    notify(ownerOf(p.id)?.id, "admin_resumed");
  };

  const closeByAdmin = (p, reason) => {
    const owner = ownerOf(p.id);
    if (owner) {
      saveCampaign(owner.id, closeCampaign(campaignOf(owner), p, "admin"));
      notify(owner.id, "admin_closed", { reason });
    }
    setHold(p.id, "closed", reason);
    setDialog(null);
  };

  // ---------- donor actions ----------

  const updateDonor = (account, record, changes, noteType) => {
    saveDonor(account.id, { ...record, ...changes });
    notify(account.id, noteType);
    refresh();
  };

  const stats = [
    ["Applications waiting", applications.length],
    ["Close requests", closeRequests.length],
    ["Campaigns on hold", Object.values(holds).filter((h) => h.status === "paused").length],
    ["Donors to verify", newDonors.length],
  ];

  return (
    <>
      <div className="admin-stats">
        {stats.map(([label, value]) => (
          <div className="fact" key={label}><span>{label}</span><b>{value}</b></div>
        ))}
      </div>

      <div className="authtabs admin-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "patients"} className={tab === "patients" ? "on" : ""} onClick={() => setTab("patients")}>
          🏥 Patients {closeRequests.length + applications.length > 0 && <span className="dr-count">{closeRequests.length + applications.length}</span>}
        </button>
        <button role="tab" aria-selected={tab === "donors"} className={tab === "donors" ? "on" : ""} onClick={() => setTab("donors")}>
          🩸 Donors {newDonors.length > 0 && <span className="dr-count">{newDonors.length}</span>}
        </button>
      </div>

      {tab === "patients" ? (
        <>
          <div className="sec-head"><h2>Close requests</h2></div>
          {closeRequests.length === 0 && <p className="muted-sm admin-empty">No close requests right now.</p>}
          {closeRequests.map((item) => {
            const p = patientById(item.record.campaign.patientId);
            const { request } = item.record.campaign;
            return (
              <div className="review" key={item.account.id}>
                <div>
                  <div className="pname">{p.name}</div>
                  <div className="pmeta"><b>{p.disease}</b> · {p.hospital} · {formatRs(raisedSoFar(p, item.record.campaign))} of {formatRs(p.need)}</div>
                  <div className="pmeta">Asked by {item.account.name} on {formatDate(request.date, lang)} · <b>{t(request.reason)}</b></div>
                  {request.note && <div className="pmeta">“{request.note}”</div>}
                </div>
                <div className="actions">
                  <button className="btn btn-red" onClick={() => approveClose(item)}>Approve close</button>
                  <button className="btn btn-ghost" onClick={() => keepOpen(item)}>Keep open</button>
                </div>
              </div>
            );
          })}

          <div className="sec-head"><h2>Live campaigns</h2></div>
          {liveCampaigns.map((p) => {
            const hold = holds[p.id];
            return (
              <div className="review" key={p.id}>
                <div>
                  <div className="pname">
                    {p.name}
                    {hold && <span className="status-pill paused">⏸ {t(hold.reason)}</span>}
                  </div>
                  <div className="pmeta"><b>{p.disease}</b> · {p.hospital} · {p.reg}</div>
                  <div className="admin-progress"><ProgressBar percent={(p.got / p.need) * 100} /></div>
                </div>
                <div className="actions">
                  {hold ? (
                    <button className="btn btn-blue" onClick={() => resume(p)}>▶ Resume donations</button>
                  ) : (
                    <button className="btn btn-ghost" onClick={() => setDialog({ type: "pause", patient: p })}>⏸ Pause donations</button>
                  )}
                  <button className="btn btn-line-red" onClick={() => setDialog({ type: "close", patient: p })}>⛔ Close</button>
                </div>
              </div>
            );
          })}

          <AdminReviewQueue applications={applications} />
        </>
      ) : (
        <>
          <div className="sec-head"><h2>New donor registrations</h2></div>
          {newDonors.length === 0 && <p className="muted-sm admin-empty">Every donor is verified.</p>}
          {newDonors.map(({ account, record }) => (
            <div className="review" key={account.id}>
              <div>
                <div className="pname">{account.name} <span className="status-pill paused">Waiting</span></div>
                <div className="pmeta"><b>{record.bloodGroup || "Blood group not given"}</b> · 📍 {record.district || "—"} · {account.phone}</div>
                {record.pledges.length > 0 && <div className="pmeta">🫀 Pledged: {record.pledges.map((pl) => pl.organ).join(", ")}</div>}
              </div>
              <div className="actions">
                <button className="btn btn-green" onClick={() => updateDonor(account, record, { verified: true }, "donor_verified")}>Verify</button>
                <button className="btn btn-red" onClick={() => updateDonor(account, record, { status: "unregistered" }, "donor_rejected")}>Reject</button>
              </div>
            </div>
          ))}

          <div className="sec-head"><h2>Registered donors</h2></div>
          {donorAccounts.map(({ account, record }) => (
            <div className="review" key={account.id}>
              <div>
                <div className="pname">
                  {account.name}
                  <span className={`status-pill ${record.status}`}>{record.status === "paused" ? "Paused" : "Active"}</span>
                </div>
                <div className="pmeta"><b>{record.bloodGroup}</b> · 📍 {record.district} · {record.donations.length} donations logged</div>
              </div>
              <div className="actions">
                {record.status === "paused" ? (
                  <button className="btn btn-blue" onClick={() => updateDonor(account, record, { status: "active" }, "donor_restored")}>▶ Restore</button>
                ) : (
                  <button className="btn btn-ghost" onClick={() => updateDonor(account, record, { status: "paused" }, "donor_suspended")}>⏸ Suspend</button>
                )}
              </div>
            </div>
          ))}
          <p className="muted-sm admin-empty">The sample donors in the public directory join this list once the backend is connected.</p>
        </>
      )}

      {dialog?.type === "pause" && (
        <AdminActionDialog
          title={`Pause donations to ${dialog.patient.name}?`}
          text="The campaign stays visible, but the Donate button is turned off until you resume it. The patient is told why."
          confirmLabel="⏸ Pause donations"
          onConfirm={(reason) => pause(dialog.patient, reason)}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.type === "close" && (
        <AdminActionDialog
          title={`Close ${dialog.patient.name}'s campaign?`}
          text="This cannot be undone. The campaign moves to the patient's past campaigns and the money raised is handled by the finance team."
          confirmLabel="⛔ Close campaign"
          danger
          onConfirm={(reason) => closeByAdmin(dialog.patient, reason)}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  );
}