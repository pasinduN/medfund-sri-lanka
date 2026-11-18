import { useCallback, useMemo, useSyncExternalStore } from "react";
import { todayISO } from "./dates";

// Demo mode: what a user's campaigns look like is saved in localStorage.
// TODO: GET /api/campaigns/mine and POST /api/campaigns/{id}/close-request once the backend is ready

const storageKey = (userId) => `medfund-campaign-${userId}`;
const listeners = new Set();

// Nimal (demo patient) runs campaign #1 from the sample data and has one finished campaign
const SEEDS = {
  u2: {
    application: null,
    campaign: { patientId: 1, status: "live" },
    history: [
      {
        reg: "MED-2025-000087",
        title: "Dialysis treatment (6 months)",
        hospital: "National Hospital, Colombo",
        need: 600000,
        got: 600000,
        closedOn: "2025-11-02",
        reason: "goal",
      },
    ],
  },
};

export const emptyCampaignRecord = () => ({ application: null, campaign: null, history: [] });

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

export function saveRecord(userId, record) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(record));
  } catch {
    // storage blocked — the change is lost on refresh
  }
  listeners.forEach((fn) => fn());
}

export function readCampaignRecord(userId) {
  const raw = readRaw(userId);
  return raw ? JSON.parse(raw) : null;
}

export function useCampaignRecord(userId) {
  const raw = useSyncExternalStore(subscribe, () => readRaw(userId), () => null);
  const record = useMemo(() => (raw ? JSON.parse(raw) : null), [raw]);
  const save = useCallback((next) => userId && saveRecord(userId, next), [userId]);
  return [record, save];
}

// demoRaised lets the demo button push a campaign to its goal; the real total will come from the API
export const raisedSoFar = (patient, campaign) => patient.got + (campaign.demoRaised ?? 0);

// Moves the current campaign into history — used for both "goal reached" and an approved close request
export function closeCampaign(record, patient, reason) {
  const { campaign } = record;
  return {
    ...record,
    campaign: null,
    history: [
      {
        reg: patient.reg,
        title: patient.disease,
        hospital: patient.hospital,
        need: patient.need,
        got: Math.min(raisedSoFar(patient, campaign), patient.need),
        closedOn: todayISO(),
        reason,
      },
      ...record.history,
    ],
  };
}