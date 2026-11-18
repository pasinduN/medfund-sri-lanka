"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import NotificationList from "./NotificationList";
import { useNotifications } from "@/lib/notificationStore";

const noSubscribe = () => () => {};

export default function NotificationsView() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, unread, markRead, markAllRead } = useNotifications(user?.id);
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

  if (!mounted) return <div className="panel profile-loading" aria-busy="true" />;

  if (!user) {
    return (
      <div className="panel empty-state">
        <span className="glyph">🔔</span>
        <h3>{t("notes_login_h")}</h3>
        <Link className="btn btn-blue" href="/login">{t("nav_login")}</Link>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="hist-head">
        <h2>🔔 {t("notifications")}</h2>
        {unread > 0 && <button className="btn btn-soft" onClick={markAllRead}>{t("mark_all_read")}</button>}
      </div>
      <NotificationList items={items} onOpen={(n) => markRead(n.id)} />
    </div>
  );
}