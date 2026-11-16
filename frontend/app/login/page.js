import LoginForm from "@/components/LoginForm";
import T from "@/components/T";

export const metadata = {
  title: "Log in — MedFund Sri Lanka",
};

export default function LoginPage() {
  return (
    <div className="auth">
      <div className="panel">
        <h2><T k="login_title" /></h2>
        <p style={{ marginBottom: 18 }}><T k="login_sub" /></p>
        <LoginForm />
      </div>
    </div>
  );
}