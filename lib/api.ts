import {
  ApiErrorBody,
  CreateMessageRequest,
  CurrentUser,
  LoginRequest,
  LoginResponse,
  Message,
  RegisterRequest,
  RegisterResponse,
} from "@/lib/types";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/auth-token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
  const { auth = false, ...fetchInit } = init;
  const headers = new Headers(init.headers);
  const token = auth ? getAuthToken() : null;

  if (!headers.has("Content-Type") && fetchInit.body) {
    headers.set("Content-Type", "application/json");
  }

  if (auth && token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchInit,
      headers,
    });
  } catch {
    throw new ApiError(`Could not reach the BFF at ${API_BASE_URL}. Check that it is running and allows this frontend origin.`, 0);
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    let errorBody: ApiErrorBody | null = null;

    try {
      errorBody = (await response.json()) as ApiErrorBody;
    } catch {
      errorBody = null;
    }

    const status = errorBody?.status ?? response.status;
    const message = errorBody?.error ?? response.statusText ?? "Request failed";

    throw new ApiError(`${message} (${status})`, status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  return request<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setAuthToken(response.token);
  return response;
}

export function getCurrentUser(): Promise<CurrentUser> {
  return request<CurrentUser>("/api/me", {
    auth: true,
  });
}

export function getMessages(channel: string): Promise<Message[]> {
  const params = new URLSearchParams({ channel });
  return request<Message[]>(`/api/messages?${params.toString()}`, {
    auth: true,
  });
}

export function createMessage(payload: CreateMessageRequest): Promise<Message> {
  return request<Message>("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
}
