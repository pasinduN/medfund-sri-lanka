"use client";

import { useLanguage } from "./LanguageProvider";

// Lets server components show translated text: <T k="all_patients" />
// vars fills {blanks}: <T k="donate_to" vars={{ name: "Nimal" }} />
export default function T({ k, html = false, vars }) {
  const { t } = useLanguage();

  if (html) {
    // only used for our own dictionary strings, never for user input
    return <span dangerouslySetInnerHTML={{ __html: t(k) }} />;
  }

  let text = t(k);
  if (vars) {
    for (const [key, value] of Object.entries(vars)) text = text.replaceAll(`{${key}}`, value);
  }
  return text;
}