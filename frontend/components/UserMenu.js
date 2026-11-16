"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { initials } from "@/lib/format";

export default function UserMenu() {
  const { t } = useLanguage();
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const handleLogOut = () => {
    setOpen(false);
    logOut();
    router.push("/");
  };

  return (
    <div className="usermenu" ref={boxRef}>
      <button className="avatar" aria-label={t("account_menu")} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {initials(user.name)}
      </button>
      {open && (
        <div className="userpop" role="menu">
          <div className="upop-head">
            <span className="avatar big">{initials(user.name)}</span>
            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
              <span className={`role-tag ${user.role}`}>{t(`role_${user.role}`)}</span>
            </div>
          </div>
          <Link role="menuitem" href="/profile" onClick={() => setOpen(false)}>👤 {t("my_profile")}</Link>
          {user.role === "admin" && (
            <Link role="menuitem" href="/admin" onClick={() => setOpen(false)}>🛡️ {t("admin_review")}</Link>
          )}
          <button role="menuitem" onClick={handleLogOut}>↩ {t("log_out")}</button>
        </div>
      )}
    </div>
  );
}