"use client";

import { useState } from "react";
import { formatRs } from "@/lib/format";

const CHECK_LABELS = {
  stamp: "Hospital stamp",
  signature: "Doctor signature",
  duplicate: "Duplicate check",
  edits: "Image edits",
};

const ICONS = { pass: "✓", warn: "!", fail: "✕" };

const DECISIONS = {
  approved: "✓ Approved — campaign is live",
  rejected: "✕ Rejected",
  info: "✉ More documents requested",
};

export default function AdminReviewQueue({ applications }) {
  const [decisions, setDecisions] = useState({});

  // TODO: send each decision to PATCH /api/admin/applications/{id} once the backend exists
  const decide = (id, decision) => setDecisions((prev) => ({ ...prev, [id]: decision }));

  const pending = applications.filter((a) => !decisions[a.id]).length;
  const flagged = applications.filter((a) => Object.values(a.checks).includes("fail")).length;

  return (
    <>
      <div className="admin-stats">
        <div className="fact"><span>Waiting for review</span><b>{pending}</b></div>
        <div className="fact"><span>Flagged by AI</span><b>{flagged}</b></div>
        <div className="fact"><span>Live campaigns</span><b>5</b></div>
        <div className="fact"><span>Approved this month</span><b>{23 + Object.values(decisions).filter((d) => d === "approved").length}</b></div>
      </div>

      <div className="sec-head">
        <div>
          <h2>Campaign review queue</h2>
          <span className="si">AI results must be confirmed by a person before a campaign goes live</span>
        </div>
      </div>

      {applications.map((a) => {
        const decision = decisions[a.id];
        const hasFail = Object.values(a.checks).includes("fail");

        return (
          <div className="review" key={a.id}>
            <div>
              <div className="pname">
                {a.name}
                {a.urgent && <span className="vbadge" style={{ background: "var(--urgent-soft)", color: "var(--urgent)" }}>⚡ Urgent</span>}
                {hasFail && <span className="vbadge" style={{ background: "var(--urgent-soft)", color: "var(--urgent)" }}>⚠ AI flagged</span>}
              </div>
              <div className="pmeta">
                <b>{a.disease}</b> · {a.hospital} · 📍 {a.district} · {formatRs(a.need)}
              </div>
              <div className="pmeta">{a.id} · submitted {a.submitted}</div>
              <div className="checks">
                {Object.entries(a.checks).map(([key, result]) => (
                  <span key={key} className={`check ${result}`}>{ICONS[result]} {CHECK_LABELS[key]}</span>
                ))}
              </div>
            </div>

            <div className="actions">
              {decision ? (
                <>
                  <span className={`decision ${decision}`}>{DECISIONS[decision]}</span>
                  <button className="btn btn-ghost" onClick={() => decide(a.id, undefined)}>Undo</button>
                </>
              ) : (
                <>
                  <button className="btn btn-green" onClick={() => decide(a.id, "approved")} disabled={hasFail} title={hasFail ? "Resolve AI flags first" : ""} style={hasFail ? { opacity: 0.45 } : undefined}>
                    Approve
                  </button>
                  <button className="btn btn-ghost" onClick={() => decide(a.id, "info")}>Request info</button>
                  <button className="btn btn-red" onClick={() => decide(a.id, "rejected")}>Reject</button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}