import Link from "next/link";
import PatientApplicationForm from "@/components/PatientApplicationForm";
import T from "@/components/T";

export const metadata = {
  title: "Register a patient — MedFund Sri Lanka",
};

export default function RegisterPatientPage() {
  return (
    <section>
      <div className="wrap" style={{ maxWidth: 880 }}>
        <Link className="backbtn" href="/" style={{ marginBottom: 18 }}><T k="back_home" /></Link>
        <div className="sec-head">
          <div>
            <h2><T k="apply_title" /></h2>
            <span className="si"><T k="apply_sub" /></span>
          </div>
        </div>
        <PatientApplicationForm />
      </div>
    </section>
  );
}