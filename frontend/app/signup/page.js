import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "Create an account — MedFund Sri Lanka",
};

export default function SignupPage() {
  return (
    <div className="auth">
      <div className="panel">
        <h2>Create your account</h2>
        <p style={{ marginBottom: 18 }}>Free for donors and patients. Your phone number is never shown publicly.</p>
        <SignupForm />
      </div>
    </div>
  );
}