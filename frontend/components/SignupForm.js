"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { DEMO_OTP, register } from "@/lib/demoAuth";
import { notify } from "@/lib/notificationStore";

const ROLES = [
  { value: "donor", icon: "🤝", label: "role_donor", hint: "role_donor_hint" },
  { value: "patient", icon: "🏥", label: "role_patient_pick", hint: "role_patient_hint" },
];

export default function SignupForm() {
  const { t } = useLanguage();
  const { logIn } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [account, setAccount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (form.get("password").length < 8) {
      setError(t("err_pw_short"));
      return;
    }
    if (form.get("password") !== form.get("confirm")) {
      setError(t("err_pw_match"));
      return;
    }

    setError("");
    setBusy(true);
    try {
      const created = await register({
        name: form.get("fullName"),
        email: form.get("email"),
        phone: form.get("phone"),
        role: form.get("role"),
      });
      logIn(created);
      notify(created.id, "welcome");
      setAccount(created);
    } catch (err) {
      setError(t(err.message));
    } finally {
      setBusy(false);
    }
  };

  if (account) {
    const isDonor = account.role === "donor";
    return (
      <div className="success">
        <div className="ring">✓</div>
        <h3>{t("signup_done").replace("{name}", account.name.split(" ")[0])}</h3>
        <p>{t("signup_done_note").replace("{otp}", DEMO_OTP)}</p>
        <div className="success-actions">
          <Link className="btn btn-green" href={isDonor ? "/register-donor" : "/register-patient"}>
            {t(isDonor ? "nav_regdonor" : "start_campaign")}
          </Link>
          <Link className="btn btn-soft" href="/">{t("go_home")}</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="formgrid">
      <div className="field">
        <label>{t("join_as")}</label>
        <div className="role-pick">
          {ROLES.map((r) => (
            <label key={r.value}>
              <input type="radio" name="role" value={r.value} defaultChecked={r.value === "donor"} />
              {r.icon} {t(r.label)}
              <span>{t(r.hint)}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="field"><label htmlFor="fullName">{t("full_name")}</label><input id="fullName" name="fullName" required autoComplete="name" placeholder={t("name_ph")} /></div>
      <div className="field"><label htmlFor="email">{t("email")}</label><input id="email" name="email" type="email" required autoComplete="email" placeholder="name@email.com" /></div>
      <div className="field"><label htmlFor="phone">{t("phone")}</label><input id="phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="07X XXX XXXX" /></div>
      <div className="field"><label htmlFor="password">{t("password")}</label><input id="password" name="password" type="password" required autoComplete="new-password" placeholder={t("pw_ph")} /></div>
      <div className="field"><label htmlFor="confirm">{t("confirm_pw")}</label><input id="confirm" name="confirm" type="password" required autoComplete="new-password" /></div>

      {error && <div className="form-error" role="alert">{error}</div>}

      <button type="submit" className="btn btn-green btn-big" disabled={busy}>
        {busy ? t("please_wait") : t("create_account")}
      </button>

      <div className="auth-links">
        <span>{t("have_account")} <Link href="/login">{t("nav_login")}</Link></span>
      </div>
    </form>
  );
}