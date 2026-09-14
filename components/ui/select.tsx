"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: Option[];
  onChange?: (value: string) => void;
}

export function Select({ options, onChange, className, ...props }: NativeSelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-line bg-white px-3 pr-9 text-sm text-ink focus:border-ivy-400 focus:outline-none focus:ring-2 focus:ring-ivy-100",
          className
        )}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}
