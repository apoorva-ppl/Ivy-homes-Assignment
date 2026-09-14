"use client";
import { AlertCircle, HeartCrack } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useFavourites } from "@/hooks/use-favourites";
import { ListingCard } from "@/components/listing-card";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { EmptyState } from "@/components/empty-state";

function SavedContent() {
  const { data, isLoading, isError, error } = useFavourites();
  const results = data?.results ?? [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Saved listings</h1>
        <p className="mt-1 text-sm text-muted">
          {data ? `${data.count} listing${data.count === 1 ? "" : "s"} saved` : "Listings you've favourited."}
        </p>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={4} />
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load your saved listings"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={HeartCrack}
          title="No saved listings yet"
          description="Tap the heart on any listing to save it here for later."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((listing) => (
            <ListingCard key={listing.listing_id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedContent />
    </ProtectedRoute>
  );
}
