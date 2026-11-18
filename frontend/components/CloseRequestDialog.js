"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";

const REASONS = ["close_r_done", "close_r_other_funds", "close_r_plan", "close_r_other"];

export default function CloseRequestDialog({ onSend, onCancel }) {
  const { t } = useLanguage();
  const [reason, setReason] = useState(REASONS[0]);
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({ reason, note: new FormData(e.target).get("note").trim() });
  };

  return (
    <div className="overlay on" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="close-title" onSubmit={handleSubmit}>
        <h3 id="close-title">{t("close_title")}</h3>
        <p className="to">{t("close_text")}</p>

        <div className="urgopt" role="radiogroup">
          {REASONS.map((r) => (
            <label key={r}>
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} /> {t(r)}
            </label>
          ))}
        </div>

        <div className="field" style={{ margin: "14px 0" }}>
          <label htmlFor="close-note">{t("close_note")}</label>
          <textarea id="close-note" name="note" rows={3} placeholder={t("close_note_ph")} />
        </div>

        <div className="dialog-actions">
          <button type="submit" className="btn btn-red">{t("close_send")}</button>
          <button ref={cancelRef} type="button" className="btn btn-soft" onClick={onCancel}>{t("cancel")}</button>
        </div>
      </form>
    </div>
  );
}