"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { formatDate, timeAgo } from "@/lib/dates";
import { formatRs } from "@/lib/format";

const ICONS = {
  blood_request: "🩸",
  reward_tier: "🏅",
  donation_logged: "✅",
  donation_logged_blood: "✅",
  donation_received: "💚",
  milestone: "📈",
  campaign_live: "✅",
  close_sent: "📨",
  goal_reached: "🎉",
  admin_paused: "⏸",
  admin_resumed: "▶",
  admin_closed: "⛔",
  new_application: "📝",
  close_request_admin: "📨",
  welcome: "👋",
  close_approved: "📁",
  close_rejected: "▶",
  new_donor: "🩸",
  donor_verified: "✅",
  donor_rejected: "✕",
  donor_suspended: "⏸",
  donor_restored: "▶",
  donor_removed: "⛔",
};

export default function NotificationList({ items, onOpen, limit }) {
  const { lang, t } = useLanguage();

  // fills {name}, {amount}… — dates and money are formatted, other words are translated if they are i18n keys
  const sentence = (n) =>
    Object.entries(n.params).reduce((text, [key, value]) => {
      let shown = value;
      if (key === "amount") shown = formatRs(value);
      else if (key === "next") shown = formatDate(value, lang);
      else if (typeof value === "string") shown = t(value);
      return text.replaceAll(`{${key}}`, shown);
    }, t(`note_${n.type}`));

  if (items.length === 0) return <p className="notes-empty">🎉 {t("notes_empty")}</p>;

  return (
    <ul className="notes">
      {items.slice(0, limit).map((n) => (
        <li key={n.id}>
          <Link href={n.href} className={n.read ? "" : "unread"} onClick={() => onOpen(n)}>
            <span className="note-ico" aria-hidden="true">{ICONS[n.type] ?? "🔔"}</span>
            <span className="note-tx">
              {sentence(n)}
              <small>{timeAgo(n.date, lang)}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}