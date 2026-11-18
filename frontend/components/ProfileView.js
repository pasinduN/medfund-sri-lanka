"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import DonorProfile from "./DonorProfile";
import PatientProfile from "./PatientProfile";
import { initials } from "@/lib/format";

const noSubscribe = () => () => {};

export default function ProfileView() {
  const { t } = useLanguage();
  const { user } = useAuth();
  // false on the server and while hydrating, so a logged-in visitor never sees the "please log in" box flash
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

  if (!mounted) return <div className="panel profile-loading" aria-busy="true" />;

  if (!user) {
    return (
      <div className="panel empty-state">
        <span className="glyph">👤</span>
        <h3>{t("profile_login_h")}</h3>
        <p>{t("profile_login_p")}</p>
        <Link className="btn btn-blue" href="/login">{t("nav_login")}</Link>
      </div>
    );
  }

  return (
    <>
      <div className="panel profile-head">
        <span className="avatar big">{initials(user.name)}</span>
        <div>
          <h2>{user.name}</h2>
          <p>{user.email} · {user.phone}</p>
        </div>
        <span className={`role-tag ${user.role}`}>{t(`role_${user.role}`)}</span>
      </div>

      {user.role === "patient" && <PatientProfile user={user} />}
      {user.role !== "admin" && <DonorProfile user={user} hideWhenEmpty={user.role === "patient"} />}
    </>
  );
}