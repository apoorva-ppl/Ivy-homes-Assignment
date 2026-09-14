"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Ruler, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PropertyPlaceholder } from "@/components/property-placeholder";
import { FavouriteButton } from "@/components/favourite-button";
import { formatINR, formatArea, titleCase } from "@/lib/utils";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const area = listing.carpet_area ?? listing.super_built_up_area;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link href={`/listings/${listing.listing_id}`}>
        <Card className="group overflow-hidden">
          <div className="relative h-44 w-full">
            <PropertyPlaceholder propertyType={listing.property_type} className="h-full w-full" />
            <FavouriteButton listingId={listing.listing_id} className="absolute right-3 top-3" />
            {listing.is_verified && (
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ivy-700 shadow-card">
                <BadgeCheck size={13} /> Verified
              </span>
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                {formatINR(listing.price)}
              </p>
              <span className="whitespace-nowrap rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-muted">
                {titleCase(listing.property_type)}
              </span>
            </div>
            <p className="mt-1 truncate text-sm font-medium text-ink">
              {listing.apartment_name || "Unnamed property"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
              <MapPin size={12} /> {listing.locality || "Locality unknown"}
            </p>
            <div className="mt-3 flex items-center gap-3 border-t border-line pt-3 text-xs text-muted">
              {listing.bedroom != null && (
                <span className="flex items-center gap-1">
                  <BedDouble size={13} /> {listing.bedroom} BHK
                </span>
              )}
              {listing.bathroom != null && (
                <span className="flex items-center gap-1">
                  <Bath size={13} /> {listing.bathroom}
                </span>
              )}
              {area != null && (
                <span className="flex items-center gap-1">
                  <Ruler size={13} /> {formatArea(area)}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
