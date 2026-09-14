import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnalyticsSummary, Listing, PaginatedResponse } from "@/lib/types";

// /v1/analytics/summary is documented but does not exist on the real API
// (confirmed 404 across every path variant we tried). The API_REFERENCE.md
// itself warns some documented endpoints "were planned and never shipped" —
// this is one of those. So instead of calling it, we pull the full listings
// dataset (paginated, max page size) and compute the same shape ourselves.
const PAGE_LIMIT = 200;
const MAX_PAGES = 50; // safety cap — a few thousand listings max, per the brief

async function fetchAllListings(): Promise<Listing[]> {
  const all: Listing[] = [];
  let page = 1;
  let total = Infinity;

  while (all.length < total && page <= MAX_PAGES) {
    const res = await api.get<PaginatedResponse<Listing>>("v1/listings", {
      page,
      limit: PAGE_LIMIT,
    });
    all.push(...res.results);
    total = res.total;
    if (res.results.length === 0) break;
    page += 1;
  }

  return all;
}

function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function computeSummary(listings: Listing[]): AnalyticsSummary {
  // Only count records the API itself marks live, where that field is present.
  const active = listings.filter((l) => l.is_live !== false);

  const prices = active
    .map((l) => l.price)
    .filter((p): p is number => typeof p === "number" && p > 0);

  const pricePerSqft = active
    .filter(
      (l) =>
        typeof l.price === "number" &&
        typeof l.carpet_area === "number" &&
        l.carpet_area! > 0,
    )
    .map((l) => l.price! / l.carpet_area!);

  const localityMap = new Map<string, number[]>();
  for (const l of active) {
    if (!l.locality || typeof l.price !== "number") continue;
    if (!localityMap.has(l.locality)) localityMap.set(l.locality, []);
    localityMap.get(l.locality)!.push(l.price);
  }
  const by_locality = Array.from(localityMap.entries())
    .map(([locality, localityPrices]) => ({
      locality,
      count: localityPrices.length,
      median_price: median(localityPrices),
    }))
    .sort((a, b) => b.count - a.count);

  const bhkMap = new Map<number, number>();
  for (const l of active) {
    if (typeof l.bedroom !== "number") continue;
    bhkMap.set(l.bedroom, (bhkMap.get(l.bedroom) ?? 0) + 1);
  }
  const by_bhk = Array.from(bhkMap.entries())
    .map(([bedroom, count]) => ({ bedroom, bhk: bedroom, count }))
    .sort((a, b) => a.bedroom - b.bedroom);

  return {
    total_listings: active.length,
    median_price: median(prices),
    median_price_per_sqft:
      median(pricePerSqft) != null
        ? Math.round(median(pricePerSqft)!)
        : undefined,
    by_locality,
    by_bhk,
  };
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "summary", "computed"],
    queryFn: async () => computeSummary(await fetchAllListings()),
    staleTime: 5 * 60 * 1000, // pulling the whole dataset is expensive — cache 5 min
  });
}
