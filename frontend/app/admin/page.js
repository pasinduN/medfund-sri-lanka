import AdminReviewQueue from "@/components/AdminReviewQueue";
import { getPendingApplications } from "@/lib/api";

// Not linked anywhere and hidden from search engines.
// Real protection comes later: the backend must check the user's ADMIN role (JWT) before sending this data.
export const metadata = {
  title: "Admin — MedFund Sri Lanka",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const applications = await getPendingApplications();

  return (
    <section>
      <div className="wrap">
        <span className="admin-badge">🛡 ADMIN</span>
        <AdminReviewQueue applications={applications} />
      </div>
    </section>
  );
}