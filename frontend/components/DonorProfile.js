"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import LogDonationForm from "./LogDonationForm";
import UnregisterDialog from "./UnregisterDialog";
import { bloodEligibility, rewardStatus, useDonorRecord } from "@/lib/donorStore";
import { DONOR_SETTINGS, REWARD_TIERS } from "@/lib/settings";
import { addDays, formatDate } from "@/lib/dates";
import { notify } from "@/lib/notificationStore";

const HISTORY_ICONS = { blood: "🩸", organ: "🫀", pledge: "📜" };

export default function DonorProfile({ user, hideWhenEmpty = false }) {
  const { lang, t } = useLanguage();
  const [record, save] = useDonorRecord(user.id);
  const [logging, setLogging] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!record) {
    if (hideWhenEmpty) return null;
    return (
      <div className="panel empty-state">
        <span className="glyph">🩸</span>
        <h3>{t("not_donor_h")}</h3>
        <p>{t("not_donor_p")}</p>
        <Link className="btn btn-green" href="/register-donor">{t("nav_regdonor")}</Link>
      </div>
    );
  }

  const date = (iso) => formatDate(iso, lang);
  const setStatus = (status) => save({ ...record, status });
  const registered = record.status !== "unregistered";
  const blood = bloodEligibility(record);
  const reward = rewardStatus(record);

  const history = [
    ...record.donations.map((d) => ({ ...d, kind: d.type })),
    ...record.pledges.map((p) => ({ id: `pledge-${p.organ}`, kind: "pledge", date: p.date, organ: p.organ })),
  ].sort((a, b) => b.date.localeCompare(a.date));

    const saveDonation = (next) => {
    save(next);
    setLogging(false);

    const after = bloodEligibility(next);
    const justGaveBlood = next.donations.at(-1).type === "blood" && !after.canDonate;
    if (justGaveBlood) notify(user.id, "donation_logged_blood", { next: after.nextDate });
    else notify(user.id, "donation_logged");

    const newTier = rewardStatus(next).tier;
    if (newTier && newTier.key !== reward.tier?.key) notify(user.id, "reward_tier", { tier: newTier.key });
  };

  const historyTitle = (h) => {
    if (h.kind === "blood") return t("hist_blood");
    return t(h.kind === "organ" ? "hist_organ" : "hist_pledge").replace("{organ}", h.organ);
  };

  return (
    <div className="profile-grid">
      {registered ? (
        <div className="panel donor-card">
          <div className="dc-top">
            <span className="bgroup">{record.bloodGroup || "?"}</span>
            <div>
              <h3>{t("donor_card")}</h3>
              <p>📍 {record.district || "—"}{record.urgent && <> · {t("urg_resp")}</>}</p>
            </div>
            <span className={`status-pill ${record.status}`}>{t(`status_${record.status}`)}</span>
          </div>

          {record.pledges.length > 0 && (
            <p className="pledges">🫀 {t("pledged")}: {record.pledges.map((p) => p.organ).join(", ")}</p>
          )}
          {record.status === "paused" && <div className="form-info">{t("paused_note")}</div>}

          <div className="dc-actions">
            {record.status === "paused" ? (
              <button className="btn btn-blue" onClick={() => setStatus("active")}>▶ {t("resume")}</button>
            ) : (
              <button className="btn btn-soft" onClick={() => setStatus("paused")}>⏸ {t("pause")}</button>
            )}
            <button className="btn btn-line-red" onClick={() => setConfirming(true)}>{t("unregister")}</button>
          </div>
        </div>
      ) : (
        <div className="panel empty-state">
          <h3>{t("unregistered_h")}</h3>
          <p>{t("unregistered_p")}</p>
          <button className="btn btn-green" onClick={() => setStatus("active")}>{t("register_again")}</button>
        </div>
      )}

      <div className={`panel eligibility ${blood.canDonate ? "ok" : "wait"}`}>
        <h3>🩸 {t("next_blood")}</h3>
        {blood.canDonate ? (
          <p className="big">✅ {t("can_donate_now")}</p>
        ) : (
          <>
            <p className="big">⏳ {t("can_donate_on").replace("{date}", date(blood.nextDate))}</p>
            <p>{t("days_to_wait").replace("{n}", blood.daysLeft)}</p>
            <div className="wait-bar">
              <i style={{ width: `${100 - (blood.daysLeft / DONOR_SETTINGS.bloodWaitDays) * 100}%` }} />
            </div>
          </>
        )}
        <p className="muted-sm">
          {blood.last && <>{t("last_blood").replace("{date}", date(blood.last))} · </>}
          {t("wait_rule").replace("{n}", DONOR_SETTINGS.bloodWaitDays)}
        </p>
      </div>

      <div className="panel rewards">
        <h3>🏅 {t("rewards")}</h3>
        <p className="muted-sm">
          {t("reward_period").replace("{from}", date(reward.start)).replace("{to}", date(addDays(reward.renews, -1)))}
        </p>
        <div className="tiers">
          {REWARD_TIERS.map((tier) => (
            <div key={tier.key} className={`tier ${reward.count >= tier.min ? "got" : ""}`}>
              <span>{tier.icon}</span>
              <b>{t(tier.key)}</b>
              <small>{t("tier_need").replace("{n}", tier.min)}</small>
            </div>
          ))}
        </div>
        <p>
          {t("reward_count").replace("{n}", reward.count)}{" "}
          {reward.next
            ? t("reward_next").replace("{n}", reward.next.min - reward.count).replace("{tier}", t(reward.next.key))
            : t("reward_top")}
        </p>
        <p className="muted-sm">🔄 {t("reward_renews").replace("{date}", date(reward.renews))}</p>
      </div>

      <div className="panel history">
        <div className="hist-head">
          <h3>📋 {t("donation_history")}</h3>
          {registered && !logging && (
            <button className="btn btn-blue" onClick={() => setLogging(true)}>＋ {t("log_donation")}</button>
          )}
        </div>

        {logging && (
          <LogDonationForm
            record={record}
            onSave={saveDonation}
            onCancel={() => setLogging(false)}
          />
        )}

        {history.length === 0 ? (
          <p className="muted-sm">{t("no_history")}</p>
        ) : (
          <ul className="hist">
            {history.map((h) => (
              <li key={h.id}>
                <span className={`hico ${h.kind}`}>{HISTORY_ICONS[h.kind]}</span>
                <div>
                  <b>{historyTitle(h)}</b>
                  <small>{date(h.date)}{h.place && ` · ${h.place}`}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirming && (
        <UnregisterDialog
          onPause={() => {
            setStatus("paused");
            setConfirming(false);
          }}
          onUnregister={() => {
            setStatus("unregistered");
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}