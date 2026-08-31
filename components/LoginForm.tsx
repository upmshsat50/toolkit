"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ setupMissing = false, nextPath }: { setupMissing?: boolean; nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Supabase is not configured yet. Add the two NEXT_PUBLIC_SUPABASE environment variables in Vercel first.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace(nextPath && nextPath.startsWith("/") ? nextPath : "/dashboard");
    router.refresh();
  }

  return (
    <div className="login-card">
      <div className="login-card-header">
        <span className="eyebrow">Authorized access</span>
        <h2>Welcome back</h2>
        <p>Sign in to continue to the UPM-SHS Community Health Toolkit.</p>
      </div>

      {(setupMissing || error?.includes("not configured")) && (
        <div className="login-alert setup-alert">
          <strong>Supabase setup required</strong>
          <span>Add your Supabase URL and anon key to Vercel Environment Variables before signing in.</span>
        </div>
      )}

      {error && !error.includes("not configured") && (
        <div className="login-alert error-alert" role="alert">{error}</div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@up.edu.ph"
            required
          />
        </label>

        <label>
          <span>Password</span>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button className="login-submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="login-access-note">
        <strong>No public registration</strong>
        <span>Accounts are provisioned or approved by the UPM-SHS program administrator.</span>
      </div>

      <p className="login-help">Having trouble accessing your account? Contact the program administrator.</p>
    </div>
  );
}
