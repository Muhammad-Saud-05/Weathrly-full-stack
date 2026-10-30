import { useState } from "react";
import { isAxiosError } from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/axios";
import { getErrorMessage } from "../utils/errors";
import { passwordError } from "../utils/validation";
import AuthLayout from "../layouts/AuthLayout";
import FormError from "../components/auth/FormError";
import PasswordHint from "../components/auth/PasswordHint";
import PasswordInput from "../components/auth/PasswordInput";
import StatusPanel from "../components/auth/StatusPanel";
import SubmitButton from "../components/auth/SubmitButton";
import { labelClass, linkClass, primaryButtonClass } from "../components/auth/authStyles";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  // the backend rejected the link: it's expired, already used, or not ours
  const [linkProblem, setLinkProblem] = useState("");

  const problem = passwordError(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !token) return;

    setTouched(true);
    setError("");

    if (problem) {
      document.getElementById("password")?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      console.error("Password reset failed:", err);

      // a 400 means the link itself is no good, so a retry can't help
      if (isAxiosError(err) && err.response?.status === 400) {
        setLinkProblem(getErrorMessage(err, "This reset link is invalid or has expired."));
      } else {
        setError(getErrorMessage(err, "Could not update your password. Please try again."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <AuthLayout>
        <StatusPanel
          icon="check"
          title="Password updated"
          actions={
            <Link to="/login" className={primaryButtonClass}>
              Sign in
            </Link>
          }
        >
          You can now sign in with your new password.
        </StatusPanel>
      </AuthLayout>
    );
  }

  if (!token || linkProblem) {
    return (
      <AuthLayout>
        <StatusPanel
          icon="alert"
          title="This link can't be used"
          actions={
            <>
              <Link to="/forgot-password" className={primaryButtonClass}>
                Send a new link
              </Link>
              <p className="text-center text-[14px] text-slate-700">
                <Link to="/login" className={`font-medium ${linkClass}`}>
                  Back to sign in
                </Link>
              </p>
            </>
          }
        >
          {linkProblem || "It may have expired or already been used. Reset links work once and for a short time."}
        </StatusPanel>
      </AuthLayout>
    );
  }

  const showProblem = touched && problem;

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.022em]">Choose a new password</h1>
      <p className="mt-2 text-[15px] leading-snug text-slate-700">
        Pick something you haven't used here before.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="password" className={labelClass}>
            New password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="New password"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched(true)}
            invalid={!!showProblem}
            describedBy={showProblem ? "password-error password-hint" : "password-hint"}
          />
          {showProblem && (
            <p id="password-error" className="text-[13px] text-[#a30018]">
              {problem}
            </p>
          )}
          <PasswordHint id="password-hint" password={password} />
        </div>

        <FormError id="reset-error" message={error} />

        <SubmitButton submitting={submitting} label="Update password" busyLabel="Updating..." />
      </form>

      <p className="mt-7 text-center text-[14px] text-slate-700">
        <Link to="/login" className={`font-medium ${linkClass}`}>
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
