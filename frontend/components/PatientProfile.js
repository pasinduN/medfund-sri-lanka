"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import ProgressBar from "./ProgressBar";
import CloseRequestDialog from "./CloseRequestDialog";
import { getPatient } from "@/lib/api";
import { closeCampaign, raisedSoFar, useCampaignRecord } from "@/lib/campaignStore";
import { formatDate, todayISO } from "@/lib/dates";
import { formatRs } from "@/lib/format";
import { notify, notifyAdmins } from "@/lib/notificationStore";

const REVIEW_STEPS = ["step_submitted", "step_ai", "step_admin", "step_live"];

export default function PatientProfile({ user }) {
  const { lang, t } = useLanguage();
  const [record, save] = useCampaignRecord(user.id);
  const [patient, setPatient] = useState(null);
  const [asking, setAsking] = useState(false);

  const campaign = record?.campaign;
  const patientId = campaign?.patientId;

  useEffect(() => {
    if (patientId) getPatient(patientId).then(setPatient);
  }, [patientId]);

  const raised = patient && campaign ? raisedSoFar(patient, campaign) : 0;
  const goalReached = Boolean(patient && campaign && raised >= patient.need);

  // A fully funded campaign closes itself and moves to history — nobody has to press anything
  useEffect(() => {
    if (!goalReached) return;
    save(closeCampaign(record, patient, "goal"));
    notify(user.id, "goal_reached");
  }, [goalReached, record, patient, save, user.id]);

  const date = (iso) => formatDate(iso, lang);

  if (!record || (!record.campaign && !record.application && record.history.length === 0)) {
    return (
      <div className="panel empty-state">
        <span className="glyph">🏥</span>
        <h3>{t("no_campaign_h")}</h3>
        <p>{t("no_campaign_p")}</p>
        <Link className="btn btn-blue" href="/register-patient">{t("start_campaign")}</Link>
      </div>
    );
  }

  const sendRequest = ({ reason, note }) => {
    save({ ...record, campaign: { ...campaign, status: "close_requested", request: { reason, note, date: todayISO() } } });
    notify(user.id, "close_sent");
    notifyAdmins("close_request_admin", { name: user.name });
    setAsking(false);
  };
  const withdrawRequest = () => save({ ...record, campaign: { ...campaign, status: "live", request: undefined } });
  const simulateGoal = () => save({ ...record, campaign: { ...campaign, demoRaised: patient.need - patient.got } });

  const requested = campaign?.status === "close_requested";

  return (
    <>
      {record.application && (
        <div className="panel">
          <div className="hist-head">
            <h3>📝 {t("app_review_h")}</h3>
            <span className="status-pill paused">{t("status_review")}</span>
          </div>
          <p>
            <b>{record.application.disease}</b> · {record.application.hospital} · {formatRs(record.application.need)}
          </p>
          <p className="muted-sm">
            {t("tracking_no")}: <b>{record.application.reg}</b> · {t("submitted_on").replace("{date}", date(record.application.submitted))}
          </p>
          <ol className="steps">
            {REVIEW_STEPS.map((step, i) => (
              <li key={step} className={i === 0 ? "done" : i === 1 ? "now" : ""}>{t(step)}</li>
            ))}
          </ol>
        </div>
      )}

      {campaign && patient && !goalReached && (
        <div className="panel my-campaign">
          <div className="hist-head">
            <div>
              <h3>🏥 {t("my_campaign")}</h3>
              <p className="muted-sm">{patient.disease} · {patient.hospital} · {patient.reg}</p>
            </div>
            <span className={`status-pill ${requested ? "paused" : ""}`}>
              {t(requested ? "status_close_requested" : "status_live")}
            </span>
          </div>

          <div className="mc-amounts">
            <b>{formatRs(raised)}</b>
            <span>{t("of_goal").replace("{goal}", formatRs(patient.need))}</span>
          </div>
          <ProgressBar percent={Math.min(100, (raised / patient.need) * 100)} />
          <p className="muted-sm" style={{ marginTop: 8 }}>
            {Math.round((raised / patient.need) * 100)}% · {t("days_left").replace("{n}", patient.days)}
          </p>

          {requested && (
            <div className="form-info" style={{ marginTop: 14 }}>
              {t("close_sent").replace("{date}", date(campaign.request.date))} ({t(campaign.request.reason)}). {t("close_sent_next")}
            </div>
          )}

          <div className="dc-actions">
            <Link className="btn btn-blue" href={`/patients/${patient.id}`}>{t("view_public")}</Link>
            {requested ? (
              <button className="btn btn-soft" onClick={withdrawRequest}>{t("close_withdraw")}</button>
            ) : (
              <button className="btn btn-line-red" onClick={() => setAsking(true)}>{t("close_request")}</button>
            )}
          </div>
          <p className="muted-sm" style={{ marginTop: 12 }}>ℹ️ {t("auto_close_note")}</p>

          <div className="demo-box">
            <p><b>🧪 {t("demo_title")}</b>: {t("demo_goal_hint")}</p>
            <button className="btn btn-soft" onClick={simulateGoal}>{t("demo_goal_btn")}</button>
          </div>
        </div>
      )}

      {!campaign && !record.application && (
        <div className="panel empty-state">
          <h3>{t("no_live_h")}</h3>
          <p>{t("no_live_p")}</p>
          <Link className="btn btn-blue" href="/register-patient">{t("start_campaign")}</Link>
        </div>
      )}

      {record.history.length > 0 && (
        <div className="panel">
          <h3>📁 {t("past_campaigns")}</h3>
          <ul className="hist">
            {record.history.map((h) => (
              <li key={h.reg}>
                <span className="hico organ">{h.reason === "goal" ? "🎉" : "📁"}</span>
                <div>
                  <b>{h.title}</b>
                  <small>
                    {h.hospital} · {formatRs(h.got)} / {formatRs(h.need)} · {t("closed_on").replace("{date}", date(h.closedOn))}
                  </small>
                </div>
                <span className="status-pill">{t(h.reason === "goal" ? "closed_goal" : "closed_request")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {asking && <CloseRequestDialog onSend={sendRequest} onCancel={() => setAsking(false)} />}
    </>
  );
}