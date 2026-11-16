// Dates are saved as "YYYY-MM-DD" and read in local time, so a date never shifts by one day

export function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export const todayISO = () => toISO(new Date());

export function addDays(iso, days) {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export const daysBetween = (fromIso, toIso) => Math.round((parseDate(toIso) - parseDate(fromIso)) / 86400000);

const LOCALES = { en: "en-GB", si: "si-LK", ta: "ta-LK" };

export function formatDate(iso, lang = "en") {
  return parseDate(iso).toLocaleDateString(LOCALES[lang] ?? "en-GB", { day: "numeric", month: "short", year: "numeric" });
}