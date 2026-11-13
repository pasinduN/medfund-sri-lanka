import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Log in — MedFund Sri Lanka",
};

export default function LoginPage() {
  return (
    <div className="auth">
      <div className="panel">
        <h2>Welcome back</h2>
        <p style={{ marginBottom: 18 }}>Log in to donate faster, follow campaigns and leave messages of support.</p>
        <LoginForm />
      </div>
    </div>
  );
}