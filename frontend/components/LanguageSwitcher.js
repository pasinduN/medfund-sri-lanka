"use client";

import { useLanguage } from "./LanguageProvider";
import { LANGUAGES } from "@/lib/i18n";

export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`langs ${className}`} role="group" aria-label="Language">
      {LANGUAGES.map((l) => (
        <button key={l.code} className={lang === l.code ? "on" : ""} onClick={() => setLang(l.code)}>
          {l.label}
        </button>
      ))}
    </div>
  );
}