"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  token: string | null;
  apiKey: string | null;
  user: User | null;
  expiresAt: number | null;
  setAuth: (token: string, expiresIn: number, user: User) => void;
  setApiKey: (key: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      apiKey: process.env.NEXT_PUBLIC_IVY_API_KEY || null,
      user: null,
      expiresAt: null,
      setAuth: (token, expiresIn, user) =>
        set({
          token,
          user,
          expiresAt: Date.now() + expiresIn * 1000,
        }),
      setApiKey: (key) => set({ apiKey: key }),
      logout: () => set({ token: null, user: null, expiresAt: null }),
      isAuthenticated: () => {
        const { token, expiresAt } = get();
        if (!token) return false;
        // Session should still be usable 30+ min later. We don't hard-expire
        // client-side on the stored value; the API is the source of truth.
        // We only use expiresAt for UI hints, not to force logout.
        return true;
      },
    }),
    {
      name: "ivy-auth-storage",
    }
  )
);
