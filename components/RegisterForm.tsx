"use client";

import { FormEvent, useState } from "react";
import type { RegisterRequest } from "@/lib/types";

type RegisterFormProps = {
  onRegister: (payload: RegisterRequest) => Promise<unknown>;
};

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      await onRegister({ username, displayName, password });
      setPassword("");
      setMessage("Account created. You can sign in now.");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Could not create account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cyber-terminal space-y-4 p-4">
      <h2 className="cyber-heading text-lg font-semibold text-[color:var(--foreground)]">Create account</h2>

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
        <span className="cyber-label">Display name</span>
        <input
          className="cyber-input"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          autoComplete="name"
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
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>

      {message ? <p className="text-sm text-[color:var(--accent)]">{message}</p> : null}
      {error ? <p className="text-sm text-[color:var(--destructive)]">{error}</p> : null}

      <button
        className="cyber-button cyber-button-secondary w-full"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
