import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentViewer from "@/components/DocumentViewer";
import DonateBox from "@/components/DonateBox";
import { getPatient, getPatients } from "@/lib/api";
import { colors, patientGradient } from "@/lib/format";

export async function generateStaticParams() {
  const patients = await getPatients();
  return patients.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getPatient(id);
  return { title: p ? `${p.name} — MedFund Sri Lanka` : "Patient not found" };
}

export default async function PatientDetailPage({ params }) {
  const { id } = await params;
  const p = await getPatient(id);
  if (!p) notFound();

  let tag = "Active campaign";
  if (p.closed) tag = "✓ Campaign completed";
  else if (p.urgent) tag = "⚡ Urgent case";

  return (
    <>
      <div className="wrap" style={{ paddingTop: 22 }}>
        <Link className="backbtn" href="/patients">← Back to patient list</Link>
      </div>

      <div className="wrap detail">
        <div className="dmain">
          <div className="dhero">
            <div className="banner" style={{ background: patientGradient(p.id) }}>
              {p.init}
              <span className={`tag ${p.urgent && !p.closed ? "urgent" : ""}`}>{tag}</span>
            </div>
            <div className="body">
              <h2>{p.name}</h2>
              <div className="regline">
                <span className="vbadge">✓ Verified patient</span>
                <span className="reg">{p.reg}</span>
                <span className="pmeta">AI-checked · Admin approved</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: ".98rem" }}>{p.story}</p>
              <div className="facts">
                <div className="fact"><span>Condition</span><b>{p.disease}</b></div>
                <div className="fact"><span>Hospital</span><b>{p.hospital}</b></div>
                <div className="fact"><span>Consultant</span><b>{p.doctor}</b></div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3>Verified documents <span className="si">සත්‍යාපිත ලේඛන</span></h3>
            <p>Tap any document to preview it and check the condition yourself. Personal identifiers (NIC, address, phone) are redacted in the public preview.</p>
            <DocumentViewer patient={p} />
            <div className="note">
              💡 Donations are held in MedFund&apos;s audited account and released to <b>{p.hospital}</b> against invoices — you never pay an unverified stranger directly.
            </div>
          </div>

          <div className="panel">
            <h3>Verified beneficiary account <span className="si">සත්‍යාපිත ගිණුම් විස්තර</span></h3>
            <p>Checked against the patient&apos;s bank passbook and NIC by the review team. This is the account funds are released to after hospital invoicing.</p>
            <div className="bankgrid">
              <div className="bank"><span>Bank</span><b>{p.bank}</b></div>
              <div className="bank"><span>Branch</span><b>{p.branch}</b></div>
              <div className="bank"><span>Account holder</span><b>{p.name} <span className="vbadge">✓ matches NIC</span></b></div>
              <div className="bank"><span>Account number</span><b>{p.account}</b></div>
            </div>
            <div className="note">
              🛡 The middle digits are masked publicly so scammers can&apos;t clone this campaign with the same details. Logged-in donors can view the fully verified number and the bank confirmation letter.
            </div>
          </div>

          <div className="panel">
            <h3>Treatment updates <span className="si">ප්‍රතිකාර යාවත්කාලීන</span></h3>
            <div className="timeline">
              {p.updates.map(([date, title, text], i) => (
                <div className="tl" key={date + title}>
                  <div className="rail">
                    <div className="nd" />
                    {i < p.updates.length - 1 && <div className="ln" />}
                  </div>
                  <div className="tx">
                    <span className="dt">{date}</span>
                    <b>{title}</b>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3>Messages of support <span className="si">ශුභ පැතුම්</span></h3>
            {p.comments.length === 0 && <p style={{ padding: "10px 0" }}>Be the first to leave a message of support.</p>}
            {p.comments.map(([author, message]) => (
              <div className="comment" key={author + message}>
                <div className="av" style={{ background: colors[author.length % colors.length] }}>{author[0]}</div>
                <div>
                  <b>{author}</b>
                  <p>{message}</p>
                </div>
              </div>
            ))}
            <div className="comment">
              <div className="av" style={{ background: "var(--blue)" }}>You</div>
              <Link className="cin" href="/login">Write a kind message… (login required)</Link>
            </div>
          </div>
        </div>

        <aside className="drail">
          <DonateBox patient={p} />
          <div className="trust-box">
            <h4>Why you can trust this campaign</h4>
            <div className="tstep"><span className="ok">✓</span><span><b>AI document check</b> — stamps, signatures &amp; duplicates scanned</span></div>
            <div className="tstep"><span className="ok">✓</span><span><b>Human review</b> — approved by MedFund admins</span></div>
            <div className="tstep"><span className="ok">✓</span><span><b>Hospital confirmed</b> — cost estimate matched to {p.hospital.split(",")[0]}</span></div>
            <div className="tstep"><span className="ok">✓</span><span><b>Auto-close</b> — donations stop the moment the goal is met</span></div>
          </div>
        </aside>
      </div>
    </>
  );
}