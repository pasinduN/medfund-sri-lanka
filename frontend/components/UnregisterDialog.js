"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "./LanguageProvider";

export default function UnregisterDialog({ onPause, onUnregister, onCancel }) {
  const { t } = useLanguage();
  const cancelRef = useRef(null);

  // the safe choice gets focus, so pressing Enter by mistake doesn't unregister anyone
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
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="unreg-title" aria-describedby="unreg-text">
        <h3 id="unreg-title">{t("unreg_title")}</h3>
        <p id="unreg-text" className="to">{t("unreg_text")}</p>
        <div className="dialog-actions">
          <button className="btn btn-blue" onClick={onPause}>⏸ {t("unreg_pause_instead")}</button>
          <button className="btn btn-red" onClick={onUnregister}>{t("unreg_confirm")}</button>
          <button ref={cancelRef} className="btn btn-soft" onClick={onCancel}>{t("cancel")}</button>
        </div>
      </div>
    </div>
  );
}