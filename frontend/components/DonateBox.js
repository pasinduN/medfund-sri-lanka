"use client";

import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { useDonate } from "./DonateProvider";
import { formatRs, percentRaised } from "@/lib/format";

export default function DonateBox({ patient: p }) {
  const { openDonate } = useDonate();
  const [copied, setCopied] = useState(false);
  const pct = percentRaised(p);

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
        <div className="closed-banner">🎉 Goal reached — donations closed automatically</div>
        <div style={{ marginTop: 16 }}>
          <ProgressBar percent={100} />
          <div className="mini-stats" style={{ marginTop: 8 }}>
            <span><b>{formatRs(p.got)}</b> raised by {p.donors ?? "many"} donors</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-box">
      {p.urgent && <span className="days">⏳ {p.days} days left</span>}
      <div className="big-amt">
        {formatRs(p.got)} <span>raised of {formatRs(p.need)}</span>
      </div>
      <ProgressBar percent={pct} />
      <div className="mini-stats">
        <span><b>{Math.round(pct)}%</b> funded</span>
        <span><b>{formatRs(p.need - p.got)}</b> to go</span>
      </div>
      <button className="btn btn-green btn-big" onClick={() => openDonate(p)}>
        Donate to {p.name.split(" ")[0]}
      </button>
      <button
        className="btn btn-ghost"
        style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
        onClick={share}
        disabled={copied}
      >
        {copied ? "Link copied ✓ Share it anywhere" : "🔗 Share campaign"}
      </button>
      <div className="safe">
        🔒 <span>Payments via PayHere / card go to MedFund&apos;s audited campaign account — not to a personal bank account. Receipts are emailed instantly.</span>
      </div>
    </div>
  );
}