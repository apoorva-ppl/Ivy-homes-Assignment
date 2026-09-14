"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line bg-white/60 px-6 py-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ivy-50 text-ivy-600">
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </motion.div>
  );
}
