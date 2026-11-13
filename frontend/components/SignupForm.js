"use client";

import { useState } from "react";
import Link from "next/link";

const ROLES = [
  { value: "donor", label: "🤝 Donor", hint: "Give money, blood or a pledge" },
  { value: "patient", label: "🏥 Patient / family", hint: "Start a campaign for treatment" },
];

export default function SignupForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (form.get("password").length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.get("password") !== form.get("confirm")) {
      setError("Passwords don't match.");
      return;
    }

    setError("");
    // TODO: POST /api/auth/register once the backend is ready
    setDone(true);
  };

  if (done) {
    return (
      <div className="success">
        <div className="ring">✓</div>
        <h3>Account created</h3>
        <p>This is a preview — accounts will be saved once the backend is connected.</p>
        <Link className="btn btn-blue" href="/login">Go to log in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="formgrid">
      <div className="field">
        <label>I want to join as</label>
        <div className="role-pick">
          {ROLES.map((r) => (
            <label key={r.value}>
              <input type="radio" name="role" value={r.value} defaultChecked={r.value === "donor"} />
              {r.label}
              <span>{r.hint}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="field"><label>Full name</label><input name="fullName" required autoComplete="name" placeholder="Your name" /></div>
      <div className="field"><label>Email</label><input name="email" type="email" required autoComplete="email" placeholder="name@email.com" /></div>
      <div className="field"><label>Phone</label><input name="phone" type="tel" required autoComplete="tel" placeholder="07X XXX XXXX" /></div>
      <div className="field"><label>Password</label><input name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" /></div>
      <div className="field"><label>Confirm password</label><input name="confirm" type="password" required autoComplete="new-password" placeholder="Type it again" /></div>

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="btn btn-green btn-big">Create account</button>

      <div className="auth-links">
        <span>Already have an account? <Link href="/login">Log in</Link></span>
      </div>
    </form>
  );
}