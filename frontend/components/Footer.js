import Link from "next/link";
import T from "./T";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <h5>MedFund Sri Lanka</h5>
          <p style={{ fontSize: ".88rem", maxWidth: "32ch" }}><T k="foot_about" /></p>
          <LanguageSwitcher className="foot-langs" />
        </div>
        <div>
          <h5><T k="f_platform" /></h5>
          <Link href="/patients"><T k="browse" /></Link>
          <Link href="/register-patient"><T k="start_campaign" /></Link>
          <Link href="/login"><T k="nav_login" /></Link>
          <a><T k="foot_stories" /></a>
        </div>
        <div>
          <h5><T k="f_donate" /></h5>
          <Link href="/register-donor"><T k="foot_blood" /></Link>
          <Link href="/register-donor#organ"><T k="f_organ" /></Link>
          <a><T k="foot_fraud" /></a>
        </div>
        <div>
          <h5><T k="f_legal" /></h5>
          <a><T k="foot_privacy" /></a>
          <a><T k="foot_disburse" /></a>
          <a><T k="foot_excess" /></a>
        </div>
      </div>
      <div className="foot-note">
        © 2026 MedFund Sri Lanka · <T k="foot_note" /> · English · සිංහල · தமிழ்
      </div>
    </footer>
  );
}