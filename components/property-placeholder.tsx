"use client";
import { Building2, Home, Warehouse, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

const gradients: Record<string, string> = {
  apartment: "from-ivy-500 to-ivy-700",
  villa: "from-clay to-[#8B3D28]",
  plot: "from-[#8FA396] to-ivy-700",
  studio: "from-ivy-400 to-[#6E7268]",
  default: "from-ivy-500 to-ink",
};

const icons: Record<string, React.ElementType> = {
  apartment: Building2,
  villa: Home,
  plot: Trees,
  studio: Warehouse,
  default: Building2,
};

export function PropertyPlaceholder({
  propertyType,
  className,
}: {
  propertyType?: string;
  className?: string;
}) {
  const key = (propertyType || "default").toLowerCase();
  const gradient = gradients[key] || gradients.default;
  const Icon = icons[key] || icons.default;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        <pattern id={`grid-${key}`} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M 18 0 L 0 0 0 18" fill="none" stroke="white" strokeWidth="0.75" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${key})`} />
      </svg>
      <Icon size={34} strokeWidth={1.5} className="relative text-paper/85" />
    </div>
  );
}
