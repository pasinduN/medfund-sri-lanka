import Link from "next/link";
import PatientApplicationForm from "@/components/PatientApplicationForm";

export const metadata = {
  title: "Register a patient — MedFund Sri Lanka",
};

export default function RegisterPatientPage() {
  return (
    <section>
      <div className="wrap" style={{ maxWidth: 880 }}>
        <Link className="backbtn" href="/" style={{ marginBottom: 18 }}>← Back to home</Link>
        <div className="sec-head">
          <div>
            <h2>Patient application — start a campaign</h2>
            <span className="si">රෝගී තොරතුරු ඇතුළත් කරන්න · verified before going live</span>
          </div>
        </div>
        <PatientApplicationForm />
      </div>
    </section>
  );
}