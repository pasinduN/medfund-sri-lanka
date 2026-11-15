"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "./ThemeProvider";

// Patients and Donor directory are already in the header on big screens,
// so those two only show in this menu on phones and tablets (mobile-only class)
const BROWSE = [
  { href: "/patients", key: "nav_patients", icon: "🏥", mobileOnly: true },
  { href: "/donors", key: "nav_donors", icon: "🩸", mobileOnly: true },
  { href: "/#how", key: "nav_how", icon: "ℹ️" },
];

const TAKE_PART = [
  { href: "/register-patient", key: "start_campaign", icon: "📝" },
  { href: "/register-donor", key: "nav_regdonor", icon: "❤️" },
];

function MenuLink({ item, pathname, onNavigate }) {
  const { t } = useLanguage();

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`dr-link ${pathname === item.href ? "on" : ""} ${item.mobileOnly ? "mobile-only" : ""}`}
    >
      <span className="ico" aria-hidden="true">{item.icon}</span>
      {t(item.key)}
    </Link>
  );
}

export default function SideMenu({ open, onClose }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`scrim ${open ? "open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`drawer ${open ? "open" : ""}`} aria-label={t("menu")} inert={!open}>
        <div className="dr-top">
          <b>{t("menu")}</b>
          <button ref={closeRef} className="dr-close" onClick={onClose} aria-label={t("menu_close")}>✕</button>
        </div>

        <div className="dr-auth">
          <Link className="btn btn-blue" href="/login" onClick={onClose}>{t("nav_login")}</Link>
          <Link className="btn btn-soft" href="/signup" onClick={onClose}>{t("nav_signup")}</Link>
        </div>

        <p className="dr-sec">{t("sec_browse")}</p>
        {BROWSE.map((item) => (
          <MenuLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
        ))}

        <p className="dr-sec">{t("sec_take_part")}</p>
        {TAKE_PART.map((item) => (
          <MenuLink key={item.href} item={item} pathname={pathname} onNavigate={onClose} />
        ))}

        <p className="dr-sec">{t("sec_settings")}</p>
        <div className="dr-row">
          <span>🌐 {t("language")}</span>
          <LanguageSwitcher />
        </div>
        <div className="dr-row">
          <span id="dark-label">🌙 {t("dark_mode")}</span>
          <button
            className={`switch ${theme === "dark" ? "on" : ""}`}
            role="switch"
            aria-checked={theme === "dark"}
            aria-labelledby="dark-label"
            onClick={toggleTheme}
          />
        </div>
      </aside>
    </>
  );
}
