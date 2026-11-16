import { useCallback, useMemo, useSyncExternalStore } from "react";
import { addDays, daysBetween, parseDate, toISO, todayISO } from "./dates";
import { DONOR_SETTINGS, REWARD_TIERS } from "./settings";

// Demo mode: each user's donor card is saved in localStorage.
// TODO: GET / PUT /api/donors/me once the backend is ready

const storageKey = (userId) => `medfund-donor-${userId}`;
const listeners = new Set();

// Kamal (demo donor) starts with some history so the profile has something to show
const SEEDS = {
  u1: {
    status: "active",
    bloodGroup: "O−",
    district: "Colombo",
    urgent: true,
    pledges: [{ organ: "Eyes (cornea)", date: "2025-08-14" }],
    donations: [
      { id: "d1", type: "blood", date: "2026-09-20", place: "National Blood Centre, Narahenpita" },
      { id: "d2", type: "blood", date: "2026-05-11", place: "Colombo South Teaching Hospital" },
      { id: "d3", type: "blood", date: "2026-01-06", place: "Donation camp, Maharagama" },
      { id: "d4", type: "blood", date: "2025-08-30", place: "National Blood Centre, Narahenpita" },
    ],
  },
};

export const emptyDonor = () => ({ status: "active", bloodGroup: "", district: "", urgent: false, pledges: [], donations: [] });

function readRaw(userId) {
  if (!userId) return null;
  try {
    const saved = localStorage.getItem(storageKey(userId));
    if (saved) return saved;
  } catch {
    // fall through to the seed
  }
  return SEEDS[userId] ? JSON.stringify(SEEDS[userId]) : null;
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function saveDonor(userId, record) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(record));
  } catch {
    // storage blocked — the change is lost on refresh
  }
  listeners.forEach((fn) => fn());
}

export function useDonorRecord(userId) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(userId), () => null);
  const record = useMemo(() => (raw ? JSON.parse(raw) : null), [raw]);
  const save = useCallback((next) => userId && saveDonor(userId, next), [userId]);
  return [record, save];
}

// ---------- rules used by the profile page ----------

export function lastBloodDonation(record) {
  return (record?.donations ?? [])
    .filter((d) => d.type === "blood")
    .map((d) => d.date)
    .sort()
    .at(-1) ?? null;
}

export function bloodEligibility(record, today = todayISO()) {
  const last = lastBloodDonation(record);
  if (!last) return { canDonate: true, last: null };
  const nextDate = addDays(last, DONOR_SETTINGS.bloodWaitDays);
  const daysLeft = daysBetween(today, nextDate);
  return { canDonate: daysLeft <= 0, last, nextDate, daysLeft: Math.max(0, daysLeft) };
}

// Returns the blood donation that is too close to `date`, or null if the date is fine
export function clashingDonation(record, date) {
  return (record?.donations ?? []).find(
    (d) => d.type === "blood" && Math.abs(daysBetween(d.date, date)) < DONOR_SETTINGS.bloodWaitDays
  ) ?? null;
}

// Periods line up with the calendar: 12 months = Jan–Dec, 6 months = Jan–Jun / Jul–Dec
export function rewardPeriod(today = todayISO()) {
  const months = DONOR_SETTINGS.rewardPeriodMonths;
  const now = parseDate(today);
  const start = new Date(now.getFullYear(), Math.floor(now.getMonth() / months) * months, 1);
  const end = new Date(start.getFullYear(), start.getMonth() + months, 1);
  return { start: toISO(start), renews: toISO(end) };
}

export function rewardStatus(record, today = todayISO()) {
  const { start, renews } = rewardPeriod(today);
  const count = (record?.donations ?? []).filter((d) => d.date >= start && d.date < renews).length;
  const tier = [...REWARD_TIERS].reverse().find((t) => count >= t.min) ?? null;
  const next = REWARD_TIERS.find((t) => count < t.min) ?? null;
  return { start, renews, count, tier, next };
}