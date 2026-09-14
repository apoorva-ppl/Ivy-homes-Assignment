import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatArea(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${value.toLocaleString("en-IN")} sq.ft`;
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function titleCase(s?: string | null): string {
  if (!s) return "—";
  return s
    .toString()
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}
