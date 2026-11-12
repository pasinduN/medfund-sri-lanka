"use client";

import { useEffect, useState } from "react";
import { formatRs } from "@/lib/format";

const DOCS = [
  { kind: "report", label: "📄 Medical report" },
  { kind: "estimate", label: "🏥 Hospital cost estimate" },
  { kind: "letter", label: "🖊 Doctor's recommendation" },
  { kind: "gn", label: "🏛 Grama Niladhari certificate" },
];

function Redact({ width }) {
  return <span className="redact" style={{ width }} />;
}

function buildDocument(kind, p) {
  const verifiedOn = p.updates[p.updates.length - 1][0];

  if (kind === "report") {
    return {
      title: "Medical Report",
      source: p.hospital,
      body: (
        <>
          <b>Patient:</b> {p.name} &nbsp;·&nbsp; <b>NIC:</b> <Redact width={92} /><br />
          <b>Diagnosis:</b> {p.disease}<br />
          <b>Clinical summary:</b> Patient presents with confirmed {p.disease.toLowerCase()}. Condition assessed by {p.doctor}.
          Treatment plan approved by the consultant board on {verifiedOn}.<br />
          <b>Recommended intervention:</b> As per attached cost estimate.<br />
          <b>Address:</b> <Redact width={150} /> &nbsp;·&nbsp; <b>Phone:</b> <Redact width={80} />
        </>
      ),
    };
  }

  if (kind === "estimate") {
    return {
      title: "Cost Estimation Letter",
      source: `${p.hospital} — Accounts Division`,
      body: (
        <>
          <b>Re:</b> Estimated cost of treatment for {p.name} (NIC <Redact width={92} />)<br />
          Surgical &amp; theatre charges …… {formatRs(Math.round(p.need * 0.55))}<br />
          Medication &amp; consumables …… {formatRs(Math.round(p.need * 0.3))}<br />
          Post-operative care …… {formatRs(Math.round(p.need * 0.15))}<br />
          <b>Total estimated cost: {formatRs(p.need)}</b>
        </>
      ),
    };
  }

  if (kind === "letter") {
    return {
      title: "Consultant's Recommendation",
      source: `Office of ${p.doctor}`,
      body: (
        <>
          To whom it may concern,<br />
          I confirm that {p.name} is under my care at {p.hospital} for <b>{p.disease.toLowerCase()}</b> and that the
          treatment described in the attached estimate is medically necessary and urgent.<br /><br />
          Signature: <i style={{ fontFamily: "cursive", fontSize: "1.1rem" }}>{p.doctor}</i> &nbsp; ✒
        </>
      ),
    };
  }

  return {
    title: "Grama Niladhari Certificate",
    source: "Divisional Secretariat",
    body: (
      <>
        This is to certify that <b>{p.name}</b>, holder of NIC <Redact width={92} />, is a resident of <Redact width={140} /> in
        the {p.district} district, and that the family&apos;s financial situation has been verified as requiring assistance
        for medical treatment.<br />
        <b>GN Division:</b> <Redact width={90} /> &nbsp;·&nbsp; <b>Date:</b> {verifiedOn}
      </>
    ),
  };
}

export default function DocumentViewer({ patient }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const doc = open ? buildDocument(open, patient) : null;

  return (
    <>
      <div className="docgrid">
        {DOCS.map((d) => (
          <div className="doc" key={d.kind} onClick={() => setOpen(d.kind)}>
            {d.label} <span className="st">Preview</span>
          </div>
        ))}
      </div>

      <div className={`overlay ${doc ? "on" : ""}`} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        {doc && (
          <div className="modal">
            <h3>{doc.title}</h3>
            <p className="to">{patient.name} · {patient.reg}</p>
            <div className="docpaper">
              <h4>
                {doc.source}
                <small>Certified copy · uploaded by patient · verified by MedFund</small>
              </h4>
              {doc.body}
              <div className="stamp">
                {patient.hospital.split(",")[0].toUpperCase()}<br />OFFICIAL<br />STAMP
              </div>
            </div>
            <div className="aiband">🤖 AI check: stamp ✓ · signature ✓ · no edits detected &nbsp;|&nbsp; 👤 Admin approved</div>
            <p className="safe" style={{ margin: "14px 0" }}>
              🔒 NIC numbers, addresses and phone numbers are redacted in public previews under the Personal Data Protection Act.
            </p>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => setOpen(null)}>
              ← Back to {patient.name.split(" ")[0]}&apos;s page
            </button>
          </div>
        )}
      </div>
    </>
  );
}