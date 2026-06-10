"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import type { LoginRequest, RegisterRequest } from "@/lib/types";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (payload: LoginRequest) => Promise<unknown>;
  onRegister: (payload: RegisterRequest) => Promise<unknown>;
};

type Tab = "login" | "register";

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("login");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("login");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="cyber-shell w-full max-w-2xl p-4 md:p-5"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="cyber-kicker">PulseHub auth</p>
            <h2 className="cyber-heading mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
              Sign in or create an account
            </h2>
          </div>

          <button className="cyber-button cyber-button-tertiary px-3 py-2 text-xs" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="mt-5 inline-flex gap-2">
          <button
            className={`cyber-tab px-4 py-2 ${
              activeTab === "login" ? "cyber-tab-active" : ""
            }`}
            onClick={() => setActiveTab("login")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`cyber-tab px-4 py-2 ${
              activeTab === "register" ? "cyber-tab-active" : ""
            }`}
            onClick={() => setActiveTab("register")}
            type="button"
          >
            Create account
          </button>
        </div>

        <div className="mt-5">
          {activeTab === "login" ? (
            <LoginForm onLogin={onLogin} />
          ) : (
            <RegisterForm onRegister={onRegister} />
          )}
        </div>
      </div>
    </div>
  );
}
