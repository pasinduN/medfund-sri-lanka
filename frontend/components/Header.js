"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import LanguageMenu from "./LanguageMenu";
import SideMenu from "./SideMenu";

const links = [
  { href: "/patients", key: "nav_patients" },
  { href: "/donors", key: "nav_donors" },
];

export default function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The home page hero already has a big "Register a patient" button
  const showRegister = pathname !== "/";

  // SideMenu sits outside <header>: the header's blur effect would otherwise trap the fixed-position drawer inside it
  return (
    <>
      <header>
        <div className="wrap nav">
          <Link className="logo" href="/">
            <span className="pulse">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l2-6 4 12 2-6h6" />
              </svg>
            </span>
            Med<em>Fund</em>&nbsp;
            <span className="logo-sub">SRI LANKA</span>
          </Link>

          <nav className="navlinks">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : ""}>
                {t(l.key)}
              </Link>
            ))}
          </nav>

          <span className="nav-push" />
          <LanguageMenu />
          <Link className="btn btn-soft nav-login" href="/login">{t("nav_login")}</Link>
          {showRegister && (
            <Link className="btn btn-blue nav-register" href="/register-patient">{t("reg_patient")}</Link>
          )}
          <Link className="btn btn-green nav-donate" href="/patients">{t("donate_short")}</Link>
          <button
            className="iconbtn ham"
            onClick={() => setMenuOpen(true)}
            aria-label={t("menu_open")}
            aria-expanded={menuOpen}
          >
            <i />
          </button>
        </div>
      </header>

      <SideMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}