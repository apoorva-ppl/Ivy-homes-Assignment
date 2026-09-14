import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Listing, PaginatedResponse } from "@/lib/types";

export interface ListingFilters {
  page?: number;
  limit?: number;
  locality?: string;
  bhk?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  furnishing?: string;
  sort_by?: string;
  order?: string;
}

export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: () =>
      api.get<PaginatedResponse<Listing>>(
        "v1/listings",
        {
          page: filters.page ?? 1,
          limit: filters.limit ?? 20,
          locality: filters.locality,
          bhk: filters.bhk,
          property_type: filters.property_type,
          min_price: filters.min_price,
          max_price: filters.max_price,
          furnishing: filters.furnishing,
          sort_by: filters.sort_by,
          order: filters.order,
        },
        true,
      ),
    placeholderData: (prev) => prev,
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => api.get<Listing>(`v1/listing/${id}`, undefined, true),
    enabled: !!id,
  });
}

export function useSimilarListings(id: string) {
  return useQuery({
    queryKey: ["listing", id, "similar"],
    queryFn: () =>
      api.get<Listing[] | PaginatedResponse<Listing>>(
        `v1/listings/${id}/similar`,
        undefined,
        true,
      ),
    enabled: !!id,
  });
}
