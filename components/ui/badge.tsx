import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "ivy" | "clay" | "outline";
}) {
  const variants = {
    default: "bg-sand text-ink",
    ivy: "bg-ivy-50 text-ivy-700",
    clay: "bg-clay/10 text-clay",
    outline: "border border-line text-muted",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
