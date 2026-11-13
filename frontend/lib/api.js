// TODO: replace the sample data with fetch() calls once the Spring Boot API is ready

const patients = [
  {
    id: 1, name: "Nimal Perera", init: "NP", disease: "Kidney transplant", hospital: "National Hospital, Colombo",
    doctor: "Dr. S. Wijesinghe", district: "Colombo", need: 2500000, got: 1875000, days: 12, urgent: true, reg: "MED-2026-000145",
    story: "Nimal, a 46-year-old school van driver from Moratuwa, has end-stage kidney disease. A donor kidney has been matched — the family now needs help covering the transplant surgery and first year of anti-rejection medicine.",
        bank: "Bank of Ceylon", branch: "Moratuwa",
    updates: [
      ["18 Jul 2026", "Surgery date confirmed", "The transplant unit has scheduled surgery for 22 August, pending full funding."],
      ["02 Jul 2026", "Donor match found", "A compatible living donor (family member) cleared final screening."],
      ["15 Jun 2026", "Campaign verified", "Documents AI-checked and approved by the MedFund review team."],
    ],
    comments: [
      ["Ishara F.", "Wishing you a fast recovery, Nimal aiya. Donated what I could. ❤️"],
      ["Anonymous", "My father went through this in 2023. Stay strong — it gets better."],
    ],
  },
  {
    id: 2, name: "Sithmi Jayawardena", init: "SJ", disease: "Leukemia (ALL)", hospital: "Lady Ridgeway Children's Hospital",
    doctor: "Dr. K. Herath", district: "Colombo", need: 3800000, got: 1102000, days: 34, urgent: true, reg: "MED-2026-000158",
    story: "Sithmi is 7 years old and loves drawing elephants. She was diagnosed with acute lymphoblastic leukemia in May. Her chemotherapy is covered, but the family needs support for a bone-marrow procedure and six months of medication.",
        bank: "People's Bank", branch: "Borella",
    updates: [
      ["20 Jul 2026", "Round 2 chemo completed", "Sithmi responded well and is back home resting."],
      ["28 Jun 2026", "Campaign verified", "Approved after hospital confirmation."],
    ],
    comments: [["W. Gunasekara", "Donated. Get well soon, little artist! 🐘"]],
  },
  {
    id: 3, name: "Ravi Shanmugam", init: "RS", disease: "Heart bypass surgery", hospital: "Jaffna Teaching Hospital",
    doctor: "Dr. T. Sivakumar", district: "Jaffna", need: 1600000, got: 1600000, days: 0, urgent: false, reg: "MED-2026-000112", closed: true,
    story: "Ravi, a 58-year-old fisherman, needed urgent triple-bypass surgery. Thanks to 214 donors this campaign is fully funded — surgery was completed successfully on 14 July.",
        bank: "Commercial Bank", branch: "Jaffna", donors: 214,
    updates: [
      ["16 Jul 2026", "Campaign completed 🎉", "Goal reached. Donations closed automatically and funds released to the hospital."],
      ["14 Jul 2026", "Surgery successful", "Ravi is recovering in the cardiac ward."],
    ],
    comments: [["Anonymous", "So happy to see this one complete!"]],
  },
  {
    id: 4, name: "Fathima Rizna", init: "FR", disease: "Spinal surgery", hospital: "Kandy General Hospital",
    doctor: "Dr. M. Bandara", district: "Kandy", need: 1250000, got: 410000, days: 41, urgent: false, reg: "MED-2026-000171",
    story: "Fathima, a 29-year-old teacher, was injured in a bus accident and needs spinal fixation surgery to walk again. Her school community started this campaign with her consent.",
        bank: "Sampath Bank", branch: "Kandy City",
    updates: [["10 Jul 2026", "Campaign verified", "Hospital cost estimate confirmed by the review team."]],
    comments: [["Staff of Zahira College", "We are with you, Ms. Rizna."]],
  },
  {
    id: 5, name: "Kusum Dissanayake", init: "KD", disease: "Cancer treatment", hospital: "Apeksha Hospital, Maharagama",
    doctor: "Dr. P. Rathnayake", district: "Colombo", need: 2100000, got: 640000, days: 27, urgent: false, reg: "MED-2026-000176",
    story: "Kusum, 51, is undergoing treatment for breast cancer at Apeksha Hospital. Support is needed for targeted-therapy medication not covered by the free health service.",
        bank: "HNB", branch: "Maharagama",
    updates: [["05 Jul 2026", "Campaign verified", "Oncologist's recommendation letter confirmed."]],
    comments: [],
  },
  {
    id: 6, name: "Tharindu Silva", init: "TS", disease: "Liver transplant", hospital: "Karapitiya Teaching Hospital",
    doctor: "Dr. H. de Zoysa", district: "Galle", need: 4500000, got: 980000, days: 55, urgent: false, reg: "MED-2026-000180",
    story: "Tharindu, 33, was diagnosed with autoimmune liver failure. His brother has volunteered as a living donor; funds are needed for the transplant and post-operative care.",
        bank: "BOC", branch: "Galle Fort",
    updates: [["01 Jul 2026", "Campaign verified", "All eight documents cleared AI check and admin review."]],
    comments: [],
  },
];

const donors = [
  { id: 1, name: "Kamal Rathnayake", type: "Blood", group: "O−", district: "Colombo", available: true, urgent: true },
  { id: 2, name: "Dinesh Madushanka", type: "Blood", group: "A+", district: "Kalutara", available: true, urgent: true },
  { id: 3, name: "Priya Sivarajah", type: "Blood", group: "B+", district: "Jaffna", available: true, urgent: false },
  { id: 4, name: "Sanduni Weerasinghe", type: "Blood", group: "O+", district: "Galle", available: false, urgent: false },
  { id: 5, name: "M. Rifkhan", type: "Blood", group: "AB−", district: "Kandy", available: true, urgent: true },
  { id: 6, name: "Chathura Bandara", type: "Blood", group: "O−", district: "Kalutara", available: true, urgent: false },
  { id: 7, name: "Nadeesha Kumari", type: "Organ pledge", group: "O+", district: "Kalutara", organ: "Kidney", available: true, urgent: true },
  { id: 8, name: "S. Thavarajah", type: "Organ pledge", group: "B+", district: "Colombo", organ: "Cornea", available: true, urgent: false },
  { id: 9, name: "Ruwan Jayasooriya", type: "Organ pledge", group: "A−", district: "Kurunegala", organ: "Bone marrow", available: true, urgent: true },
  { id: 10, name: "Anonymous pledge", type: "Organ pledge", group: "O+", district: "Gampaha", organ: "Any — after life", available: true, urgent: false },
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

patients.forEach((p) => {
  p.account = `78${p.id}4 52•• ••${30 + p.id}`;
});

export async function getPatients() {
  return patients;
}

export async function getPatient(id) {
  return patients.find((p) => p.id === Number(id)) ?? null;
}

export async function getFeaturedPatients(limit = 3) {
  return patients.filter((p) => !p.closed).slice(0, limit);
}

export async function getUrgentBoard() {
  return { needs: urgentNeeds, donors: urgentDonors };
}

export async function getDonors() {
  return donors;
}

const applications = [
  {
    id: "MED-2026-PENDING-0192", name: "Saman Kumara", disease: "Kidney failure", hospital: "Teaching Hospital, Kurunegala",
    district: "Kurunegala", need: 1800000, urgent: true, submitted: "09 Nov 2026",
    checks: { stamp: "pass", signature: "pass", duplicate: "pass", edits: "pass" },
  },
  {
    id: "MED-2026-PENDING-0189", name: "Hiruni Fernando", disease: "Congenital heart defect", hospital: "Lady Ridgeway Children's Hospital",
    district: "Gampaha", need: 3200000, urgent: true, submitted: "08 Nov 2026",
    checks: { stamp: "pass", signature: "pass", duplicate: "pass", edits: "warn" },
  },
  {
    id: "MED-2026-PENDING-0185", name: "K. Rajendran", disease: "Cataract surgery", hospital: "Batticaloa Teaching Hospital",
    district: "Batticaloa", need: 240000, urgent: false, submitted: "06 Nov 2026",
    checks: { stamp: "pass", signature: "warn", duplicate: "pass", edits: "pass" },
  },
  {
    id: "MED-2026-PENDING-0181", name: "Unknown applicant", disease: "Cancer treatment", hospital: "Apeksha Hospital, Maharagama",
    district: "Colombo", need: 5000000, urgent: false, submitted: "05 Nov 2026",
    checks: { stamp: "fail", signature: "warn", duplicate: "fail", edits: "warn" },
  },
];

export async function getPendingApplications() {
  return applications;
}
