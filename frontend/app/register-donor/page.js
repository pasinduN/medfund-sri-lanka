import Link from "next/link";
import DonorSignup from "@/components/DonorSignup";

export const metadata = {
  title: "Become a donor — MedFund Sri Lanka",
};

export default function RegisterDonorPage() {
  return (
    <section>
      <div className="wrap">
        <Link className="backbtn" href="/donors" style={{ marginBottom: 18 }}>← Back to donor directory</Link>
        <div className="sec-head">
          <div>
            <h2>Become a donor</h2>
            <span className="si">දායකයෙකු ලෙස ලියාපදිංචි වන්න · நன்கொடையாளராக பதிவு</span>
          </div>
        </div>
      </div>
      <DonorSignup />
    </section>
  );
}