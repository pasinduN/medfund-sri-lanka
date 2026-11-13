export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "தமிழ்" },
];

// Keys with HTML (<br>, <span class="hl">) are rendered with <T k="..." html />
export const dictionary = {
  nav_patients: { en: "Patients", si: "රෝගීන්", ta: "நோயாளிகள்" },
  nav_donors: { en: "Donor directory", si: "දායකයින්", ta: "கொடையாளர்கள்" },
  nav_regdonor: { en: "Register as donor", si: "දායකයෙක් වන්න", ta: "தானம் செய்ய" },
  nav_how: { en: "How it works", si: "ක්‍රියාවලිය", ta: "செயல்முறை" },
  nav_login: { en: "Log in", si: "පිවිසෙන්න", ta: "உள்நுழைக" },
  reg_patient: { en: "＋ Register patient", si: "＋ රෝගී ලියාපදිංචිය", ta: "＋ நோயாளர் பதிவு" },
  donate_now: { en: "Donate now", si: "දැන් පරිත්‍යාග කරන්න", ta: "இப்போது நன்கொடை" },

  eyebrow: {
    en: "Every campaign verified before it goes live",
    si: "සෑම අරමුදල් රැස් කිරීමේ වැඩසටහනක්ම ප්‍රසිද්ධ කිරීමට පෙර සත්‍යාපනය කරනු ලැබේ",
    ta: "ஒவ்வொரு பிரச்சாரமும் வெளியீட்டிற்கு முன் சரிபார்க்கப்படுகிறது",
  },
  h1: {
    en: 'Help a verified patient<br>get the treatment<br>they <span class="hl">can\'t afford alone</span>.',
    si: 'සත්‍යාපිත රෝගියෙකුට<br>තනිව දරාගත නොහැකි<br><span class="hl">ප්‍රතිකාර සඳහා ඔබේ සහාය</span><br>ලබා දෙන්න.',
    ta: 'சரிபார்க்கப்பட்ட நோயாளிக்கு<br>தனியாக செலவழிக்க முடியாத<br><span class="hl">சிகிச்சையைப் பெற</span><br>உதவுங்கள்.',
  },
  sub: {
    en: "MedFund lists only patients whose medical documents have been AI-checked and approved by our review team. Your donation goes to the platform's audited account — never to an unverified personal number.",
    si: "MedFund වේදිකාවේ ලැයිස්තුගත කරනු ලබන්නේ වෛද්‍ය ලේඛන AI තාක්ෂණය මගින් පරීක්ෂා කර, අපගේ සමාලෝචන කණ්ඩායමේ අනුමැතිය ලැබූ රෝගීන් පමණි. ඔබ ලබා දෙන පරිත්‍යාග මුදල් බැර වන්නේ විගණනයට ලක් කළ වේදිකාවේ නිල ගිණුමට පමණි. කිසිවිටෙකත් සත්‍යාපනය නොකළ පුද්ගලික ගිණුම් අංකයකට නොවේ.",
    ta: "AI சரிபார்ப்பும் எங்கள் குழுவின் ஒப்புதலும் பெற்ற நோயாளிகள் மட்டுமே MedFund இல் பட்டியலிடப்படுவர். உங்கள் நன்கொடை தணிக்கை செய்யப்பட்ட தள கணக்கிற்கே செல்லும் — சரிபார்க்கப்படாத தனிநபர் கணக்கிற்கு அல்ல.",
  },
  browse: { en: "Browse patients", si: "රෝගීන් බලන්න", ta: "நோயாளிகளை காண்க" },
  reg_a_patient: { en: "＋ Register a patient", si: "＋ රෝගියෙකු ලියාපදිංචි කරන්න", ta: "＋ நோயாளியை பதிவு செய்க" },
  how_verif: { en: "How verification works", si: "සත්‍යාපනය සිදුවන ආකාරය", ta: "சரிபார்ப்பு எப்படி நடக்கிறது" },
  trust1: { en: "raised to date", si: "මෙතෙක් රැස් කළ මුදල", ta: "இதுவரை திரட்டியது" },
  trust2: { en: "campaigns completed", si: "සාර්ථකව අවසන් කළ අරමුදල් රැස් කිරීමේ වැඩසටහන්", ta: "நிறைவடைந்த பிரச்சாரங்கள்" },
  trust3: { en: "blood donors registered", si: "ලියාපදිංචි රුධිර දායකයින්", ta: "பதிவு செய்த இரத்த கொடையாளர்" },
  trust4: { en: "documents human-reviewed", si: "මිනිසුන් විසින් සමාලෝචිත ලේඛන", ta: "மனித சரிபார்ப்பு ஆவணங்கள்" },
  live_don: { en: "Live donations", si: "සජීවී පරිත්‍යාග", ta: "நேரடி நன்கொடைகள்" },

  uneed_h: { en: "🚨 Urgent needs", si: "🚨 හදිසි අවශ්‍යතා", ta: "🚨 அவசர தேவைகள்" },
  uneed_sub: { en: "patients waiting for help right now", si: "දැන් උදව් බලාපොරොත්තුවෙන් සිටින රෝගීන්", ta: "இப்போது உதவிக்காக காத்திருக்கும் நோயாளிகள்" },
  ugive_h: { en: "⚡ Urgent donors", si: "⚡ හදිසි දායකයින්", ta: "⚡ அவசர நன்கொடையாளர்கள்" },
  ugive_sub: { en: "ready to give right now", si: "දැන් දීමට සූදානම්", ta: "இப்போது வழங்க தயார்" },
  pill_need: { en: "URGENT NEED", si: "හදිසි අවශ්‍යතාව", ta: "அவசர தேவை" },
  pill_give: { en: "URGENT DONOR", si: "හදිසි දායකයා", ta: "அவசர நன்கொடையாளர்" },

  feat: { en: "Patients who need help now", si: "දැන් උදව් අවශ්‍ය රෝගීන්", ta: "இப்போது உதவி தேவைப்படும் நோயாளிகள்" },
  seeall: { en: "See all patients →", si: "සියලුම රෝගීන් බලන්න →", ta: "அனைத்தையும் காண்க →" },
  how_t: { en: "How a campaign earns its badge", si: "අරමුදල් රැස් කිරීමේ වැඩසටහනක් සත්‍යාපිත ලාංඡනයක් ලබා ගන්නා ආකාරය", ta: "பிரச்சாரம் அடையாளம் பெறும் விதம்" },
  s1b: { en: "Patient applies", si: "රෝගියා අයදුම් කරයි", ta: "நோயாளி விண்ணப்பிக்கிறார்" },
  s1p: {
    en: "Uploads medical reports, hospital letters, cost estimate and GN certificate.",
    si: "වෛද්‍ය වාර්තා, රෝහල් ලිපි, වියදම් ඇස්තමේන්තුව සහ GN සහතිකය උඩුගත කරයි.",
    ta: "மருத்துவ அறிக்கைகள், மருத்துவமனை கடிதங்கள், செலவு மதிப்பீடு, GN சான்றிதழ் பதிவேற்றம்.",
  },
  s2b: { en: "AI document check", si: "AI ලේඛන පරීක්ෂාව", ta: "AI ஆவண சரிபார்ப்பு" },
  s2p: {
    en: "OCR and forgery detection flag stamps, signatures, duplicates and edited images.",
    si: "මුද්‍රා, අත්සන්, අනුපිටපත් සහ සංස්කරණය කළ රූප AI මගින් හඳුනා ගැනේ.",
    ta: "முத்திரைகள், கையொப்பங்கள், நகல்கள், திருத்தப்பட்ட படங்களை AI கண்டறியும்.",
  },
  s3b: { en: "Human approval", si: "මානව අනුමැතිය", ta: "மனித ஒப்புதல்" },
  s3p: {
    en: "Our admin team reviews every AI result. No campaign auto-approves itself.",
    si: "සෑම AI ප්‍රතිඵලයක්ම පරිපාලක කණ්ඩායම විසින් සමාලෝචනය කෙරේ.",
    ta: "ஒவ்வொரு AI முடிவையும் நிர்வாகக் குழு மதிப்பாய்வு செய்யும்.",
  },
  s4b: { en: "Funds disbursed", si: "අරමුදල් නිකුත් කිරීම", ta: "நிதி வழங்கல்" },
  s4p: {
    en: "Donations sit in MedFund's audited account and are paid to the hospital or patient with receipts.",
    si: "පරිත්‍යාග මුදල් MedFund හි විගණනයට ලක් කළ නිල ගිණුමේ සුරක්ෂිතව තැන්පත් කර තබන අතර, අදාළ රිසිට්පත් සහිතව රෝහලට හෝ රෝගියාට ලබා දෙනු ලැබේ.",
    ta: "நன்கொடைகள் தணிக்கை கணக்கில் இருந்து ரசீதுகளுடன் மருத்துவமனை அல்லது நோயாளிக்கு வழங்கப்படும்.",
  },

  blood_h: { en: "Become a blood donor", si: "රුධිර දායකයෙක් වන්න", ta: "இரத்த தானம் செய்பவராகுங்கள்" },
  blood_p: {
    en: "Register your blood group and district. Hospitals and patients reach you through MedFund — your phone number stays private.",
    si: "ඔබේ රුධිර වර්ගය සහ දිස්ත්‍රික්කය ලියාපදිංචි කරන්න. ඔබේ දුරකථන අංකය රහසිගතව තැබේ.",
    ta: "உங்கள் இரத்த வகையும் மாவட்டமும் பதிவு செய்யுங்கள். உங்கள் தொலைபேசி எண் தனிப்பட்டதாகவே இருக்கும்.",
  },
  blood_btn: { en: "Register as donor", si: "ලියාපදිංචි වන්න", ta: "பதிவு செய்க" },
  organ_h: { en: "Organ donation pledge", si: "අවයව පරිත්‍යාග කිරීමේ ප්‍රතිඥාව", ta: "உறுப்பு தான உறுதிமொழி" },
  organ_p: {
    en: "Record your intent to donate. MedFund is a pledge registry — actual donation and allocation happen only through licensed hospitals under Sri Lankan law.",
    si: "ඔබගේ අවයව පරිත්‍යාග කිරීමේ කැමැත්ත මෙහි සටහන් කරන්න. MedFund යනු අවයව පරිත්‍යාග කිරීමේ කැමැත්ත ලියාපදිංචි කරන වේදිකාවකි. සැබෑ අවයව පරිත්‍යාග කිරීම සහ ඒවා අවශ්‍ය පුද්ගලයන් වෙත ලබා දීම සිදු කරනු ලබන්නේ ශ්‍රී ලංකාවේ නීතිවලට අනුකූලව බලපත්‍රලාභී රෝහල් හරහා පමණි.",
    ta: "உங்கள் நோக்கத்தை பதிவு செய்யுங்கள். உண்மையான தானம் உரிமம் பெற்ற மருத்துவமனைகள் மூலமாகவே நடக்கும்.",
  },
  organ_btn: { en: "Record my pledge", si: "මගේ අවයව පරිත්‍යාග කිරීමේ කැමැත්ත සටහන් කරන්න", ta: "உறுதிமொழியை பதிவு செய்க" },

  all_patients: { en: "All patients", si: "සියලුම රෝගීන්", ta: "அனைத்து நோயாளிகள்" },
  dir_title: { en: "Donor directory", si: "රුධිර සහ අවයව දායක නාමාවලිය", ta: "நன்கொடையாளர் பட்டியல்" },
  apply_title: { en: "Patient application — start a campaign", si: "රෝගී අයදුම්පත — අරමුදල් රැස් කිරීමේ වැඩසටහනක් ආරම්භ කරන්න", ta: "நோயாளர் விண்ணப்பம் — பிரச்சாரம் தொடங்கு" },
  back_home: { en: "← Back to home", si: "← මුල් පිටුවට", ta: "← முகப்புக்கு" },
  back_list: { en: "← Back to patient list", si: "← රෝගී ලැයිස්තුවට", ta: "← நோயாளர் பட்டியலுக்கு" },
  reg_donor_btn: { en: "+ Register as a donor", si: "+ දායකයෙකු ලෙස ලියාපදිංචි වන්න", ta: "+ நன்கொடையாளராக பதிவு" },
  donor_dir_btn: { en: "Donor directory →", si: "දායක නාමාවලිය →", ta: "நன்கொடையாளர் பட்டியல் →" },

  f_platform: { en: "Platform", si: "වේදිකාව", ta: "தளம்" },
  f_donate: { en: "Donate", si: "පරිත්‍යාග", ta: "நன்கொடை" },
  f_legal: { en: "Legal", si: "නීතිමය තොරතුරු", ta: "சட்டம்" },

  search_ph: { en: "Search by name, disease or hospital…", si: "නම, රෝගය හෝ රෝහල අනුව සොයන්න…", ta: "பெயர், நோய் அல்லது மருத்துவமனை மூலம் தேடுங்கள்…" },
  dsearch_ph: { en: "Search by district… (e.g. Kalutara) or blood group", si: "දිස්ත්‍රික්කය හෝ රුධිර වර්ගය අනුව සොයන්න… (උදා: කළුතර)", ta: "மாவட்டம் அல்லது இரத்த வகை மூலம் தேடுங்கள்…" },

  verified: { en: "✓ Verified", si: "✓ සත්‍යාපනය කර ඇත", ta: "✓ சரிபார்க்கப்பட்டது" },
  donate: { en: "Donate", si: "පරිත්‍යාග කරන්න", ta: "நன்கொடை" },
  view_story: { en: "View story", si: "සම්පූර්ණ විස්තර බලන්න", ta: "கதையை காண்க" },
  raised: { en: "raised", si: "රැස් වී ඇත", ta: "திரட்டப்பட்டது" },
  of_: { en: "of", si: "ඉලක්කය", ta: "இலக்கு" },
  days_left: { en: "{n} days left", si: "දින {n}ක් ඉතිරියි", ta: "{n} நாட்கள் மீதம்" },
  urgent: { en: "Urgent", si: "හදිසි අවශ්‍යතාවක්", ta: "அவசரம்" },
  completed: { en: "Completed", si: "සාර්ථකව අවසන් කර ඇත", ta: "நிறைவு" },
  urg_resp: { en: "⚡ Urgent responder", si: "⚡ කඩිනම් සහායක", ta: "⚡ அவசர பதிலளிப்பவர்" },
  nonurg: { en: "Non-urgent", si: "හදිසි නොවන", ta: "அவசரமற்ற" },
  avail: { en: "Available", si: "ලබා ගත හැක", ta: "கிடைக்கிறது" },
  cooldown: { en: "Recently donated", si: "මෑතකදී පරිත්‍යාග කළා", ta: "சமீபத்தில் தானம் செய்தார்" },
  req_contact: { en: "Request contact", si: "සම්බන්ධ වීමට ඉල්ලන්න", ta: "தொடர்பு கோரிக்கை" },
};

export function translate(key, lang) {
  const entry = dictionary[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}