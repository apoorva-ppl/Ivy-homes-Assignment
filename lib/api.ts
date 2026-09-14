import { useAuthStore } from "@/store/auth-store";
import type { ApiErrorBody } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// All requests go through our own /api/ivy proxy (see app/api/ivy/[...path]/route.ts)
// so the real Ivy Homes API key is never sent to or stored in the browser.
const PROXY_BASE = "/api/ivy";

interface RequestOptions {
  method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  auth?: boolean; // attach bearer token
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", params, body, auth = true } = options;

  const url = new URL(`${PROXY_BASE}/${path}`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Network error — check your connection and try again.", 0);
  }

  const text = await res.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      (data as ApiErrorBody | undefined)?.detail ||
      (typeof data === "string" ? data : undefined) ||
      `Request failed (${res.status})`;
    throw new ApiError(detail, res.status);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"], auth?: boolean) =>
    apiFetch<T>(path, { method: "GET", params, auth }),
  post: <T>(path: string, body?: unknown, auth?: boolean) =>
    apiFetch<T>(path, { method: "POST", body, auth }),
  delete: <T>(path: string, auth?: boolean) =>
    apiFetch<T>(path, { method: "DELETE", auth }),
};
