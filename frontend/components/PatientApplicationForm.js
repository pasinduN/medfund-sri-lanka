"use client";

import { useState } from "react";
import Link from "next/link";
import PhotoUploader from "./PhotoUploader";
import { DISTRICTS } from "@/lib/constants";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { emptyCampaignRecord, useCampaignRecord } from "@/lib/campaignStore";
import { todayISO } from "@/lib/dates";
import { notifyAdmins } from "@/lib/notificationStore";

const DOCUMENTS = [
  { name: "medicalReports", label: "ap_doc_reports" },
  { name: "hospitalBills", label: "ap_doc_bills" },
  { name: "doctorLetter", label: "doc_letter" },
  { name: "costEstimate", label: "ap_doc_estimate" },
  { name: "gnCertificate", label: "doc_gn" },
];

const NEXT_STEPS = [
  { title: "ap_s1_t", text: "ap_s1", color: "var(--green)", ring: "var(--green-soft)" },
  { title: "ap_s2_t", text: "ap_s2", color: "#B8860B", ring: "#FFF1E0" },
  { title: "step_admin", text: "ap_s3", color: "var(--mist)", ring: "var(--paper)" },
  { title: "ap_s4_t", text: "ap_s4", color: "var(--mist)", ring: "var(--paper)" },
];

function DocumentInput({ name, label }) {
  const { t } = useLanguage();
  const [fileName, setFileName] = useState("");

  return (
    <label className="doc" style={{ cursor: "pointer" }}>
      {t(label)}
      <span className="st" style={fileName ? undefined : { background: "var(--mist)", color: "var(--blue)" }}>
        {fileName ? t("ap_attached") : t("ap_upload")}
      </span>
      <input type="file" name={name} accept="image/*,.pdf" hidden onChange={(e) => setFileName(e.target.files[0]?.name ?? "")} />
    </label>
  );
}

export default function PatientApplicationForm() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [record, save] = useCampaignRecord(user?.id);
  const [tracking, setTracking] = useState(null);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send new FormData(e.target) to POST /api/patients when the backend exists
    const form = new FormData(e.target);
    const reg = `MED-2026-PENDING-${String(Date.now()).slice(-4)}`;
    if (user) {
      save({
        ...emptyCampaignRecord(),
        ...record,
        application: {
          reg,
          disease: form.get("disease"),
          hospital: form.get("hospital"),
          need: Number(form.get("amount")),
          submitted: todayISO(),
        },
      });
      notifyAdmins("new_application", { name: form.get("fullName") });
    }
    setTracking(reg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (tracking) {
    return (
      <div className="panel" style={{ textAlign: "center" }}>
        <div className="success">
          <div className="ring">✓</div>
          <h3>{t("ap_received")}</h3>
          <p>
            {t("tracking_no")}: <b>{tracking}</b>
            <br />{t("ap_sms")}
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
                <b>{t(step.title)}</b>
                <p>{t(step.text)}</p>
              </div>
            </div>
          ))}
        </div>
        <Link className="btn btn-blue" href={user ? "/profile" : "/"} style={{ marginTop: 10 }}>
          {user ? t("ap_track_profile") : t("go_home")}
        </Link>
      </div>
    );
  }

  return (
    // re-mounts once the user is known, so their name, phone and email fill in
    <form key={user?.id ?? "guest"} onSubmit={handleSubmit}>
      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>{t("ap_sec1")}</h3>
        <div className="formgrid">
          <div className="field"><label>{t("ap_name_nic")}</label><input name="fullName" required defaultValue={user?.name} placeholder={t("ap_name_ph")} /></div>
          <div className="field"><label>{t("ap_nic")}</label><input name="nic" required placeholder={t("ap_nic_ph")} /></div>
          <div className="field"><label>{t("ap_dob")}</label><input name="dob" type="date" /></div>
          <div className="field"><label>{t("phone")}</label><input name="phone" type="tel" required defaultValue={user?.phone} placeholder="07X XXX XXXX" /></div>
          <div className="field"><label>{t("email")}</label><input name="email" type="email" defaultValue={user?.email} placeholder="name@email.com" /></div>
          <div className="field">
            <label>{t("lbl_district")}</label>
            <select name="district" defaultValue="Colombo">
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field full"><label>{t("ap_address")}</label><input name="address" placeholder={t("ap_address_ph")} /></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>{t("ap_sec2")}</h3>
        <p>{t("ap_photos_p")}</p>
        <PhotoUploader />
        <div className="note">🛡 {t("ap_photos_note")}</div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>{t("ap_sec3")}</h3>
        <div className="formgrid">
          <div className="field"><label>{t("ap_disease")}</label><input name="disease" required placeholder={t("ap_disease_ph")} /></div>
          <div className="field"><label>{t("fact_hospital")}</label><input name="hospital" required placeholder={t("ap_hospital_ph")} /></div>
          <div className="field"><label>{t("ap_doctor")}</label><input name="doctor" placeholder={t("ap_doctor_ph")} /></div>
          <div className="field"><label>{t("ap_treatment")}</label><input name="treatment" placeholder={t("ap_treatment_ph")} /></div>
          <div className="field"><label>{t("ap_amount")}</label><input name="amount" type="number" min="1" required placeholder={t("ap_amount_ph")} /></div>
          <div className="field"><label>{t("ap_deadline")}</label><input name="deadline" type="date" /></div>
          <div className="field full">
            <label>{t("ap_urgency")}</label>
            <div className="urgopt">
              <label><input type="radio" name="urgency" value="urgent" /> <span><b>⚡ {t("urgent")}</b> — {t("ap_urgent_desc")}</span></label>
              <label><input type="radio" name="urgency" value="normal" defaultChecked /> <span><b>🗓 {t("nonurg")}</b> — {t("ap_normal_desc")}</span></label>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>{t("ap_sec4")} <span className="si">{t("ap_masked")}</span></h3>
        <div className="formgrid">
          <div className="field"><label>{t("bank_bank")}</label><input name="bank" placeholder={t("ap_bank_ph")} /></div>
          <div className="field"><label>{t("bank_branch")}</label><input name="branch" placeholder={t("ap_branch_ph")} /></div>
          <div className="field"><label>{t("bank_holder")}</label><input name="accountHolder" placeholder={t("ap_holder_ph")} /></div>
          <div className="field"><label>{t("bank_number")}</label><input name="accountNumber" placeholder="XXXX XXXX XXXX" /></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 18 }}>
        <h3>{t("ap_sec5")}</h3>
        <p>{t("ap_docs_p")}</p>
        <div className="docgrid">
          {DOCUMENTS.map((d) => <DocumentInput key={d.name} {...d} />)}
        </div>
      </div>

      <label className="anon" style={{ alignItems: "start", marginBottom: 14 }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
        {t("ap_consent")}
      </label>
      <button type="submit" className="btn btn-green btn-big" style={{ width: "100%", justifyContent: "center", opacity: consent ? 1 : 0.5 }} disabled={!consent}>
        {t("ap_submit")}
      </button>
    </form>
  );
}