export const TOKEN_STORAGE_KEY = "pulsehub_token";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getAuthToken() {
  if (!canUseSessionStorage()) {
    return null;
  }

  return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}
