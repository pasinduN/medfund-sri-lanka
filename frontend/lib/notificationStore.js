import { useCallback, useMemo, useSyncExternalStore } from "react";
import { DEMO_ACCOUNTS } from "./demoAuth";

// Demo mode: each user's notifications are saved in localStorage.
// TODO: GET /api/notifications — later urgent blood requests can also go out by SMS

const storageKey = (userId) => `medfund-notes-${userId}`;
const listeners = new Set();

// Only the type and its values are saved. The sentence comes from i18n (note_<type>),
// so old notifications switch language together with the rest of the site.
const SEEDS = {
  u1: [
    { id: "s1", type: "blood_request", params: { group: "O−", hospital: "National Hospital, Colombo" }, href: "/donors", date: "2026-11-15T21:40:00", read: false },
    { id: "s2", type: "reward_tier", params: { tier: "tier_gold" }, href: "/profile", date: "2026-09-21T09:10:00", read: true },
  ],
  u2: [
    { id: "s1", type: "donation_received", params: { name: "Anonymous", amount: 25000 }, href: "/profile", date: "2026-11-16T10:05:00", read: false },
    { id: "s2", type: "milestone", params: { pct: 75 }, href: "/profile", date: "2026-11-14T18:30:00", read: false },
    { id: "s3", type: "campaign_live", params: {}, href: "/patients/1", date: "2026-10-04T08:00:00", read: true },
  ],
  u3: [
    { id: "s1", type: "new_application", params: { name: "Saman Kumara" }, href: "/admin", date: "2026-11-16T11:20:00", read: false },
  ],
};

function readRaw(userId) {
  try {
    const saved = localStorage.getItem(storageKey(userId));
    if (saved) return saved;
  } catch {
    // fall through to the seed
  }
  return JSON.stringify(SEEDS[userId] ?? []);
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function saveList(userId, list) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(list));
  } catch {
    // storage blocked — notifications are lost on refresh
  }
  listeners.forEach((fn) => fn());
}

export function notify(userId, type, params = {}, href = "/profile") {
  if (!userId) return;
  const note = {
    id: `n${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    type,
    params,
    href,
    date: new Date().toISOString(),
    read: false,
  };
  // keep the newest 50 so storage doesn't grow forever
  saveList(userId, [note, ...JSON.parse(readRaw(userId))].slice(0, 50));
}

export function notifyAdmins(type, params = {}, href = "/admin") {
  DEMO_ACCOUNTS.filter((a) => a.role === "admin").forEach((a) => notify(a.id, type, params, href));
}

export function useNotifications(userId) {
  const raw = useSyncExternalStore(subscribe, () => (userId ? readRaw(userId) : null), () => null);
  const items = useMemo(() => (raw ? JSON.parse(raw) : []), [raw]);
  const unread = items.filter((n) => !n.read).length;

  const markRead = useCallback(
    (id) => saveList(userId, items.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [userId, items]
  );
  const markAllRead = useCallback(() => saveList(userId, items.map((n) => ({ ...n, read: true }))), [userId, items]);

  return { items, unread, markRead, markAllRead };
}