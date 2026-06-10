"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, getCurrentUser, loginUser, registerUser } from "@/lib/api";
import { clearAuthToken, getAuthToken } from "@/lib/auth-token";
import type { CurrentUser, LoginRequest, RegisterRequest } from "@/lib/types";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export function useAuth() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");
  const [error, setError] = useState<string | null>(null);

  const refreshCurrentUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }

    try {
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
      return currentUser;
    } catch (unknownError) {
      if (unknownError instanceof ApiError && unknownError.status === 401) {
        clearAuthToken();
      }

      setUser(null);
      setStatus("unauthenticated");
      setError(getErrorMessage(unknownError));
      return null;
    }
  }, []);

  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  async function login(payload: LoginRequest) {
    setError(null);
    const response = await loginUser(payload);
    const nextUser = {
      userId: response.userId,
      username: response.username,
      displayName: response.displayName,
    };

    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }

  async function register(payload: RegisterRequest) {
    setError(null);
    return registerUser(payload);
  }

  function logout() {
    clearAuthToken();
    setUser(null);
    setStatus("unauthenticated");
    setError(null);
  }

  return {
    error,
    isAuthenticated: status === "authenticated",
    isChecking: status === "checking",
    login,
    logout,
    refreshCurrentUser,
    register,
    status,
    user,
  };
}

function getErrorMessage(unknownError: unknown) {
  if (unknownError instanceof Error) {
    return unknownError.message;
  }

  return "Something went wrong.";
}
