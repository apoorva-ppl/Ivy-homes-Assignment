import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Rental, PaginatedResponse } from "@/lib/types";

export interface RentalFilters {
  page?: number;
  limit?: number;
  locality?: string;
  bhk?: string;
  furnishing?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  order?: string;
}

export function useRentals(filters: RentalFilters) {
  return useQuery({
    queryKey: ["rentals", filters],
    queryFn: () =>
      api.get<PaginatedResponse<Rental>>("v1/rentals", {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        locality: filters.locality,
        bhk: filters.bhk,
        furnishing: filters.furnishing,
        min_price: filters.min_price,
        max_price: filters.max_price,
        sort_by: filters.sort_by,
        order: filters.order,
      }, false),
    placeholderData: (prev) => prev,
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => api.get<Rental>(`v1/rentals/${id}`, undefined, false),
    enabled: !!id,
  });
}
