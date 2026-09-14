import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import type { Listing } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

interface FavouritesResponse {
  count: number;
  results: Listing[];
}

export function useFavourites() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["favourites"],
    queryFn: () => api.get<FavouritesResponse>("v1/saved"),
    enabled: !!token,
  });
}

export function useFavouriteIds() {
  const { data } = useFavourites();
  return new Set((data?.results ?? []).map((l) => l.listing_id));
}

export function useToggleFavourite() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  const add = useMutation({
    mutationFn: (id: string) => api.post("v1/saved", { listing_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      toast.success("Saved to favourites");
    },
    onError: (err: ApiError) =>
      toast.error(err.message || "Couldn't save this listing"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`v1/saved/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      toast.success("Removed from favourites");
    },
    onError: (err: ApiError) =>
      toast.error(err.message || "Couldn't remove this listing"),
  });

  const toggle = (id: string, isFavourited: boolean) => {
    if (!token) {
      toast.error("Sign in to save listings");
      return;
    }
    if (isFavourited) {
      remove.mutate(id);
    } else {
      add.mutate(id);
    }
  };

  return { toggle, isPending: add.isPending || remove.isPending };
}
