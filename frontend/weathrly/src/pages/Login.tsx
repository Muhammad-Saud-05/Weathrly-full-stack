import { useState } from "react";
import { api } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import { getErrorMessage } from "../utils/errors";
import AuthLayout from "../layouts/AuthLayout";
import FormError from "../components/auth/FormError";
import PasswordInput from "../components/auth/PasswordInput";
import SubmitButton from "../components/auth/SubmitButton";
import { inputClass, labelClass, linkClass } from "../components/auth/authStyles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = res.data?.access_token;

      if (!token) {
        throw new Error("No access token returned from backend");
      }

      setToken(token);

      // redirect to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login failed:", err);

      setError(getErrorMessage(err, "Login failed"));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.022em]">Sign in</h1>
      <p className="mt-2 text-[15px] leading-snug text-slate-700">
        Your forecast, favorites and recent searches.
      </p>

      <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "login-error" : undefined}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <a href="#" className={`text-[13px] ${linkClass}`}>
              Forgot password?
            </a>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            invalid={!!error}
            describedBy={error ? "login-error" : undefined}
          />
        </div>

        <FormError id="login-error" message={error} />

        <SubmitButton submitting={submitting} label="Sign in" busyLabel="Signing in..." />
      </form>

      <p className="mt-7 text-center text-[14px] text-slate-700">
        New to Weathrly?{" "}
        <Link to="/register" className={`font-medium ${linkClass}`}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
