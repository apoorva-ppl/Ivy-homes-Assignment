"use client";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, MapPin, BedDouble, Bath, Ruler, Layers, Compass, Phone, User, BadgeCheck, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useListing, useSimilarListings } from "@/hooks/use-listings";
import { PropertyPlaceholder } from "@/components/property-placeholder";
import { FavouriteButton } from "@/components/favourite-button";
import { ListingCard } from "@/components/listing-card";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatArea, formatDate, titleCase } from "@/lib/utils";
import type { Listing, PaginatedResponse } from "@/lib/types";

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value || value === "—") return null;
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivy-50 text-ivy-600">
        <Icon size={15} />
      </span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading, isError, error } = useListing(params.id);
  const { data: similarRaw } = useSimilarListings(params.id);

  const similar: Listing[] = Array.isArray(similarRaw)
    ? similarRaw
    : (similarRaw as PaginatedResponse<Listing> | undefined)?.results ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-8">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="mt-6 h-8 w-1/2" />
        <Skeleton className="mt-3 h-5 w-1/3" />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load this listing"
          description={error instanceof Error ? error.message : "It may have been removed or is temporarily unavailable."}
        />
      </div>
    );
  }

  const area = listing.carpet_area ?? listing.super_built_up_area;
  const hasCoords = listing.latitude != null && listing.longitude != null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <button
        onClick={() => router.back()}
        className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <PropertyPlaceholder propertyType={listing.property_type} className="h-64 w-full rounded-lg sm:h-80" />
        <FavouriteButton listingId={listing.listing_id} className="absolute right-4 top-4" />
        {listing.is_verified && (
          <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ivy-700 shadow-card">
            <BadgeCheck size={13} /> Verified listing
          </span>
        )}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-3xl font-semibold text-ink">{formatINR(listing.price)}</p>
              <p className="mt-1 text-lg font-medium text-ink">{listing.apartment_name || "Unnamed property"}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                <MapPin size={14} /> {listing.locality || "Locality unknown"}
              </p>
            </div>
            <Badge variant="ivy">{titleCase(listing.property_type)}</Badge>
          </div>

          <Card className="mt-6 divide-y divide-line px-4">
            <DetailRow icon={BedDouble} label="Bedrooms" value={listing.bedroom != null ? String(listing.bedroom) : undefined} />
            <DetailRow icon={Bath} label="Bathrooms" value={listing.bathroom != null ? String(listing.bathroom) : undefined} />
            <DetailRow icon={Ruler} label="Carpet area" value={area != null ? formatArea(area) : undefined} />
            <DetailRow
              icon={Layers}
              label="Floor"
              value={listing.floor != null ? `${listing.floor}${listing.total_floors ? ` of ${listing.total_floors}` : ""}` : undefined}
            />
            <DetailRow icon={Compass} label="Facing" value={listing.facing_direction ? titleCase(listing.facing_direction) : undefined} />
            <DetailRow icon={Calendar} label="Posted" value={formatDate(listing.posted_at)} />
          </Card>

          {listing.description && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-ink">About this property</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{listing.description}</p>
            </div>
          )}

          {hasCoords && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-ink">Location</h2>
              <a
                href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex h-52 items-center justify-center rounded-lg border border-line bg-gradient-to-br from-ivy-50 to-sand text-center"
              >
                <div>
                  <MapPin className="mx-auto mb-1 text-ivy-600" size={26} />
                  <p className="text-sm font-medium text-ink">
                    {listing.latitude?.toFixed(4)}, {listing.longitude?.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted">Open in Google Maps</p>
                </div>
              </a>
            </div>
          )}
        </div>

        <div>
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold text-ink">Seller details</h3>
            <div className="mt-3 space-y-1 divide-y divide-line">
              <DetailRow icon={User} label="Posted by" value={listing.posted_by_name || (listing.posted_by ? titleCase(listing.posted_by) : undefined)} />
              <DetailRow icon={Phone} label="Contact" value={listing.posted_by_contact} />
            </div>
          </Card>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">Similar listings</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.slice(0, 6).map((l) => (
              <ListingCard key={l.listing_id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
