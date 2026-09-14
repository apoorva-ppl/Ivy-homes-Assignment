"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Leaf, Heart, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const links = [
  { href: "/listings", label: "Buy" },
  { href: "/rentals", label: "Rent" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { token, logout } = useAuthStore();

  useEffect(() => setMounted(true), []);

  if (pathname === "/login") return null;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/listings" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivy-500 text-paper">
            <Leaf size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Ivy Homes
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink",
                pathname.startsWith(l.href) && "text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/saved"
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink",
              pathname.startsWith("/saved") && "text-ink"
            )}
          >
            <Heart size={16} /> Saved
          </Link>
          {mounted && token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-sand"
            >
              <LogOut size={15} /> Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-ivy-500 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ivy-600"
            >
              Sign in
            </Link>
          )}
        </div>

        <button
          className="p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {[...links, { href: "/saved", label: "Saved" }].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded px-2 py-2.5 text-sm font-medium text-ink"
                >
                  {l.label}
                </Link>
              ))}
              {mounted && token ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="mt-1 rounded-lg border border-line px-3 py-2.5 text-left text-sm font-medium text-ink"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg bg-ivy-500 px-3 py-2.5 text-center text-sm font-medium text-paper"
                >
                  Sign in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
