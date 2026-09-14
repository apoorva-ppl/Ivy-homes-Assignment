import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Project, PaginatedResponse } from "@/lib/types";

export interface ProjectFilters {
  page?: number;
  limit?: number;
  locality?: string;
  project_status?: string;
  sort_by?: string;
  order?: string;
}

export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () =>
      api.get<PaginatedResponse<Project>>("v1/projects", {
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
        locality: filters.locality,
        project_status: filters.project_status,
        sort_by: filters.sort_by,
        order: filters.order,
      }),
    placeholderData: (prev) => prev,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => api.get<Project>(`v1/projects/${id}`),
    enabled: !!id,
  });
}
