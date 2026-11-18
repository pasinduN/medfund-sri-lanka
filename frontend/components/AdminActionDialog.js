"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";

// The patient sees the chosen reason in their notification, so reasons are i18n keys
const REASONS = ["mod_r_docs", "mod_r_hospital", "mod_r_done", "mod_r_other"];

export default function AdminActionDialog({ title, text, confirmLabel, danger, onConfirm, onCancel }) {
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

  return (
    <div className="overlay on" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
        <h3 id="admin-dialog-title">{title}</h3>
        <p className="to">{text}</p>

        <div className="urgopt" role="radiogroup" style={{ marginBottom: 16 }}>
          {REASONS.map((r) => (
            <label key={r}>
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} /> {t(r)}
            </label>
          ))}
        </div>

        <div className="dialog-actions">
          <button className={`btn ${danger ? "btn-red" : "btn-blue"}`} onClick={() => onConfirm(reason)}>{confirmLabel}</button>
          <button ref={cancelRef} className="btn btn-soft" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}