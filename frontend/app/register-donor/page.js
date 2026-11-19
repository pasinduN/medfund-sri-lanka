import Link from "next/link";
import DonorSignup from "@/components/DonorSignup";
import T from "@/components/T";

export const metadata = {
  title: "Become a donor — MedFund Sri Lanka",
};

export default function RegisterDonorPage() {
  return (
    <section>
      <div className="wrap">
        <Link className="backbtn" href="/donors" style={{ marginBottom: 18 }}><T k="back_donor_dir" /></Link>
        <div className="sec-head">
          <div>
            <h2><T k="become_donor" /></h2>
            <span className="si">දායකයෙකු ලෙස ලියාපදිංචි වන්න · நன்கொடையாளராக பதிவு</span>
          </div>
        </div>
      </div>
      <DonorSignup />
    </section>
  );
}