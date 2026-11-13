"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/login and store the JWT once the Spring Boot backend is ready
    setMessage("Login will work once the backend is connected. This is a preview of the screen.");
  };

  return (
    <form onSubmit={handleSubmit} className="formgrid">
      <div className="field">
        <label>Email or phone</label>
        <input name="username" required autoComplete="username" placeholder="name@email.com or 07X XXX XXXX" />
      </div>
      <div className="field">
        <label>Password</label>
        <input name="password" type="password" required autoComplete="current-password" placeholder="Your password" />
      </div>

      {message && <div className="form-info">{message}</div>}

      <button type="submit" className="btn btn-blue btn-big">Log in</button>

      <div className="auth-links">
        <a>Forgot password?</a>
        <span>New here? <Link href="/signup">Create an account</Link></span>
      </div>
    </form>
  );
}