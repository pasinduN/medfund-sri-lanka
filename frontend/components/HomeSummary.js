"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { getPatient } from "@/lib/api";
import { bloodEligibility, rewardStatus, useDonorRecord } from "@/lib/donorStore";
import { raisedSoFar, useCampaignRecord } from "@/lib/campaignStore";
import { useNotifications } from "@/lib/notificationStore";
import { formatDate } from "@/lib/dates";

// A short "what's new for me" bar above the hero, only for logged-in visitors — the hero itself never changes
export default function HomeSummary() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [donor] = useDonorRecord(user?.id);
  const [campaignRecord] = useCampaignRecord(user?.id);
  const { unread } = useNotifications(user?.id);
  const [patient, setPatient] = useState(null);

  const campaign = campaignRecord?.campaign;
  const patientId = campaign?.patientId;

  useEffect(() => {
    if (patientId) getPatient(patientId).then(setPatient);
  }, [patientId]);

  if (!user) return null;

  const chips = [];
  let action = { href: "/profile", key: "my_profile" };

  if (user.role === "admin") action = { href: "/admin", key: "admin_review" };

  if (user.role === "patient") {
    if (campaign && patient) {
      const pct = Math.min(100, Math.round((raisedSoFar(patient, campaign) / patient.need) * 100));
      chips.push({ icon: "🏥", text: t("sum_raised").replace("{pct}", pct) });
      if (campaign.status === "close_requested") chips.push({ icon: "📨", text: t("status_close_requested") });
      action = { href: "/profile", key: "my_campaign" };
    } else if (campaignRecord?.application) {
      chips.push({ icon: "📝", text: t("status_review") });
    } else {
      action = { href: "/register-patient", key: "start_campaign" };
    }
  }

  if (donor && donor.status !== "unregistered" && donor.status !== "removed") {
    const blood = bloodEligibility(donor);
    chips.push(
      blood.canDonate
        ? { icon: "🩸", text: t("can_donate_now") }
        : { icon: "⏳", text: t("sum_next_blood").replace("{date}", formatDate(blood.nextDate, lang)) }
    );
    const { tier } = rewardStatus(donor);
    if (tier) chips.push({ icon: tier.icon, text: t("sum_badge").replace("{tier}", t(tier.key)) });
    if (donor.status === "paused") chips.push({ icon: "⏸", text: t("status_paused") });
  } else if (user.role === "donor" && !donor) {
    action = { href: "/register-donor", key: "nav_regdonor" };
  }

  if (unread > 0) chips.push({ icon: "🔔", text: t("sum_unread").replace("{n}", unread), href: "/notifications" });

  return (
    <div className="summary">
      <div className="wrap">
        <div className="sum-bar">
          <b className="sum-hi">{t("hi_name").replace("{name}", user.name.split(" ")[0])}</b>
          <div className="sum-chips">
            {chips.map((c) =>
              c.href ? (
                <Link key={c.text} href={c.href} className="sum-chip link">{c.icon} {c.text}</Link>
              ) : (
                <span key={c.text} className="sum-chip">{c.icon} {c.text}</span>
              )
            )}
          </div>
          <Link className="btn btn-blue sum-btn" href={action.href}>{t(action.key)} →</Link>
        </div>
      </div>
    </div>
  );
}