"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

const FILTERS = [
  { key: "all", label: "f_all" },
  { key: "blood", label: "f_blood" },
  { key: "organ", label: "f_organ" },
  { key: "urgent", label: "f_urgent_resp" },
  { key: "available", label: "f_available" },
];

function matchesFilter(d, filter) {
  if (filter === "blood") return d.type === "Blood";
  if (filter === "organ") return d.type === "Organ pledge";
  if (filter === "urgent") return d.urgent;
  if (filter === "available") return d.available;
  return true;
}

function ContactButton() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  return (
    <button
      className="btn btn-blue"
      style={{ padding: "9px 16px", fontSize: ".85rem" }}
      disabled={sent}
      onClick={() => {
        setSent(true);
        setTimeout(() => setSent(false), 2600);
      }}
    >
      {sent ? t("contact_sent") : t("req_contact")}
    </button>
  );
}

export default function DonorDirectory({ donors }) {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filter, setFilter] = useState(searchParams.get("filter") ?? "all");

  const q = query.toLowerCase();
  const results = donors
    .filter((d) => `${d.name} ${d.district} ${d.group} ${d.organ ?? ""}`.toLowerCase().includes(q))
    .filter((d) => matchesFilter(d, filter));

  return (
    <>
      <div className="list-tools">
        <div className="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C7885" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("dsearch_ph")}
          />
        </div>
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f.key} className={`chip ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
              {t(f.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="plist">
        {results.length === 0 && (
          <div className="empty">
            {t("no_donors")}
            <br />
            {t("no_donors_hint")}
          </div>
        )}

        {results.map((d) => {
          const isOrgan = d.type === "Organ pledge";
          return (
            <div className={`drow ${isOrgan ? "organ" : ""}`} key={d.id}>
              <div className="bg">{isOrgan ? "🫀" : d.group}</div>
              <div className="mid">
                <div className="pname">
                  {d.name} <span className="vbadge">{t("verified")}</span>
                  {d.urgent ? (
                    <span className="vbadge" style={{ background: "#FFF1E0", color: "#B8860B" }}>{t("urg_resp")}</span>
                  ) : (
                    <span className="vbadge" style={{ background: "var(--mist)", color: "var(--muted)" }}>{t("nonurg")}</span>
                  )}
                </div>
                <div className="pmeta">
                  {isOrgan ? <>{t("f_organ")} · <b>{d.organ}</b> · {d.group}</> : <>{t("blood_donor_lbl")} · <b>{d.group}</b></>}
                  {" "}· 📍 {d.district}
                </div>
              </div>
              <span className={`avail ${d.available ? "" : "off"}`}>{d.available ? t("avail") : t("cooldown")}</span>
              <ContactButton />
            </div>
          );
        })}
      </div>
    </>
  );
}