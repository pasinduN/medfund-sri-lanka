import { useMemo, useSyncExternalStore } from "react";
import { todayISO } from "./dates";

// Demo mode: campaigns whose donations are on hold, saved in localStorage.
// Shape: { [patientId]: { status: "paused" | "closed", reason: "<i18n key>", date } }
// TODO: this becomes a status column on the campaigns table, and the donations API must refuse held campaigns

const KEY = "medfund-moderation";
const listeners = new Set();

function readRaw() {
  try {
    return localStorage.getItem(KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function saveAll(holds) {
  try {
    localStorage.setItem(KEY, JSON.stringify(holds));
  } catch {
    // storage blocked — the hold is lost on refresh
  }
  listeners.forEach((fn) => fn());
}

export function setHold(patientId, status, reason) {
  saveAll({ ...JSON.parse(readRaw()), [patientId]: { status, reason, date: todayISO() } });
}

export function clearHold(patientId) {
  const holds = JSON.parse(readRaw());
  delete holds[patientId];
  saveAll(holds);
}

// returns the whole map, so a list page can check every patient with one hook
export function useHolds() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}");
  return useMemo(() => JSON.parse(raw), [raw]);
}