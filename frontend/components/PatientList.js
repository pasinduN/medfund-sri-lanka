"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { colors, formatRs, percentRaised } from "@/lib/format";
import { useLanguage } from "./LanguageProvider";
import { useHolds } from "@/lib/moderationStore";

// "word" is matched against the disease name, so it stays in English even when the label is translated
const FILTERS = [
  { key: "all", label: "f_all" },
  { key: "urgent", label: "urgent" },
  { key: "kidney", label: "f_kidney", word: "kidney" },
  { key: "cancer", label: "f_cancer", word: "cancer" },
  { key: "heart", label: "f_heart", word: "heart" },
  { key: "surgery", label: "f_surgery", word: "surgery" },
  { key: "completed", label: "completed" },
];

function matchesFilter(p, filter) {
  if (filter.key === "all") return true;
  if (filter.key === "urgent") return p.urgent && !p.closed;
  if (filter.key === "completed") return p.closed;
  return p.disease.toLowerCase().includes(filter.word);
}
export default function PatientList({ patients }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(FILTERS[0]);
  const holds = useHolds();

  const q = query.toLowerCase();
  const results = patients
    .filter((p) => `${p.name} ${p.disease} ${p.hospital}`.toLowerCase().includes(q))
    .filter((p) => matchesFilter(p, filter));

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
            placeholder={t("search_ph")}
          />
        </div>
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f.key} className={`chip ${filter.key === f.key ? "on" : ""}`} onClick={() => setFilter(f)}>
              {t(f.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="plist">
        {results.length === 0 && (
          <div className="empty">
            {t("no_patients")}
            <br />
            {t("no_patients_hint")}
          </div>
        )}

        {results.map((p) => (
          <div className="prow" key={p.id} onClick={() => router.push(`/patients/${p.id}`)}>
            <div className="av" style={{ background: colors[p.id % colors.length] }}>{p.init}</div>
            <div className="mid">
              <div className="pname">
                {p.name} <span className="vbadge">✓</span>
                {p.urgent && !p.closed && (
                  <span className="vbadge" style={{ background: "var(--urgent-soft)", color: "var(--urgent)" }}>⚡ {t("urgent")}</span>
                )}
                {p.closed && <span className="vbadge">{t("completed")}</span>}
                {holds[p.id] && !p.closed && <span className="vbadge hold-badge">⏸ {t("paused_tag")}</span>}
              </div>
              <div className="pmeta">{p.disease} · {p.hospital}</div>
              <ProgressBar percent={percentRaised(p)} cells={20} />
            </div>
            <div className="rowamt">
              <b>{formatRs(p.got)}</b>{t("of_")} {formatRs(p.need)}
            </div>
            <span className="chev">›</span>
          </div>
        ))}
      </div>
    </>
  );
}