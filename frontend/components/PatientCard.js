"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { useDonate } from "./DonateProvider";
import { useLanguage } from "./LanguageProvider";
import { formatRs, percentRaised, patientGradient } from "@/lib/format";

export default function PatientCard({ patient: p }) {
  const router = useRouter();
  const { openDonate } = useDonate();
  const { t } = useLanguage();

  let tag = t("days_left").replace("{n}", p.days);
  if (p.closed) tag = `✓ ${t("completed")}`;
  else if (p.urgent) tag = `⚡ ${t("urgent")} · ${tag}`;

  return (
    <article className="pcard" onClick={() => router.push(`/patients/${p.id}`)}>
      <div className="photo" style={{ background: patientGradient(p.id) }}>
        {p.init}
        <span className={`tag ${p.urgent ? "urgent" : ""}`}>{tag}</span>
      </div>
      <div className="pbody">
        <div className="pname">
          {p.name} <span className="vbadge">{t("verified")}</span>
        </div>
        <div className="pmeta">
          <b>{p.disease}</b> · {p.hospital}
        </div>
        <ProgressBar percent={percentRaised(p)} />
        <div className="amts">
          <span><b>{formatRs(p.got)}</b> {t("raised")}</span>
          <span>{t("of_")} {formatRs(p.need)}</span>
        </div>

        {p.closed ? (
          <Link className="btn btn-ghost" href={`/patients/${p.id}`} onClick={(e) => e.stopPropagation()}>
            {t("view_story")}
          </Link>
        ) : (
          <button
            className="btn btn-green"
            onClick={(e) => {
              e.stopPropagation();
              openDonate(p);
            }}
          >
            {t("donate")}
          </button>
        )}
      </div>
    </article>
  );
}