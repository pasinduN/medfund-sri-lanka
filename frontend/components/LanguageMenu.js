"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";

const OPTIONS = [
  { code: "en", short: "EN", label: "English" },
  { code: "si", short: "සිං", label: "සිංහල" },
  { code: "ta", short: "தமிழ்", label: "தமிழ்" },
];

export default function LanguageMenu() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const current = OPTIONS.find((o) => o.code === lang) ?? OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="langmenu" ref={boxRef}>
      <button
        className="langbtn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        onClick={() => setOpen((v) => !v)}
      >
        🌐 {current.short} <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="langlist" role="listbox">
          {OPTIONS.map((o) => (
            <li key={o.code}>
              <button
                role="option"
                aria-selected={o.code === lang}
                className={o.code === lang ? "on" : ""}
                onClick={() => {
                  setLang(o.code);
                  setOpen(false);
                }}
              >
                {o.label} {o.code === lang && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}