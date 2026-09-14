"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  expiresAt: number | null;
  hasHydrated: boolean;
  setAuth: (
    token: string,
    refreshToken: string,
    expiresIn: number,
    user: User,
  ) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      expiresAt: null,
      hasHydrated: false,
      setAuth: (token, refreshToken, expiresIn, user) =>
        set({
          token,
          refreshToken,
          user,
          expiresAt: Date.now() + expiresIn * 1000,
        }),
      logout: () =>
        set({ token: null, refreshToken: null, user: null, expiresAt: null }),
      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "ivy-auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
