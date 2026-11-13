"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/patients", label: "Patients" },
  { href: "/donors", label: "Donor directory" },
  { href: "/register-donor", label: "Register as donor" },
  { href: "/#how", label: "How it works" },
];

export default function Header() {
  const pathname = usePathname();

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
              {l.label}
            </Link>
          ))}
        </nav>

        <Link className="btn btn-ghost nav-login" href="/login" style={{ marginLeft: "auto" }}>
          Log in
        </Link>
        <Link className="btn btn-blue" href="/register-patient">
          ＋ Register patient
        </Link>
        <Link className="btn btn-green" href="/patients">
          Donate now
        </Link>
      </div>
    </header>
  );
}
