"use client";

import type { CurrentUser } from "@/lib/types";

type AuthStatusProps = {
  error: string | null;
  isChecking: boolean;
  onLogout: () => void;
  user: CurrentUser | null;
};

export function AuthStatus({ error, isChecking, onLogout, user }: AuthStatusProps) {
  if (isChecking) {
    return <p className="cyber-status p-4">Checking session...</p>;
  }

  if (!user) {
    return (
      <div className="cyber-status space-y-3 p-4">
        <p className="cyber-kicker">Session locked</p>
        <p className="cyber-copy">You are signed out.</p>
        {error ? <p className="text-sm text-[color:var(--destructive)]">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="cyber-status space-y-3 p-4">
      <div>
        <p className="cyber-kicker">Session online</p>
        <p className="cyber-heading mt-2 font-semibold text-[color:var(--foreground)]">Signed in as {user.displayName}</p>
        <p className="cyber-muted mt-1 text-sm">@{user.username}</p>
      </div>

      <button className="cyber-button cyber-button-secondary w-full" onClick={onLogout} type="button">
        Sign out
      </button>
    </div>
  );
}
