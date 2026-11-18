"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import NotificationList from "./NotificationList";
import { useNotifications } from "@/lib/notificationStore";

export default function NotificationBell() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, unread, markRead, markAllRead } = useNotifications(user?.id);
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

  return (
    <div className="bell" ref={boxRef}>
      <button
        className="iconbtn bellbtn"
        aria-label={unread > 0 ? t("notes_unread").replace("{n}", unread) : t("notifications")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">🔔</span>
        {unread > 0 && <span className="badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="notepop">
          <div className="notepop-head">
            <b>{t("notifications")}</b>
            {unread > 0 && <button className="linkbtn" onClick={markAllRead}>{t("mark_all_read")}</button>}
          </div>
          <NotificationList
            items={items}
            limit={5}
            onOpen={(n) => {
              markRead(n.id);
              setOpen(false);
            }}
          />
          <Link className="notepop-all" href="/notifications" onClick={() => setOpen(false)}>{t("see_all")} →</Link>
        </div>
      )}
    </div>
  );
}