"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { colors, formatRs, percentRaised } from "@/lib/format";

const FILTERS = ["All", "Urgent", "Kidney", "Cancer", "Heart", "Surgery", "Completed"];

function matchesFilter(p, filter) {
  if (filter === "All") return true;
  if (filter === "Urgent") return p.urgent && !p.closed;
  if (filter === "Completed") return p.closed;
  return p.disease.toLowerCase().includes(filter.toLowerCase());
}

export default function PatientList({ patients }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

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
            placeholder="Search by name, disease or hospital…"
          />
        </div>
        <div className="chips">
          {FILTERS.map((f) => (
            <button key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="plist">
        {results.length === 0 && (
          <div className="empty">
            No patients match your search.
            <br />
            Try another name, disease or hospital.
          </div>
        )}

        {results.map((p) => (
          <div className="prow" key={p.id} onClick={() => router.push(`/patients/${p.id}`)}>
            <div className="av" style={{ background: colors[p.id % colors.length] }}>{p.init}</div>
            <div className="mid">
              <div className="pname">
                {p.name} <span className="vbadge">✓</span>
                {p.urgent && !p.closed && (
                  <span className="vbadge" style={{ background: "var(--urgent-soft)", color: "var(--urgent)" }}>⚡ Urgent</span>
                )}
                {p.closed && <span className="vbadge">Completed</span>}
              </div>
              <div className="pmeta">{p.disease} · {p.hospital}</div>
              <ProgressBar percent={percentRaised(p)} cells={20} />
            </div>
            <div className="rowamt">
              <b>{formatRs(p.got)}</b>of {formatRs(p.need)}
            </div>
            <span className="chev">›</span>
          </div>
        ))}
      </div>
    </>
  );
}