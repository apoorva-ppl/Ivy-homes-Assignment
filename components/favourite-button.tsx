"use client";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFavouriteIds, useToggleFavourite } from "@/hooks/use-favourites";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export function FavouriteButton({ listingId, className }: { listingId: string; className?: string }) {
  const token = useAuthStore((s) => s.token);
  const favouriteIds = useFavouriteIds();
  const { toggle } = useToggleFavourite();
  const isFavourited = favouriteIds.has(listingId);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
          toast.error("Sign in to save listings");
          return;
        }
        toggle(listingId, isFavourited);
      }}
      aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur transition-colors hover:bg-white",
        className
      )}
    >
      <Heart
        size={17}
        className={cn("transition-colors", isFavourited ? "fill-clay text-clay" : "text-ink")}
      />
    </motion.button>
  );
}
