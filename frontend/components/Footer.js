import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <h5>MedFund Sri Lanka</h5>
          <p style={{ fontSize: ".88rem", maxWidth: "32ch" }}>
            A verified medical fundraising platform. Every rupee is tracked, receipted and audited.
          </p>
        </div>
        <div>
          <h5>Platform</h5>
          <Link href="/patients">Browse patients</Link>
          <Link href="/register-patient">Start a campaign</Link>
          <a>Success stories</a>
        </div>
        <div>
          <h5>Donate</h5>
          <Link href="/register-donor">Blood donors</Link>
          <Link href="/register-donor#organ">Organ pledge</Link>
          <a>Report fraud</a>
        </div>
        <div>
          <h5>Legal</h5>
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
