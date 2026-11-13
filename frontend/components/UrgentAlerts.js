"use client";

import Link from "next/link";
import { useDonate } from "./DonateProvider";
import { useLanguage } from "./LanguageProvider";

function Alert({ item, type, patients }) {
  const { openDonate } = useDonate();
  const { t } = useLanguage();
  const isNeed = type === "need";
  const buttonClass = isNeed ? "btn-blue" : "btn-green";

  return (
    <div className={`alert ${type}`}>
      <span className="pill">{t(isNeed ? "pill_need" : "pill_give")}</span>
      <span>
        {item.icon} <b>{item.title}</b> {item.text}
      </span>
      <span className="when" style={isNeed ? undefined : { color: "var(--green)" }}>⏱ {item.when}</span>
      {item.donateId ? (
        <button className={`btn ${buttonClass}`} onClick={() => openDonate(patients.find((p) => p.id === item.donateId))}>
          {item.button}
        </button>
      ) : (
        <Link className={`btn ${buttonClass}`} href={item.href}>
          {item.button}
        </Link>
      )}
    </div>
  );
}

export default function UrgentAlerts({ needs, donors, patients }) {
  return (
    <div className="alerts">
      {needs.map((item) => <Alert key={item.title} item={item} type="need" patients={patients} />)}
      {donors.map((item) => <Alert key={item.title} item={item} type="give" patients={patients} />)}
    </div>
  );
}