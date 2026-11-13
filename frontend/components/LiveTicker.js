"use client";

import { useEffect, useState } from "react";
import { formatRs } from "@/lib/format";
import { useLanguage } from "./LanguageProvider";

// Fake activity for the prototype — will come from the donations API later
const DONORS = [["Anonymous", "#5C7885"], ["Ishara F.", "#15628F"], ["Kamal R.", "#1F9D6C"], ["W. Gunasekara", "#B03A6E"], ["Priya S.", "#7C5CBF"], ["Dinesh M.", "#B8860B"]];
const ACTIONS = ["donated to Nimal's transplant", "donated to Sithmi's treatment", "donated to Fathima's surgery", "donated to Kusum's care", "donated to Tharindu's transplant"];
const AMOUNTS = [1000, 2000, 2500, 5000, 7500, 10000, 15000];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

let nextId = 0;
function randomTick() {
  const [name, color] = pick(DONORS);
  return { id: nextId++, name, color, action: pick(ACTIONS), amount: pick(AMOUNTS) };
}

export default function LiveTicker() {
  const { t } = useLanguage();
  const [ticks, setTicks] = useState([]);

  useEffect(() => {
    const first = setTimeout(() => setTicks(Array.from({ length: 4 }, randomTick)), 0);
    const timer = setInterval(() => {
      setTicks((prev) => [randomTick(), ...prev].slice(0, 4));
    }, 3800);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="ticker-card">
      <h3><span className="dot" /> {t("live_don")}</h3>
      {ticks.map((t) => (
        <div className="tick" key={t.id}>
          <div className="av" style={{ background: t.color }}>{t.name[0]}</div>
          <div>
            <div className="who">{t.name}</div>
            <div className="what">{t.action}</div>
          </div>
          <div className="amt">+{formatRs(t.amount)}</div>
        </div>
      ))}
    </div>
  );
}