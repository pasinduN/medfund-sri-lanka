"use client";

import { useState } from "react";
import Link from "next/link";
import { BLOOD_GROUPS, DISTRICTS, ORGANS } from "@/lib/constants";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { emptyDonor, useDonorRecord } from "@/lib/donorStore";
import { todayISO } from "@/lib/dates";
import { notifyAdmins } from "@/lib/notificationStore";

function Result({ status, savedKey }) {
  const { t } = useLanguage();

  if (status === "saved") {
    return <div className="form-info">{t(savedKey)} <Link href="/profile">{t("see_profile")} →</Link></div>;
  }
  if (status === "login") {
    return <div className="form-error">{t("reg_need_login")} <Link href="/login">{t("nav_login")} →</Link></div>;
  }
  return null;
}

export default function DonorSignup() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [record, save] = useDonorRecord(user?.id);
  const [bloodResult, setBloodResult] = useState(null);
  const [organResult, setOrganResult] = useState(null);

  // registering again also brings back a paused or unregistered donor
  const current = () => ({ ...emptyDonor(), ...record, status: "active" });

  const handleBlood = (e) => {
    e.preventDefault();
    if (!user) {
      setBloodResult("login");
      return;
    }
    const form = new FormData(e.target);
    save({
      ...current(),
      bloodGroup: form.get("bloodGroup"),
      district: form.get("district"),
      urgent: form.get("urgency") === "urgent",
    });
    if (!record) notifyAdmins("new_donor", { name: user.name });
    setBloodResult("saved");
  };

  const handleOrgan = (e) => {
    e.preventDefault();
    if (!user) {
      setOrganResult("login");
      return;
    }
    const form = new FormData(e.target);
    const donor = current();
    const organ = form.get("organ");
    save({
      ...donor,
      bloodGroup: donor.bloodGroup || form.get("bloodGroup"),
      district: donor.district || form.get("district"),
      pledges: [
        ...donor.pledges.filter((p) => p.organ !== organ),
        { organ, date: todayISO(), urgent: form.get("urgency") === "urgent" },
      ],
    });
    if (!record) notifyAdmins("new_donor", { name: user.name });
    setOrganResult("saved");
  };

  // the forms re-mount when the user is known, so their saved details fill in
  const formKey = user?.id ?? "guest";

  return (
    <div className="wrap duo">
      <div className="mod blood">
        <span className="glyph">🩸</span>
        <h3>{t("blood_h")} {lang === "en" && <span className="si">රුධිර දායකයෙක් වන්න</span>}</h3>
        <p>{t("blood_p")}</p>
        <form key={formKey} className="formgrid" onSubmit={handleBlood}>
          <div className="field"><label>Full name</label><input name="fullName" defaultValue={user?.name} placeholder="Your name" /></div>
          <div className="field">
            <label>Blood group</label>
            <select name="bloodGroup" defaultValue={record?.bloodGroup || BLOOD_GROUPS[0]}>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="field">
            <label>District</label>
            <select name="district" defaultValue={record?.district || "Colombo"}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field"><label>Phone (kept private)</label><input name="phone" defaultValue={user?.phone} placeholder="07X XXX XXXX" /></div>
          <div className="field full">
            <label>Donation urgency</label>
            <div className="urgopt">
              <label><input type="radio" name="urgency" value="urgent" defaultChecked /> ⚡ <b>&nbsp;Urgent responder</b> — contact me anytime, including night-time emergencies</label>
              <label><input type="radio" name="urgency" value="normal" /> 🗓 <b>&nbsp;Non-urgent</b> — scheduled donation camps and appointments only</label>
            </div>
          </div>
          <div className="field full">
            <button type="submit" className="btn btn-blue">{t("blood_btn")}</button>
          </div>
          <div className="field full"><Result status={bloodResult} savedKey="reg_saved_blood" /></div>
        </form>
        <p className="legal">Contact requests are routed through MedFund. Your details are never listed publicly.</p>
      </div>

      <div className="mod organ" id="organ">
        <span className="glyph">🫀</span>
        <h3>{t("organ_h")} {lang === "en" && <span className="si">ඉන්ද්‍රිය පරිත්‍යාග ප්‍රතිඥාව</span>}</h3>
        <p>{t("organ_p")}</p>
        <form key={formKey} className="formgrid" onSubmit={handleOrgan}>
          <div className="field"><label>Full name</label><input name="fullName" defaultValue={user?.name} placeholder="Your name" /></div>
          <div className="field">
            <label>Organ / tissue</label>
            <select name="organ">
              {ORGANS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Blood group</label>
            <select name="bloodGroup" defaultValue={record?.bloodGroup || BLOOD_GROUPS[0]}>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="field">
            <label>District</label>
            <select name="district" defaultValue={record?.district || "Colombo"}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field full">
            <label>Pledge urgency</label>
            <div className="urgopt">
              <label><input type="radio" name="urgency" value="urgent" defaultChecked /> ⚡ <b>&nbsp;Urgent</b> — living donor, willing to be contacted immediately for time-critical matches</label>
              <label><input type="radio" name="urgency" value="normal" /> 🗓 <b>&nbsp;Non-urgent</b> — after-life pledge, no immediate contact needed</label>
            </div>
          </div>
          <div className="field full">
            <button type="submit" className="btn btn-green">{t("organ_btn")}</button>
          </div>
          <div className="field full"><Result status={organResult} savedKey="reg_saved_organ" /></div>
        </form>
        <p className="legal">Pledges are shared only with hospital transplant units. Consent can be withdrawn at any time.</p>
      </div>
    </div>
  );
}