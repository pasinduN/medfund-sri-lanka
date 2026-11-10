// TODO: replace the sample data with fetch() calls once the Spring Boot API is ready

const patients = [
  {
    id: 1, name: "Nimal Perera", init: "NP", disease: "Kidney transplant", hospital: "National Hospital, Colombo",
    doctor: "Dr. S. Wijesinghe", district: "Colombo", need: 2500000, got: 1875000, days: 12, urgent: true, reg: "MED-2026-000145",
    story: "Nimal, a 46-year-old school van driver from Moratuwa, has end-stage kidney disease. A donor kidney has been matched — the family now needs help covering the transplant surgery and first year of anti-rejection medicine.",
  },
  {
    id: 2, name: "Sithmi Jayawardena", init: "SJ", disease: "Leukemia (ALL)", hospital: "Lady Ridgeway Children's Hospital",
    doctor: "Dr. K. Herath", district: "Colombo", need: 3800000, got: 1102000, days: 34, urgent: true, reg: "MED-2026-000158",
    story: "Sithmi is 7 years old and loves drawing elephants. She was diagnosed with acute lymphoblastic leukemia in May. Her chemotherapy is covered, but the family needs support for a bone-marrow procedure and six months of medication.",
  },
  {
    id: 3, name: "Ravi Shanmugam", init: "RS", disease: "Heart bypass surgery", hospital: "Jaffna Teaching Hospital",
    doctor: "Dr. T. Sivakumar", district: "Jaffna", need: 1600000, got: 1600000, days: 0, urgent: false, reg: "MED-2026-000112", closed: true,
    story: "Ravi, a 58-year-old fisherman, needed urgent triple-bypass surgery. Thanks to 214 donors this campaign is fully funded — surgery was completed successfully on 14 July.",
  },
  {
    id: 4, name: "Fathima Rizna", init: "FR", disease: "Spinal surgery", hospital: "Kandy General Hospital",
    doctor: "Dr. M. Bandara", district: "Kandy", need: 1250000, got: 410000, days: 41, urgent: false, reg: "MED-2026-000171",
    story: "Fathima, a 29-year-old teacher, was injured in a bus accident and needs spinal fixation surgery to walk again. Her school community started this campaign with her consent.",
  },
  {
    id: 5, name: "Kusum Dissanayake", init: "KD", disease: "Cancer treatment", hospital: "Apeksha Hospital, Maharagama",
    doctor: "Dr. P. Rathnayake", district: "Colombo", need: 2100000, got: 640000, days: 27, urgent: false, reg: "MED-2026-000176",
    story: "Kusum, 51, is undergoing treatment for breast cancer at Apeksha Hospital. Support is needed for targeted-therapy medication not covered by the free health service.",
  },
  {
    id: 6, name: "Tharindu Silva", init: "TS", disease: "Liver transplant", hospital: "Karapitiya Teaching Hospital",
    doctor: "Dr. H. de Zoysa", district: "Galle", need: 4500000, got: 980000, days: 55, urgent: false, reg: "MED-2026-000180",
    story: "Tharindu, 33, was diagnosed with autoimmune liver failure. His brother has volunteered as a living donor; funds are needed for the transplant and post-operative care.",
  },
];

const urgentNeeds = [
  { icon: "🩸", title: "O− blood needed", text: "for Sithmi's surgery — Lady Ridgeway Children's Hospital.", when: "Needed today", button: "Find O− donors", href: "/donors?q=o−" },
  { icon: "💰", title: "Nimal's kidney transplant", text: "— surgery scheduled, funding still short.", when: "12 days left", button: "Donate", donateId: 1 },
  { icon: "🫁", title: "Recipient needed", text: "— matched kidney must be accepted within the viability window.", when: "~24-hour window", button: "View case", href: "/patients/1" },
];

const urgentDonors = [
  { icon: "🫀", title: "Kidney available — brain-death donor", text: "at National Hospital, Colombo. Time-critical match in progress.", when: "~24-hour window", button: "View kidney pledges", href: "/donors?q=kidney" },
  { icon: "⚡", title: "5 urgent-responder donors", text: "(O−, A+, AB−) on call now in Colombo, Kalutara & Kandy.", when: "On call now", button: "Open directory", href: "/donors?filter=urgent" },
];

export async function getPatients() {
  return patients;
}

export async function getFeaturedPatients(limit = 3) {
  return patients.filter((p) => !p.closed).slice(0, limit);
}

export async function getUrgentBoard() {
  return { needs: urgentNeeds, donors: urgentDonors };
}
