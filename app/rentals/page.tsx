"use client";
import { useMemo, useState } from "react";
import { AlertCircle, KeyRound } from "lucide-react";
import { useRentals } from "@/hooks/use-rentals";
import { RentalCard } from "@/components/rental-card";
import { CardGridSkeleton } from "@/components/card-grid-skeleton";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { FilterBar, emptyFilters, type FilterValues } from "@/components/filter-bar";
import { applyClientFilters, applyClientSort } from "@/lib/client-filter";
import type { Rental } from "@/lib/types";

const PAGE_SIZE = 20;

export default function RentalsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);

  const { data, isLoading, isError, error, isFetching } = useRentals({
    page,
    limit: PAGE_SIZE,
    locality: filters.locality || undefined,
    bhk: filters.bhk || undefined,
    furnishing: filters.furnishing || undefined,
    min_price: filters.min_price ? Number(filters.min_price) : undefined,
    max_price: filters.max_price ? Number(filters.max_price) : undefined,
    sort_by: filters.sort_by || undefined,
    order: filters.order || undefined,
  });

  const results = useMemo(() => {
    const raw = (data?.results ?? []) as Rental[];
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
        <h1 className="font-display text-3xl font-semibold text-ink">Rent a home</h1>
        <p className="mt-1 text-sm text-muted">Monthly rent shown separately from deposit &amp; maintenance.</p>
      </div>

      <FilterBar values={filters} onChange={handleFilterChange} resultCount={data?.total} />

      {isLoading ? (
        <CardGridSkeleton />
      ) : isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load rentals"
          description={error instanceof Error ? error.message : "Something went wrong. Please try again."}
        />
      ) : results.length === 0 ? (
        <EmptyState icon={KeyRound} title="No rentals match your filters" description="Try widening your price range or clearing a filter." />
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {results.map((rental) => (
              <RentalCard key={rental.listing_id} rental={rental} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
