"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { clashingDonation } from "@/lib/donorStore";
import { formatDate, todayISO } from "@/lib/dates";

// organs a living person can give — after-life pledges are made on the Register as donor page
const LIVING_ORGANS = ["Kidney", "Liver (part)", "Bone marrow"];

export default function LogDonationForm({ record, onSave, onCancel }) {
  const { lang, t } = useLanguage();
  const [type, setType] = useState("blood");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const date = form.get("date");

    if (date > todayISO()) {
      setError(t("err_future_date"));
      return;
    }
    if (type === "blood") {
      const clash = clashingDonation(record, date);
      if (clash) {
        setError(t("err_too_soon").replace("{date}", formatDate(clash.date, lang)));
        return;
      }
    }

    const donation = { id: `d${Date.now()}`, type, date, place: form.get("place").trim() };
    if (type === "organ") donation.organ = form.get("organ");
    onSave({ ...record, donations: [...record.donations, donation] });
  };

  return (
    <form className="formgrid logform" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="dtype">{t("donation_type")}</label>
        <select
          id="dtype"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setError("");
          }}
        >
          <option value="blood">🩸 {t("hist_blood")}</option>
          <option value="organ">🫀 {t("organ_donation")}</option>
        </select>
      </div>
      {type === "organ" && (
        <div className="field">
          <label htmlFor="organ">{t("organ")}</label>
          <select id="organ" name="organ">
            {LIVING_ORGANS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor="ddate">{t("donation_date")}</label>
        <input id="ddate" name="date" type="date" required max={todayISO()} defaultValue={todayISO()} />
      </div>
      <div className="field">
        <label htmlFor="place">{t("donation_place")}</label>
        <input id="place" name="place" placeholder={t("place_ph")} />
      </div>

      {error && <div className="form-error full" role="alert">{error}</div>}

      <div className="form-actions full">
        <button type="submit" className="btn btn-green">{t("save")}</button>
        <button type="button" className="btn btn-soft" onClick={onCancel}>{t("cancel")}</button>
      </div>
    </form>
  );
}