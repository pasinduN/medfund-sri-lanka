import Link from "next/link";
import LiveTicker from "@/components/LiveTicker";
import UrgentBoard from "@/components/UrgentBoard";
import PatientCard from "@/components/PatientCard";
import DonorSignup from "@/components/DonorSignup";
import { getPatients, getFeaturedPatients, getUrgentBoard } from "@/lib/api";

const STEPS = [
  { title: "Patient applies", text: "Uploads medical reports, hospital letters, cost estimate and GN certificate." },
  { title: "AI document check", text: "OCR and forgery detection flag stamps, signatures, duplicates and edited images." },
  { title: "Human approval", text: "Our admin team reviews every AI result. No campaign auto-approves itself." },
  { title: "Funds disbursed", text: "Donations sit in MedFund's audited account and are paid to the hospital or patient with receipts." },
];

const STATS = [
  ["Rs 48.2M", "raised to date"],
  ["312", "campaigns completed"],
  ["1,840", "blood donors registered"],
  ["100%", "documents human-reviewed"],
];

export default async function HomePage() {
  const [patients, featured, urgent] = await Promise.all([getPatients(), getFeaturedPatients(), getUrgentBoard()]);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow"><span className="dot" /> Every campaign verified before it goes live</span>
            <h1>
              Help a verified patient<br />get the treatment<br />they <span className="hl">can&apos;t afford alone</span>.
            </h1>
            <p className="sub">
              MedFund lists only patients whose medical documents have been AI-checked and approved by our review team.
              Your donation goes to the platform&apos;s audited account — never to an unverified personal number.
            </p>
            <span className="si si-line">
              සත්‍යාපිත රෝගීන් සඳහා ආරක්ෂිත මූල්‍ය ආධාර · சரிபார்க்கப்பட்ட நோயாளிகளுக்கு பாதுகாப்பான நிதி உதவி
            </span>
            <div className="hero-actions">
              <Link className="btn btn-green btn-big" href="/patients">Browse patients</Link>
              <Link className="btn btn-blue btn-big" href="/register-patient">＋ Register a patient</Link>
              <Link className="btn btn-ghost btn-big" href="#how">How verification works</Link>
            </div>
            <div className="trustline">
              {STATS.map(([value, label]) => (
                <div key={label}><b>{value}</b><span>{label}</span></div>
              ))}
            </div>
          </div>
          <LiveTicker />
        </div>
      </section>

      <section style={{ padding: "10px 0 0" }}>
        <div className="wrap">
          <UrgentBoard needs={urgent.needs} donors={urgent.donors} patients={patients} />
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>Patients who need help now</h2>
              <span className="si">දැන් උදව් අවශ්‍ය රෝගීන්</span>
            </div>
            <Link className="seeall" href="/patients">See all patients →</Link>
          </div>
          <div className="cards">
            {featured.map((p) => <PatientCard key={p.id} patient={p} />)}
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>How a campaign earns its badge</h2>
              <span className="si">සත්‍යාපනය සිදුවන ආකාරය</span>
            </div>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s.title}>
                <span className="n">{i + 1}</span>
                <b>{s.title}</b>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blood">
        <DonorSignup />
      </section>
    </>
  );
}
