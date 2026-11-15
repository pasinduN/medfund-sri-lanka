"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { THEME_KEY } from "@/lib/theme";

const listeners = new Set();

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || systemTheme();
  } catch {
    return systemTheme();
  }
}

function subscribe(callback) {
  listeners.add(callback);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => {
    listeners.delete(callback);
    media.removeEventListener("change", callback);
  };
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage can be blocked — the theme still changes for this visit
  }
  listeners.forEach((fn) => fn());
}

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => saveTheme(theme === "dark" ? "light" : "dark");

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}