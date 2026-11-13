"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const links = [
  { href: "/patients", key: "nav_patients" },
  { href: "/donors", key: "nav_donors" },
  { href: "/register-donor", key: "nav_regdonor" },
  { href: "/#how", key: "nav_how" },
];

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header>
      <div className="wrap nav">
        <Link className="logo" href="/">
          <span className="pulse">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l2-6 4 12 2-6h6" />
            </svg>
          </span>
          Med<em>Fund</em>&nbsp;
          <span style={{ fontSize: ".7rem", fontWeight: 600, color: "var(--muted)" }}>SRI LANKA</span>
        </Link>

        <nav className="navlinks">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : ""}>
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher />

        <Link className="btn btn-ghost nav-login" href="/login">{t("nav_login")}</Link>
        <Link className="btn btn-blue" href="/register-patient">{t("reg_patient")}</Link>
        <Link className="btn btn-green" href="/patients">{t("donate_now")}</Link>
      </div>
    </header>
  );
}