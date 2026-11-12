"use client";

import { useState } from "react";
import Link from "next/link";
import PhotoUploader from "./PhotoUploader";
import { DISTRICTS } from "@/lib/constants";

const DOCUMENTS = [
  { name: "medicalReports", label: "📄 Medical reports" },
  { name: "hospitalBills", label: "🧾 Hospital bills" },
  { name: "doctorLetter", label: "🖊 Doctor's recommendation" },
  { name: "costEstimate", label: "💰 Cost estimation letter" },
  { name: "gnCertificate", label: "🏛 Grama Niladhari certificate" },
];

const NEXT_STEPS = [
  { title: "Submitted ✓", text: "Documents uploaded securely.", color: "var(--green)", ring: "var(--green-soft)" },
  { title: "AI document check — in progress", text: "Stamps, signatures and duplicates are being scanned.", color: "#B8860B", ring: "#FFF1E0" },
  { title: "Admin review", text: "A MedFund reviewer confirms the AI result with the hospital.", color: "var(--mist)", ring: "var(--paper)" },
  { title: "Campaign goes live", text: "You receive a registration number like MED-2026-000181.", color: "var(--mist)", ring: "var(--paper)" },
];

function DocumentInput({ name, label }) {
  const [fileName, setFileName] = useState("");

  return (
    <label className="doc" style={{ cursor: "pointer" }}>
      {label}
      <span className="st" style={fileName ? undefined : { background: "var(--mist)", color: "var(--blue)" }}>
        {fileName ? "Attached ✓" : "Upload"}
      </span>
      <input type="file" name={name} accept="image/*,.pdf" hidden onChange={(e) => setFileName(e.target.files[0]?.name ?? "")} />
    </label>
  );
}

export default function PatientApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send new FormData(e.target) to POST /api/patients when the backend exists
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <div className="success">
          <div className="ring">✓</div>
          <h3>Application received</h3>
          <p>
            Tracking number: <b>MED-2026-PENDING-0192</b>
            <br />You&apos;ll get an SMS and email at every step below.
          </p>
        </div>
        <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "left" }}>
          {NEXT_STEPS.map((step, i) => (
            <div className="tl" key={step.title}>
              <div className="rail">
                <div className="nd" style={{ background: step.color, borderColor: step.ring }} />
                {i < NEXT_STEPS.length - 1 && <div className="ln" />}
              </div>
              <div className="tx">
                <b>{step.title}</b>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <Link className="btn btn-blue" href="/" style={{ marginTop: 10 }}>Back to home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>1 · Personal details</h3>
        <div className="formgrid">
          <div className="field"><label>Full name (as on NIC)</label><input name="fullName" required placeholder="Patient's full name" /></div>
          <div className="field"><label>NIC number</label><input name="nic" required placeholder="XXXXXXXXXV / 12-digit NIC" /></div>
          <div className="field"><label>Date of birth</label><input name="dob" type="date" /></div>
          <div className="field"><label>Phone</label><input name="phone" type="tel" required placeholder="07X XXX XXXX" /></div>
          <div className="field"><label>Email</label><input name="email" type="email" placeholder="name@email.com" /></div>
          <div className="field">
            <label>District</label>
            <select name="district" defaultValue="Colombo">
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field full"><label>Address</label><input name="address" placeholder="House no, street, town" /></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>2 · Patient photos <span className="si">රෝගියාගේ ඡායාරූප</span></h3>
        <p>A clear, recent photo builds donor trust — it appears on the campaign page after approval. You can add up to 6 more photos (hospital, recovery, family) as a gallery.</p>
        <PhotoUploader />
        <div className="note">
          🛡 Upload photos only with the patient&apos;s consent. Please avoid graphic medical images — reports and scans belong in the private documents section below.
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>3 · Medical details</h3>
        <div className="formgrid">
          <div className="field"><label>Disease / condition</label><input name="disease" required placeholder="e.g. Kidney failure" /></div>
          <div className="field"><label>Hospital</label><input name="hospital" required placeholder="e.g. National Hospital, Colombo" /></div>
          <div className="field"><label>Consultant doctor</label><input name="doctor" placeholder="Dr. …" /></div>
          <div className="field"><label>Treatment needed</label><input name="treatment" placeholder="e.g. Transplant surgery" /></div>
          <div className="field"><label>Required amount (Rs)</label><input name="amount" type="number" min="1" required placeholder="e.g. 2500000" /></div>
          <div className="field"><label>Deadline</label><input name="deadline" type="date" /></div>
          <div className="field full">
            <label>Campaign urgency</label>
            <div className="urgopt">
              <label><input type="radio" name="urgency" value="urgent" /> ⚡ <b>&nbsp;Urgent</b> — treatment is time-critical; shown on the Urgent needs board after approval</label>
              <label><input type="radio" name="urgency" value="normal" defaultChecked /> 🗓 <b>&nbsp;Non-urgent</b> — standard campaign</label>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>4 · Bank details <span className="si">shown masked to the public</span></h3>
        <div className="formgrid">
          <div className="field"><label>Bank</label><input name="bank" placeholder="e.g. Bank of Ceylon" /></div>
          <div className="field"><label>Branch</label><input name="branch" placeholder="e.g. Moratuwa" /></div>
          <div className="field"><label>Account holder</label><input name="accountHolder" placeholder="Must match the NIC name" /></div>
          <div className="field"><label>Account number</label><input name="accountNumber" placeholder="XXXX XXXX XXXX" /></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>5 · Documents for verification</h3>
        <p>Clear photos or PDF scans. The AI reads stamps, signatures and text; a MedFund admin then approves every campaign manually.</p>
        <div className="docgrid">
          {DOCUMENTS.map((d) => <DocumentInput key={d.name} {...d} />)}
        </div>
      </div>

      <label className="anon" style={{ alignItems: "start", marginBottom: 14 }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
        I confirm this information is true, and consent to MedFund verifying these documents with the hospital and displaying redacted copies publicly (Personal Data Protection Act consent).
      </label>
      <button type="submit" className="btn btn-green btn-big" style={{ width: "100%", justifyContent: "center", opacity: consent ? 1 : 0.5 }} disabled={!consent}>
        Submit for verification
      </button>
    </form>
  );
}