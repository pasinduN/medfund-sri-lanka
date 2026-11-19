"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { useDonate } from "./DonateProvider";
import { formatRs, percentRaised } from "@/lib/format";
import { useHolds } from "@/lib/moderationStore";
import { useLanguage } from "./LanguageProvider";

export default function DonateBox({ patient: p }) {
  const { openDonate } = useDonate();
  const [copied, setCopied] = useState(false);
  const pct = percentRaised(p);
  const { t } = useLanguage();
  const hold = useHolds()[p.id];

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard can be blocked (e.g. http on mobile) — still show the message
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  if (p.closed) {
    return (
      <div className="donate-box">
        <div className="closed-banner">🎉 {t("goal_closed_auto")}</div>
        <div style={{ marginTop: 16 }}>
          <ProgressBar percent={100} />
          <div className="mini-stats" style={{ marginTop: 8 }}>
            <span><b>{formatRs(p.got)}</b> {t("raised")}{p.donors && <> · {t("donors_n").replace("{n}", p.donors)}</>}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-box">
      {p.urgent && <span className="days">⏳ {t("days_left").replace("{n}", p.days)}</span>}
      <div className="big-amt">
        {formatRs(p.got)} <span>{t("of_goal").replace("{goal}", formatRs(p.need))}</span>
      </div>
      <ProgressBar percent={pct} />
      <div className="mini-stats">
        <span><b>{Math.round(pct)}%</b> {t("funded")}</span>
        <span><b>{formatRs(p.need - p.got)}</b> {t("to_go")}</span>
      </div>
      {hold && (
        <div className={`hold-banner ${hold.status}`}>
          <b>{hold.status === "closed" ? "⛔" : "⏸"} {t(hold.status === "closed" ? "hold_closed_h" : "hold_paused_h")}</b>
          <span>{t(hold.reason)}</span>
        </div>
      )}
      <button className="btn btn-green btn-big" onClick={() => openDonate(p)} disabled={Boolean(hold)}>
        {t("donate_to").replace("{name}", p.name.split(" ")[0])}
      </button>
      <button
        className="btn btn-ghost"
        style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
        onClick={share}
        disabled={copied}
      >
        {copied ? t("link_copied") : `🔗 ${t("share_campaign")}`}
      </button>
      <div className="safe">
        🔒 <span>{t("pay_safe")}</span>
      </div>
    </div>
  );
}