"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { initials } from "@/lib/format";
import { DEMO_ACCOUNTS, DEMO_OTP, DEMO_PASSWORD, loginWithEmail, sendOtp, verifyOtp } from "@/lib/demoAuth";

export default function LoginForm() {
  const { t } = useLanguage();
  const { user, logIn, logOut } = useAuth();
  const router = useRouter();

  const [method, setMethod] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (task) => {
    setError("");
    setBusy(true);
    try {
      await task();
    } catch (err) {
      setError(t(err.message));
    } finally {
      setBusy(false);
    }
  };

  const finish = (account) => {
    logIn(account);
    router.push(account.role === "admin" ? "/admin" : "/");
  };

  const switchMethod = (next) => {
    setMethod(next);
    setError("");
  };

  const handlePhone = (e) => {
    e.preventDefault();
    run(async () => {
      if (!codeSent) {
        await sendOtp(phone);
        setCodeSent(true);
      } else {
        finish(await verifyOtp(phone, code));
      }
    });
  };

  const handleEmail = (e) => {
    e.preventDefault();
    run(async () => finish(await loginWithEmail(email, password)));
  };

  const fillDemo = (account) => {
    setError("");
    if (method === "phone") {
      setPhone(account.phone);
      setCode("");
      setCodeSent(false);
    } else {
      setEmail(account.email);
      setPassword(DEMO_PASSWORD);
    }
  };

  if (user) {
    return (
      <div className="formgrid">
        <div className="form-info">{t("logged_in_as").replace("{name}", user.name)}</div>
        <Link className="btn btn-blue btn-big" href="/">{t("go_home")}</Link>
        <button className="btn btn-soft btn-big" onClick={logOut}>{t("log_out")}</button>
      </div>
    );
  }

  return (
    <>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={method === "phone"} className={method === "phone" ? "on" : ""} onClick={() => switchMethod("phone")}>
          📱 {t("tab_phone")}
        </button>
        <button role="tab" aria-selected={method === "email"} className={method === "email" ? "on" : ""} onClick={() => switchMethod("email")}>
          ✉️ {t("tab_email")}
        </button>
      </div>

      {method === "phone" ? (
        <form onSubmit={handlePhone} className="formgrid">
          <div className="field">
            <label htmlFor="phone">{t("phone")}</label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="07X XXX XXXX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setCodeSent(false);
              }}
            />
          </div>

          {codeSent && (
            <div className="field">
              <label htmlFor="otp">{t("otp_label")}</label>
              <input
                id="otp"
                className="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                autoFocus
                placeholder="••••••"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
              <small className="hint">
                {t("otp_sent").replace("{phone}", phone)} ·{" "}
                <button type="button" className="linkbtn" onClick={() => run(() => sendOtp(phone))}>
                  {t("otp_resend")}
                </button>
              </small>
            </div>
          )}

          {error && <div className="form-error" role="alert">{error}</div>}

          <button type="submit" className="btn btn-blue btn-big" disabled={busy}>
            {busy ? t("please_wait") : codeSent ? t("otp_verify") : t("otp_send")}
          </button>
        </form>
      ) : (
        <form onSubmit={handleEmail} className="formgrid">
          <div className="field">
            <label htmlFor="email">{t("email")}</label>
            <input id="email" type="email" autoComplete="email" required placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">{t("password")}</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="form-error" role="alert">{error}</div>}

          <button type="submit" className="btn btn-blue btn-big" disabled={busy}>
            {busy ? t("please_wait") : t("nav_login")}
          </button>
          <button type="button" className="linkbtn" onClick={() => switchMethod("phone")}>
            {t("forgot_pw")}
          </button>
        </form>
      )}

      <div className="auth-links">
        <span>{t("new_here")} <Link href="/signup">{t("create_account")}</Link></span>
      </div>

      <div className="demo-box">
        <p>
          <b>🧪 {t("demo_title")}</b> — {t("demo_hint").replace("{otp}", DEMO_OTP).replace("{pw}", DEMO_PASSWORD)}
        </p>
        {DEMO_ACCOUNTS.map((a) => (
          <button key={a.id} type="button" className="demo-acc" onClick={() => fillDemo(a)}>
            <span className="avatar">{initials(a.name)}</span>
            <b>{a.name}</b>
            <span className={`role-tag ${a.role}`}>{t(`role_${a.role}`)}</span>
          </button>
        ))}
      </div>
    </>
  );
}