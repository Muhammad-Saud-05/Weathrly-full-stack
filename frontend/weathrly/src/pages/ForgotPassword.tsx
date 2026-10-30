import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { getErrorMessage } from "../utils/errors";
import { EMAIL_PATTERN } from "../utils/validation";
import AuthLayout from "../layouts/AuthLayout";
import FormError from "../components/auth/FormError";
import StatusPanel from "../components/auth/StatusPanel";
import SubmitButton from "../components/auth/SubmitButton";
import {
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../components/auth/authStyles";

// Keep in step with RESET_TOKEN_EXPIRE_MINUTES on the backend (core/jwt.py)
const LINK_MINUTES = 30;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // the address a link was requested for; set once the request has gone through
  const [sentTo, setSentTo] = useState<string | null>(null);

  const emailProblem = EMAIL_PATTERN.test(email.trim()) ? undefined : "Enter a valid email address.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setTouched(true);
    setError("");

    if (emailProblem) {
      document.getElementById("email")?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/forgot-password", { email: email.trim() });
      setSentTo(email.trim());
    } catch (err) {
      console.error("Password reset request failed:", err);
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <AuthLayout>
        <StatusPanel
          icon="mail"
          title="Check your email"
          actions={
            <>
              <Link to="/login" className={primaryButtonClass}>
                Back to sign in
              </Link>
              <button type="button" onClick={() => setSentTo(null)} className={secondaryButtonClass}>
                Use a different email
              </button>
            </>
          }
        >
          <p>
            If an account exists for <strong className="font-semibold text-slate-900">{sentTo}</strong>, a link to
            reset your password is on its way. It works for {LINK_MINUTES} minutes.
          </p>
          <p className="mt-3">Nothing there? Check your spam folder.</p>
        </StatusPanel>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.022em]">Forgot your password?</h1>
      <p className="mt-2 text-[15px] leading-snug text-slate-700">
        Enter your email and we'll send you a link to choose a new one.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
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
            onBlur={() => setTouched(true)}
            required
            placeholder="you@example.com"
            aria-invalid={touched && emailProblem ? true : undefined}
            aria-describedby={touched && emailProblem ? "email-error" : undefined}
            className={inputClass}
          />
          {touched && emailProblem && (
            <p id="email-error" className="text-[13px] text-[#a30018]">
              {emailProblem}
            </p>
          )}
        </div>

        <FormError id="forgot-error" message={error} />

        <SubmitButton submitting={submitting} label="Send reset link" busyLabel="Sending..." />
      </form>

      <p className="mt-7 text-center text-[14px] text-slate-700">
        Remembered it?{" "}
        <Link to="/login" className={`font-medium ${linkClass}`}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
