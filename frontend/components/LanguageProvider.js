"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { translate } from "@/lib/i18n";

const STORAGE_KEY = "medfund-lang";
const listeners = new Set();

function readLang() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "en";
  } catch {
    return "en";
  }
}

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function saveLang(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // private browsing can block storage — the choice just won't be remembered
  }
  listeners.forEach((fn) => fn());
}

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  // The server always renders English; the saved language is applied right after the page loads
  const lang = useSyncExternalStore(subscribe, readLang, () => "en");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => translate(key, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang: saveLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}