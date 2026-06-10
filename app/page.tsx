"use client";

import { AuthStatus } from "@/components/AuthStatus";
import { AuthModal } from "@/components/AuthModal";
import { ChatView } from "@/components/ChatView";
import { LandingShowcase } from "@/components/LandingShowcase";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Home() {
  const auth = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <main className="min-h-screen px-4 py-6 text-[color:var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="cyber-shell grid gap-6 p-5 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:p-7">
          <div className="space-y-4">
            <p className="cyber-kicker">PulseHub</p>
            <h1 className="cyber-heading cyber-glitch text-4xl font-black leading-none md:text-6xl">
              PulseHub
            </h1>
            <h2 className="cyber-heading cyber-glitch text-4xl font-black leading-none md:text-4xl">
              A distributed chat platform built using a microservice architecture</h2>
            <p className="cyber-copy max-w-3xl text-sm leading-7 md:text-base">
              PulseHub pairs a simple landing page with auth, chat, and a BFF-driven backend flow. The interface stays
              readable, typed, and easy to extend.
            </p>
          </div>

          <div className="space-y-3">
            <button className="cyber-button w-full" onClick={() => setIsAuthModalOpen(true)} type="button">
              Sign in / Create account
            </button>
            <AuthStatus error={auth.error} isChecking={auth.isChecking} onLogout={auth.logout} user={auth.user} />
          </div>
        </header>

        <LandingShowcase />

        {auth.user ? <ChatView currentUserId={auth.user.userId} /> : null}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen && !auth.isAuthenticated && !auth.isChecking}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={auth.login}
        onRegister={auth.register}
      />
    </main>
  );
}
