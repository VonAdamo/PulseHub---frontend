"use client";

import { FormEvent, useState } from "react";
import type { LoginRequest } from "@/lib/types";

type LoginFormProps = {
  onLogin: (payload: LoginRequest) => Promise<unknown>;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onLogin({ username, password });
      setPassword("");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Could not sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cyber-terminal space-y-4 p-4">
      <h2 className="cyber-heading text-lg font-semibold text-[color:var(--foreground)]">Sign in</h2>

      <label className="block">
        <span className="cyber-label">Username</span>
        <input
          className="cyber-input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label className="block">
        <span className="cyber-label">Password</span>
        <input
          className="cyber-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? <p className="text-sm text-[color:var(--destructive)]">{error}</p> : null}

      <button
        className="cyber-button w-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
