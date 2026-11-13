"use client";

import { useState } from "react";
import { BLOOD_GROUPS, DISTRICTS } from "@/lib/constants";
import { useLanguage } from "./LanguageProvider";

function SubmitButton({ className, label, doneLabel }) {
  const [sent, setSent] = useState(false);

  const handleClick = () => {
    setSent(true);
    setTimeout(() => setSent(false), 2600);
  };

  return (
    <button className={`btn ${className}`} onClick={handleClick} disabled={sent}>
      {sent ? doneLabel : label}
    </button>
  );
}

export default function DonorSignup() {
  const { lang, t } = useLanguage();

  return (
    <div className="wrap duo">
      <div className="mod blood">
        <span className="glyph">🩸</span>
        <h3>{t("blood_h")} {lang === "en" && <span className="si">රුධිර දායකයෙක් වන්න</span>}</h3>
        <p>{t("blood_p")}</p>
        <div className="formgrid">
          <div className="field"><label>Full name</label><input placeholder="Your name" /></div>
          <div className="field">
            <label>Blood group</label>
            <select>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
          </div>
          <div className="field">
            <label>District</label>
            <select defaultValue="Colombo">
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field"><label>Phone (kept private)</label><input placeholder="07X XXX XXXX" /></div>
          <div className="field full">
            <label>Donation urgency</label>
            <div className="urgopt">
              <label><input type="radio" name="burg" defaultChecked /> ⚡ <b>&nbsp;Urgent responder</b> — contact me anytime, including night-time emergencies</label>
              <label><input type="radio" name="burg" /> 🗓 <b>&nbsp;Non-urgent</b> — scheduled donation camps and appointments only</label>
            </div>
          </div>
          <div className="field full">
            <SubmitButton className="btn-blue" label={t("blood_btn")} doneLabel="Registered ✓ We'll contact you when a match is needed" />
          </div>
        </div>
        <p className="legal">Contact requests are routed through MedFund. Your details are never listed publicly.</p>
      </div>

      <div className="mod organ" id="organ">
        <span className="glyph">🫀</span>
        <h3>{t("organ_h")} {lang === "en" && <span className="si">ඉන්ද්‍රිය පරිත්‍යාග ප්‍රතිඥාව</span>}</h3>
        <p>{t("organ_p")}</p>
        <div className="formgrid">
          <div className="field"><label>Full name</label><input placeholder="Your name" /></div>
          <div className="field">
            <label>Organ / tissue</label>
            <select>
              {["Kidney", "Liver", "Eyes (cornea)", "Bone marrow", "Any — after life"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Blood group</label>
            <select>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
          </div>
          <div className="field">
            <label>District</label>
            <select defaultValue="Colombo">
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field full">
            <label>Pledge urgency</label>
            <div className="urgopt">
              <label><input type="radio" name="ourg" defaultChecked /> ⚡ <b>&nbsp;Urgent</b> — living donor, willing to be contacted immediately for time-critical matches</label>
              <label><input type="radio" name="ourg" /> 🗓 <b>&nbsp;Non-urgent</b> — after-life pledge, no immediate contact needed</label>
            </div>
          </div>
          <div className="field full">
            <SubmitButton className="btn-green" label={t("organ_btn")} doneLabel="Pledge recorded ✓ A hospital coordinator will guide next steps" />
          </div>
        </div>
        <p className="legal">Pledges are shared only with hospital transplant units. Consent can be withdrawn at any time.</p>
      </div>
    </div>
  );
}