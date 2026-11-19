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
  if (status === "removed") {
    return <div className="form-error">{t("reg_removed")}</div>;
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
    if (record?.status === "removed") {
      setBloodResult("removed");
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
    if (record?.status === "removed") {
      setOrganResult("removed");
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
          <div className="field"><label>{t("full_name")}</label><input name="fullName" defaultValue={user?.name} placeholder={t("name_ph")} /></div>
          <div className="field">
            <label>{t("lbl_blood_group")}</label>
            <select name="bloodGroup" defaultValue={record?.bloodGroup || BLOOD_GROUPS[0]}>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="field">
            <label>{t("lbl_district")}</label>
            <select name="district" defaultValue={record?.district || "Colombo"}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field"><label>{t("phone_private")}</label><input name="phone" defaultValue={user?.phone} placeholder="07X XXX XXXX" /></div>
          <div className="field full">
            <label>{t("don_urgency")}</label>
            <div className="urgopt">
              <label><input type="radio" name="urgency" value="urgent" defaultChecked /> <span><b>{t("urg_resp")}</b> — {t("urg_resp_desc")}</span></label>
              <label><input type="radio" name="urgency" value="normal" /> <span><b>🗓 {t("nonurg")}</b> — {t("nonurg_desc")}</span></label>
            </div>
          </div>
          <div className="field full">
            <button type="submit" className="btn btn-blue">{t("blood_btn")}</button>
          </div>
          <div className="field full"><Result status={bloodResult} savedKey="reg_saved_blood" /></div>
        </form>
        <p className="legal">{t("blood_legal")}</p>
      </div>

      <div className="mod organ" id="organ">
        <span className="glyph">🫀</span>
        <h3>{t("organ_h")} {lang === "en" && <span className="si">ඉන්ද්‍රිය පරිත්‍යාග ප්‍රතිඥාව</span>}</h3>
        <p>{t("organ_p")}</p>
        <form key={formKey} className="formgrid" onSubmit={handleOrgan}>
          <div className="field"><label>{t("full_name")}</label><input name="fullName" defaultValue={user?.name} placeholder={t("name_ph")} /></div>
          <div className="field">
            <label>{t("organ_tissue")}</label>
            <select name="organ">
              {ORGANS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label>{t("lbl_blood_group")}</label>
            <select name="bloodGroup" defaultValue={record?.bloodGroup || BLOOD_GROUPS[0]}>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="field">
            <label>{t("lbl_district")}</label>
            <select name="district" defaultValue={record?.district || "Colombo"}>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field full">
            <label>{t("pledge_urgency")}</label>
            <div className="urgopt">
              <label><input type="radio" name="urgency" value="urgent" defaultChecked /> <span><b>⚡ {t("urgent")}</b> — {t("organ_urgent_desc")}</span></label>
              <label><input type="radio" name="urgency" value="normal" /> <span><b>🗓 {t("nonurg")}</b> — {t("organ_nonurg_desc")}</span></label>
            </div>
          </div>
          <div className="field full">
            <button type="submit" className="btn btn-green">{t("organ_btn")}</button>
          </div>
          <div className="field full"><Result status={organResult} savedKey="reg_saved_organ" /></div>
        </form>
        <p className="legal">{t("organ_legal")}</p>
      </div>
    </div>
  );
}