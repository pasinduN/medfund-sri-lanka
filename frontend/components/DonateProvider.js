"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { formatRs } from "@/lib/format";

const DonateContext = createContext(null);

export function useDonate() {
  return useContext(DonateContext);
}

const AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000];

export function DonateProvider({ children }) {
  const [patient, setPatient] = useState(null);
  const [amount, setAmount] = useState(5000);
  const [done, setDone] = useState(false);

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
            {done ? (
              <div className="success">
                <div className="ring">✓</div>
                <h3>Thank you!</h3>
                <p>
                  Your donation of <b>{formatRs(amount)}</b> to {patient.name}&apos;s campaign was received.
                  <br />A receipt has been emailed to you.
                </p>
                <button className="btn btn-blue" onClick={close}>Back to campaign</button>
              </div>
            ) : (
              <>
                <h3>Make a donation</h3>
                <p className="to">Supporting <b>{patient.name}</b> · {patient.disease}</p>

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
                  placeholder="Or enter another amount (Rs)"
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />

                <div className="paylist">
                  <label className="pay"><input type="radio" name="pm" defaultChecked /> 💳 PayHere <span className="hint">Visa · Master · LKR — recommended</span></label>
                  <label className="pay"><input type="radio" name="pm" /> 🌐 Card via Stripe <span className="hint">International donors</span></label>
                  <label className="pay"><input type="radio" name="pm" /> 🏦 Bank transfer <span className="hint">To MedFund audited account</span></label>
                </div>
                <label className="anon"><input type="checkbox" /> Donate anonymously — hide my name from the campaign page</label>

                <button className="btn btn-green btn-big" disabled={amount <= 0} onClick={() => setDone(true)}>
                  Donate securely
                </button>
                <p className="safe" style={{ marginTop: 12 }}>🔒 This is a prototype — no real payment is processed.</p>
              </>
            )}
          </div>
        )}
      </div>
    </DonateContext.Provider>
  );
}
