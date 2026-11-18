import AdminDashboard from "@/components/AdminDashboard";
import { getPatients, getPendingApplications } from "@/lib/api";

// Not linked for normal visitors and hidden from search engines.
// Real protection comes later: the backend must check the user's ADMIN role (JWT) before sending this data.
export const metadata = {
  title: "Admin — MedFund Sri Lanka",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [applications, patients] = await Promise.all([getPendingApplications(), getPatients()]);

  return (
    <section>
      <div className="wrap">
        <span className="admin-badge">🛡 ADMIN</span>
        <AdminDashboard applications={applications} patients={patients} />
      </div>
    </section>
  );
}