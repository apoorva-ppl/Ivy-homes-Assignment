"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  for (let p = page - 1; p <= page + 1; p++) {
    if (p >= 1 && p <= totalPages) pages.add(p);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={15} />
      </Button>
      {sorted.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && sorted[i - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
          <button
            onClick={() => onChange(p)}
            className={
              p === page
                ? "flex h-9 w-9 items-center justify-center rounded-lg bg-ivy-500 text-sm font-medium text-paper"
                : "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-ink hover:bg-sand"
            }
          >
            {p}
          </button>
        </span>
      ))}
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight size={15} />
      </Button>
    </div>
  );
}
