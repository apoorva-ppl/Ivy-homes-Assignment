import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AnalyticsSummary } from "@/lib/types";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: () => api.get<AnalyticsSummary>("v1/analytics/summary", undefined, false),
  });
}
