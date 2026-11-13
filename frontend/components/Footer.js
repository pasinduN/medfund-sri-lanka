import Link from "next/link";
import T from "./T";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <h5>MedFund Sri Lanka</h5>
          <p style={{ fontSize: ".88rem", maxWidth: "32ch" }}>
            A verified medical fundraising platform. Every rupee is tracked, receipted and audited.
          </p>
          <LanguageSwitcher className="foot-langs" />
        </div>
        <div>
          <h5><T k="f_platform" /></h5>
          <Link href="/patients">Browse patients</Link>
          <Link href="/register-patient">Start a campaign</Link>
          <Link href="/login">Log in</Link>
          <a>Success stories</a>
        </div>
        <div>
          <h5><T k="f_donate" /></h5>
          <Link href="/register-donor">Blood donors</Link>
          <Link href="/register-donor#organ">Organ pledge</Link>
          <a>Report fraud</a>
        </div>
        <div>
          <h5><T k="f_legal" /></h5>
          <a>Privacy (PDPA)</a>
          <a>Fund disbursement policy</a>
          <a>Excess funds policy</a>
        </div>
      </div>
      <div className="foot-note">
        © 2026 MedFund Sri Lanka · Prototype — no real payments are processed · English · සිංහල · தமிழ்
      </div>
    </footer>
  );
}
