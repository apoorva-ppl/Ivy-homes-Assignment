"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PropertyPlaceholder } from "@/components/property-placeholder";
import { formatINR, formatArea, titleCase } from "@/lib/utils";
import type { Rental } from "@/lib/types";

export function RentalCard({ rental }: { rental: Rental }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Link href={`/rentals/${rental.listing_id}`}>
        <Card className="overflow-hidden">
          <div className="relative h-44 w-full">
            <PropertyPlaceholder propertyType="apartment" className="h-full w-full" />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                {formatINR(rental.price)}<span className="text-xs font-normal text-muted"> /mo</span>
              </p>
              {rental.deposit != null && (
                <span className="whitespace-nowrap rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-muted">
                  Deposit {formatINR(rental.deposit)}
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-sm font-medium text-ink">
              {rental.title || rental.apartment_name || "Unnamed property"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
              <MapPin size={12} /> {rental.locality || "Locality unknown"}
            </p>
            <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-xs text-muted">
              {rental.bedroom != null && (
                <span className="flex items-center gap-1">
                  <BedDouble size={13} /> {rental.bedroom} BHK
                </span>
              )}
              {rental.bathroom != null && (
                <span className="flex items-center gap-1">
                  <Bath size={13} /> {rental.bathroom}
                </span>
              )}
              {rental.carpet_area != null && (
                <span className="flex items-center gap-1">
                  <Ruler size={13} /> {formatArea(rental.carpet_area)}
                </span>
              )}
              {rental.furnishing && <span>{titleCase(rental.furnishing)}</span>}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
