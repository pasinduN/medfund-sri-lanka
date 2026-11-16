"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { SESSION_KEY } from "@/lib/demoAuth";

const listeners = new Set();

function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

// the "storage" event fires when another tab logs in or out, so every tab stays in sync
function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function saveSession(user) {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // storage blocked — nothing we can do in demo mode
  }
  listeners.forEach((fn) => fn());
}

const AuthContext = createContext({ user: null, logIn: () => {}, logOut: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // keep the raw string from storage: parsing on every read would give React a "new" user each time
  const raw = useSyncExternalStore(subscribe, readSession, () => null);

  const user = useMemo(() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [raw]);

  const value = useMemo(() => ({ user, logIn: saveSession, logOut: () => saveSession(null) }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}