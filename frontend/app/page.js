import Link from "next/link";
import LiveTicker from "@/components/LiveTicker";
import UrgentBoard from "@/components/UrgentBoard";
import PatientCard from "@/components/PatientCard";
import DonorSignup from "@/components/DonorSignup";
import T from "@/components/T";
import { getPatients, getFeaturedPatients, getUrgentBoard } from "@/lib/api";

const STEPS = ["s1", "s2", "s3", "s4"];

const STATS = [
  ["Rs 48.2M", "trust1"],
  ["312", "trust2"],
  ["1,840", "trust3"],
  ["100%", "trust4"],
];

export default async function HomePage() {
  const [patients, featured, urgent] = await Promise.all([getPatients(), getFeaturedPatients(), getUrgentBoard()]);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="eyebrow"><span className="dot" /> <T k="eyebrow" /></span>
            <h1><T k="h1" html /></h1>
            <p className="sub"><T k="sub" /></p>
            <span className="si si-line">
              සත්‍යාපිත රෝගීන් සඳහා ආරක්ෂිත මූල්‍ය ආධාර · சரிபார்க்கப்பட்ட நோயாளிகளுக்கு பாதுகாப்பான நிதி உதவி
            </span>
            <div className="hero-actions">
              <Link className="btn btn-green btn-big" href="/patients"><T k="browse" /></Link>
              <Link className="btn btn-blue btn-big" href="/register-patient"><T k="reg_a_patient" /></Link>
              <Link className="btn btn-ghost btn-big" href="#how"><T k="how_verif" /></Link>
            </div>
            <div className="trustline">
              {STATS.map(([value, key]) => (
                <div key={key}><b>{value}</b><span><T k={key} /></span></div>
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
              <h2><T k="feat" /></h2>
              <span className="si">දැන් උදව් අවශ්‍ය රෝගීන්</span>
            </div>
            <Link className="seeall" href="/patients"><T k="seeall" /></Link>
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
              <h2><T k="how_t" /></h2>
              <span className="si">සත්‍යාපනය සිදුවන ආකාරය</span>
            </div>
          </div>
          <div className="steps">
            {STEPS.map((step, i) => (
              <div className="step" key={step}>
                <span className="n">{i + 1}</span>
                <b><T k={`${step}b`} /></b>
                <p><T k={`${step}p`} /></p>
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