"use client";

import { useLanguage } from "./LanguageProvider";

// Lets server components show translated text: <T k="all_patients" />
export default function T({ k, html = false }) {
  const { t } = useLanguage();

  if (html) {
    // only used for our own dictionary strings, never for user input
    return <span dangerouslySetInnerHTML={{ __html: t(k) }} />;
  }
  return t(k);
}