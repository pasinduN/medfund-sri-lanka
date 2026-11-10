"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { useDonate } from "./DonateProvider";
import { formatRs, percentRaised, patientGradient } from "@/lib/format";

export default function PatientCard({ patient: p }) {
  const router = useRouter();
  const { openDonate } = useDonate();

  let tag = `${p.days} days left`;
  if (p.closed) tag = "✓ Completed";
  else if (p.urgent) tag = `⚡ Urgent · ${p.days} days left`;

  return (
    <article className="pcard" onClick={() => router.push(`/patients/${p.id}`)}>
      <div className="photo" style={{ background: patientGradient(p.id) }}>
        {p.init}
        <span className={`tag ${p.urgent ? "urgent" : ""}`}>{tag}</span>
      </div>
      <div className="pbody">
        <div className="pname">
          {p.name} <span className="vbadge">✓ Verified</span>
        </div>
        <div className="pmeta">
          <b>{p.disease}</b> · {p.hospital}
        </div>
        <ProgressBar percent={percentRaised(p)} />
        <div className="amts">
          <span><b>{formatRs(p.got)}</b> raised</span>
          <span>of {formatRs(p.need)}</span>
        </div>

        {p.closed ? (
          <Link className="btn btn-ghost" href={`/patients/${p.id}`} onClick={(e) => e.stopPropagation()}>
            View story
          </Link>
        ) : (
          <button
            className="btn btn-green"
            onClick={(e) => {
              e.stopPropagation();
              openDonate(p);
            }}
          >
            Donate
          </button>
        )}
      </div>
    </article>
  );
}
