import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { setToken } from "../utils/auth";
import { getErrorMessage } from "../utils/errors";
import AuthLayout from "../layouts/AuthLayout";
import FormError from "../components/auth/FormError";
import PasswordInput from "../components/auth/PasswordInput";
import SubmitButton from "../components/auth/SubmitButton";
import { inputClass, labelClass, linkClass } from "../components/auth/authStyles";
import PasswordHint from "../components/auth/PasswordHint";
import { EMAIL_PATTERN, USERNAME_MAX, USERNAME_MIN, passwordError } from "../utils/validation";
import type { User } from "../types";

type Field = "username" | "email" | "password";
type FieldErrors = Partial<Record<Field, string>>;

function validate(username: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};

  const name = username.trim();
  if (name.length < USERNAME_MIN) errors.username = `Use at least ${USERNAME_MIN} characters.`;
  else if (name.length > USERNAME_MAX) errors.username = `Use ${USERNAME_MAX} characters or fewer.`;

  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address.";

  const problem = passwordError(password);
  if (problem) errors.password = problem;

  return errors;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const errors = validate(username, email, password);
  // a field shows its problem once it has been left, or after the first submit attempt
  const shown = (field: Field) => (touched[field] || submitted ? errors[field] : undefined);
  const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  const describedBy = (field: Field, extra?: string) =>
    [shown(field) ? `${field}-error` : undefined, extra].filter(Boolean).join(" ") || undefined;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitted(true);
    setError("");

    const firstInvalid = (["username", "email", "password"] as Field[]).find((f) => errors[f]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const created = await api.post<User>("/users", {
        username: username.trim(),
        email: email.trim(),
        password,
      });

      // Sign the new user straight in. Use the email as the backend stored it (it normalises
      // the address), since login matches it exactly.
      try {
        const formData = new URLSearchParams();
        formData.append("username", created.data.email);
        formData.append("password", password);

        const res = await api.post("/login", formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        setToken(res.data.access_token);
        navigate("/dashboard", { replace: true });
      } catch (loginErr) {
        // the account exists; let them sign in by hand
        console.error("Automatic sign-in failed:", loginErr);
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Registration failed:", err);

      setError(getErrorMessage(err, "Could not create your account. Check your details and try again."));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.022em]">Create your account</h1>
      <p className="mt-2 text-[15px] leading-snug text-slate-700">
        Check the sky anywhere, and keep your favorite places close.
      </p>

      <form onSubmit={handleRegister} className="mt-8 space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => touch("username")}
            required
            maxLength={USERNAME_MAX + 10}
            placeholder="yourname"
            aria-invalid={shown("username") ? true : undefined}
            aria-describedby={describedBy("username")}
            className={inputClass}
          />
          {shown("username") && (
            <p id="username-error" className="text-[13px] text-[#a30018]">
              {errors.username}
            </p>
          )}
        </div>

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
            onBlur={() => touch("email")}
            required
            placeholder="you@example.com"
            aria-invalid={shown("email") ? true : undefined}
            aria-describedby={describedBy("email")}
            className={inputClass}
          />
          {shown("email") && (
            <p id="email-error" className="text-[13px] text-[#a30018]">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            onBlur={() => touch("password")}
            invalid={!!shown("password")}
            describedBy={describedBy("password", "password-hint")}
          />
          {shown("password") && (
            <p id="password-error" className="text-[13px] text-[#a30018]">
              {errors.password}
            </p>
          )}
          <PasswordHint id="password-hint" password={password} />
        </div>

        <FormError id="register-error" message={error} />

        <SubmitButton submitting={submitting} label="Create account" busyLabel="Creating account..." />
      </form>

      <p className="mt-7 text-center text-[14px] text-slate-700">
        Already have an account?{" "}
        <Link to="/login" className={`font-medium ${linkClass}`}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
