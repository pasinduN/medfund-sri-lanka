import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentViewer from "@/components/DocumentViewer";
import DonateBox from "@/components/DonateBox";
import T from "@/components/T";
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

  let tag = "tag_active";
  if (p.closed) tag = "tag_completed";
  else if (p.urgent) tag = "tag_urgent_case";

  return (
    <>
      <div className="wrap" style={{ paddingTop: 22 }}>
        <Link className="backbtn" href="/patients"><T k="back_list" /></Link>
      </div>

      <div className="wrap detail">
        <div className="dmain">
          <div className="dhero">
            <div className="banner" style={{ background: patientGradient(p.id) }}>
              {p.init}
              <span className={`tag ${p.urgent && !p.closed ? "urgent" : ""}`}><T k={tag} /></span>
            </div>
            <div className="body">
              <h2>{p.name}</h2>
              <div className="regline">
                <span className="vbadge"><T k="verified_patient" /></span>
                <span className="reg">{p.reg}</span>
                <span className="pmeta"><T k="checked_line" /></span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: ".98rem" }}>{p.story}</p>
              <div className="facts">
                <div className="fact"><span><T k="fact_condition" /></span><b>{p.disease}</b></div>
                <div className="fact"><span><T k="fact_hospital" /></span><b>{p.hospital}</b></div>
                <div className="fact"><span><T k="fact_doctor" /></span><b>{p.doctor}</b></div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3><T k="docs_h" /></h3>
            <p><T k="docs_p" /></p>
            <DocumentViewer patient={p} />
            <div className="note">
              💡 <T k="docs_note" vars={{ hospital: p.hospital }} />
            </div>
          </div>

          <div className="panel">
            <h3><T k="bank_h" /></h3>
            <p><T k="bank_p" /></p>
            <div className="bankgrid">
              <div className="bank"><span><T k="bank_bank" /></span><b>{p.bank}</b></div>
              <div className="bank"><span><T k="bank_branch" /></span><b>{p.branch}</b></div>
              <div className="bank"><span><T k="bank_holder" /></span><b>{p.name} <span className="vbadge"><T k="matches_nic" /></span></b></div>
              <div className="bank"><span><T k="bank_number" /></span><b>{p.account}</b></div>
            </div>
            <div className="note">
              🛡 <T k="bank_note" />
            </div>
          </div>

          <div className="panel">
            <h3><T k="updates_h" /></h3>
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
            <h3><T k="support_h" /></h3>
            {p.comments.length === 0 && <p style={{ padding: "10px 0" }}><T k="support_first" /></p>}
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
              <div className="av" style={{ background: "var(--blue)" }}><T k="support_you" /></div>
              <Link className="cin" href="/login"><T k="support_write" /></Link>
            </div>
          </div>
        </div>

        <aside className="drail">
          <DonateBox patient={p} />
          <div className="trust-box">
            <h4><T k="trust_h" /></h4>
            <div className="tstep"><span className="ok">✓</span><span><b><T k="trust_ai_b" /></b> <T k="trust_ai" /></span></div>
            <div className="tstep"><span className="ok">✓</span><span><b><T k="trust_human_b" /></b> <T k="trust_human" /></span></div>
            <div className="tstep"><span className="ok">✓</span><span><b><T k="trust_hosp_b" /></b> <T k="trust_hosp" vars={{ hospital: p.hospital.split(",")[0] }} /></span></div>
            <div className="tstep"><span className="ok">✓</span><span><b><T k="trust_auto_b" /></b> <T k="trust_auto" /></span></div>
          </div>
        </aside>
      </div>
    </>
  );
}