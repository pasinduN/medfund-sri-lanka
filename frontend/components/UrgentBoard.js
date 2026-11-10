"use client";

import Link from "next/link";
import { useDonate } from "./DonateProvider";

function UrgentItem({ item, buttonClass, patients }) {
  const { openDonate } = useDonate();

  return (
    <div className="uitem">
      <span className="uic">{item.icon}</span>
      <div className="utx">
        <b>{item.title}</b> {item.text}
        <span className="uw">⏱ {item.when}</span>
      </div>
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

export default function UrgentBoard({ needs, donors, patients }) {
  return (
    <div className="uboard">
      <div className="ucol need">
        <div className="uhead">🚨 Urgent needs <span>patients waiting for help right now</span></div>
        {needs.map((item) => (
          <UrgentItem key={item.title} item={item} buttonClass="btn-blue" patients={patients} />
        ))}
      </div>
      <div className="ucol give">
        <div className="uhead">⚡ Urgent donors <span>ready to give right now</span></div>
        {donors.map((item) => (
          <UrgentItem key={item.title} item={item} buttonClass="btn-green" patients={patients} />
        ))}
      </div>
    </div>
  );
}
