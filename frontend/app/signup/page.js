import SignupForm from "@/components/SignupForm";
import T from "@/components/T";

export const metadata = {
  title: "Create an account — MedFund Sri Lanka",
};

export default function SignupPage() {
  return (
    <div className="auth">
      <div className="panel">
        <h2><T k="signup_title" /></h2>
        <p style={{ marginBottom: 18 }}><T k="signup_sub" /></p>
        <SignupForm />
      </div>
    </div>
  );
}