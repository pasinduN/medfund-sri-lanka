// Demo mode: until the Spring Boot backend is ready, accounts live here and in localStorage.
// The role always comes from the account (later the users table), never from the login form.
// TODO: replace each function body with a fetch() to /api/auth/... — the pages won't need to change

export const SESSION_KEY = "medfund-user";
const ACCOUNTS_KEY = "medfund-accounts";

export const DEMO_OTP = "123456";
export const DEMO_PASSWORD = "demo1234";

export const DEMO_ACCOUNTS = [
  { id: "u1", name: "Kamal Rathnayake", email: "kamal@demo.lk", phone: "0771234567", role: "donor", donorId: 1 },
  { id: "u2", name: "Nimal Perera", email: "nimal@demo.lk", phone: "0712345678", role: "patient", patientId: 1 },
  { id: "u3", name: "MedFund Admin", email: "admin@medfund.lk", phone: "0700000000", role: "admin" },
];

// "+94 77 123 4567", "077-1234567" and "0771234567" all become "0771234567"
export function normalisePhone(value) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("94")) digits = "0" + digits.slice(2);
  return digits;
}

export const isMobileNumber = (value) => /^07\d{8}$/.test(normalisePhone(value));

function savedAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) ?? [];
  } catch {
    return [];
  }
}

const allAccounts = () => [...DEMO_ACCOUNTS, ...savedAccounts()];
const findByPhone = (phone) => allAccounts().find((a) => a.phone === normalisePhone(phone));
const findByEmail = (email) => allAccounts().find((a) => a.email === email.trim().toLowerCase());

// a short pause so buttons show "Please wait…" like they will with a real server
const wait = () => new Promise((resolve) => setTimeout(resolve, 400));

// Errors are i18n keys, so the form can show them in the visitor's language
export async function sendOtp(phone) {
  await wait();
  if (!isMobileNumber(phone)) throw new Error("err_phone_format");
  if (!findByPhone(phone)) throw new Error("err_no_account");
}

export async function verifyOtp(phone, code) {
  await wait();
  const account = findByPhone(phone);
  if (!account || code !== DEMO_OTP) throw new Error("err_bad_code");
  return account;
}

export async function loginWithEmail(email, password) {
  await wait();
  const account = findByEmail(email);
  if (!account || password !== DEMO_PASSWORD) throw new Error("err_bad_login");
  return account;
}

export async function register({ name, email, phone, role }) {
  await wait();
  if (!isMobileNumber(phone)) throw new Error("err_phone_format");
  if (findByEmail(email)) throw new Error("err_email_taken");
  if (findByPhone(phone)) throw new Error("err_phone_taken");

  // the password is not stored in demo mode — the backend will hash it
  const account = {
    id: `u${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: normalisePhone(phone),
    role,
  };
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...savedAccounts(), account]));
  } catch {
    // storage blocked — the account works until the tab is closed
  }
  return account;
}