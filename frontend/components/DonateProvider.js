"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { formatRs } from "@/lib/format";
import { useHolds } from "@/lib/moderationStore";
import { useLanguage } from "./LanguageProvider";

const DonateContext = createContext(null);

export function useDonate() {
  return useContext(DonateContext);
}

const AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

export function DonateProvider({ children }) {
  const [patient, setPatient] = useState(null);
  const [amount, setAmount] = useState(5000);
  const [done, setDone] = useState(false);
  const holds = useHolds();
  const { t } = useLanguage();
  const hold = patient ? holds[patient.id] : null;

  const openDonate = (p) => {
    setPatient(p);
    setAmount(5000);
    setDone(false);
  };
  const close = () => setPatient(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <DonateContext.Provider value={{ openDonate }}>
      {children}

      <div className={`overlay ${patient ? "on" : ""}`} onClick={(e) => e.target === e.currentTarget && close()}>
        {patient && (
          <div className="modal">
            {hold ? (
              <div className="success">
                <div className="ring hold">{hold.status === "closed" ? "⛔" : "⏸"}</div>
                <h3>{t(hold.status === "closed" ? "hold_closed_h" : "hold_paused_h")}</h3>
                <p>{t(hold.reason)}. {t("hold_p")}</p>
                <button className="btn btn-blue" onClick={close}>{t("cancel")}</button>
              </div>
            ) : done ? (
              <div className="success">
                <div className="ring">✓</div>
                <h3>{t("thanks_h")}</h3>
                <p>{t("thanks_p").replace("{amount}", formatRs(amount)).replace("{name}", patient.name)}</p>
                <button className="btn btn-blue" onClick={close}>{t("back_campaign")}</button>
              </div>
            ) : (
              <>
                <h3>{t("donate_title")}</h3>
                <p className="to">{t("donate_supporting")} <b>{patient.name}</b> · {patient.disease}</p>

                <div className="amount-grid">
                  {AMOUNTS.map((a) => (
                    <button key={a} className={a === amount ? "on" : ""} onClick={() => setAmount(a)}>
                      Rs {a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  className="custom-amt"
                  type="number"
                  placeholder={t("donate_other_amt")}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />

                <div className="paylist">
                  <label className="pay"><input type="radio" name="pm" defaultChecked /> 💳 PayHere <span className="hint">{t("pay_payhere_hint")}</span></label>
                  <label className="pay"><input type="radio" name="pm" /> 🌐 {t("pay_stripe")} <span className="hint">{t("pay_stripe_hint")}</span></label>
                  <label className="pay"><input type="radio" name="pm" /> 🏦 {t("pay_bank")} <span className="hint">{t("pay_bank_hint")}</span></label>
                </div>
                <label className="anon"><input type="checkbox" /> {t("donate_anon")}</label>

                <button className="btn btn-green btn-big" disabled={amount <= 0} onClick={() => setDone(true)}>
                  {t("donate_secure")}
                </button>
                <p className="safe" style={{ marginTop: 12 }}>🔒 {t("donate_proto")}</p>
              </>
            )}
          </div>
        )}
      </div>
    </DonateContext.Provider>
  );
}
