"use client";

import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";

// Every Ivy Homes data endpoint (listings, rentals, projects, analytics,
// favourites) requires a bearer token from POST /auth/login — there is no
// public/anonymous read access. So the whole app sits behind auth, and only
// /login renders without a token.
const PUBLIC_PATHS = ["/login"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
}
