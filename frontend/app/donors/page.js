import { Suspense } from "react";
import Link from "next/link";
import DonorDirectory from "@/components/DonorDirectory";
import { getDonors } from "@/lib/api";

export const metadata = {
  title: "Donor directory — MedFund Sri Lanka",
};

export default async function DonorsPage() {
  const donors = await getDonors();

  return (
    <section>
      <div className="wrap">
        <Link className="backbtn" href="/" style={{ marginBottom: 18 }}>← Back to home</Link>
        <div className="sec-head">
          <div>
            <h2>Donor directory</h2>
            <span className="si">දායක නාමාවලිය · நன்கொடையாளர் பட்டியல்</span>
          </div>
          <Link className="btn btn-blue" href="/register-donor">+ Register as a donor</Link>
        </div>

        {/* useSearchParams needs a Suspense boundary so the rest of the page can be prerendered */}
        <Suspense fallback={<div className="empty">Loading donors…</div>}>
          <DonorDirectory donors={donors} />
        </Suspense>

        <p className="legal" style={{ marginTop: 16 }}>
          📞 Phone numbers are never published. Press &quot;Request contact&quot; and MedFund connects you with the donor directly — this protects donors from spam and harassment.
        </p>
      </div>
    </section>
  );
}