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

// The access token only lives 15 min (expires_in: 900). When a signed request
// gets a 401, we use the refresh_token to get a new one and retry once before
// giving up and logging the user out. Concurrent 401s share one refresh call.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken, user } = useAuthStore.getState();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${PROXY_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
          cache: "no-store",
        });
        if (!res.ok) return false;
        const data = await res.json();
        useAuthStore
          .getState()
          .setAuth(
            data.access_token,
            data.refresh_token ?? refreshToken,
            data.expires_in ?? 900,
            user ?? { email: "" },
          );
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

async function doFetch(
  url: string,
  method: string,
  headers: Record<string, string>,
  body: unknown,
): Promise<Response> {
  try {
    return await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Network error — check your connection and try again.",
      0,
    );
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", params, body, auth = true } = options;

  const url = new URL(
    `${PROXY_BASE}/${path}`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost",
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const buildHeaders = (): {
    headers: Record<string, string>;
    sentToken: boolean;
  } => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    let sentToken = false;
    if (auth) {
      const token = useAuthStore.getState().token;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        sentToken = true;
      }
    }
    return { headers, sentToken };
  };

  let { headers, sentToken } = buildHeaders();
  let res = await doFetch(url.toString(), method, headers, body);

  if (res.status === 401 && sentToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      ({ headers, sentToken } = buildHeaders());
      res = await doFetch(url.toString(), method, headers, body);
    }
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
    if (res.status === 401 && sentToken) {
      useAuthStore.getState().logout();
    }
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
