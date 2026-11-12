import Link from "next/link";
import UrgentAlerts from "@/components/UrgentAlerts";
import PatientList from "@/components/PatientList";
import { getPatients, getUrgentBoard } from "@/lib/api";

export const metadata = {
  title: "All patients — MedFund Sri Lanka",
};

export default async function PatientsPage() {
  const [patients, urgent] = await Promise.all([getPatients(), getUrgentBoard()]);

  return (
    <section>
      <div className="wrap">
        <Link className="backbtn" href="/" style={{ marginBottom: 18 }}>← Back to home</Link>

        <UrgentAlerts needs={urgent.needs} donors={urgent.donors} patients={patients} />

        <div className="sec-head">
          <div>
            <h2>All patients</h2>
            <span className="si">සියලුම රෝගීන් · scroll to see more</span>
          </div>
          <Link className="btn btn-ghost" href="/donors">Donor directory →</Link>
        </div>

        <PatientList patients={patients} />
      </div>
    </section>
  );
}