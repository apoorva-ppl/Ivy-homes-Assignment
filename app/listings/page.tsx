"use client";
import { useMemo, useState } from "react";
import { AlertCircle, Home } from "lucide-react";
import { useListings } from "@/hooks/use-listings";
import { ListingCard } from "@/components/listing-card";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { FilterBar, emptyFilters, type FilterValues } from "@/components/filter-bar";
import { applyClientFilters, applyClientSort } from "@/lib/client-filter";
import type { Listing } from "@/lib/types";

const PAGE_SIZE = 20;

export default function ListingsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);

  const { data, isLoading, isError, error, isFetching } = useListings({
    page,
    limit: PAGE_SIZE,
    locality: filters.locality || undefined,
    bhk: filters.bhk || undefined,
    property_type: filters.property_type || undefined,
    min_price: filters.min_price ? Number(filters.min_price) : undefined,
    max_price: filters.max_price ? Number(filters.max_price) : undefined,
    furnishing: filters.furnishing || undefined,
    sort_by: filters.sort_by || undefined,
    order: filters.order || undefined,
  });

  const results = useMemo(() => {
    const raw = (data?.results ?? []) as Listing[];
    const filtered = applyClientFilters(raw, filters);
    return applyClientSort(filtered, filters.sort_by, filters.order);
  }, [data, filters]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / (data.page_size || PAGE_SIZE))) : 1;

  const handleFilterChange = (v: FilterValues) => {
    setFilters(v);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Buy a home</h1>
        <p className="mt-1 text-sm text-muted">Browse verified listings across the city.</p>
      </div>

      <FilterBar values={filters} onChange={handleFilterChange} showPropertyType resultCount={data?.total} />

      {isLoading ? (
        <CardGridSkeleton />
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load listings"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No listings match your filters"
          description="Try widening your price range or clearing a filter."
        />
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {results.map((listing) => (
              <ListingCard key={listing.listing_id} listing={listing} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
