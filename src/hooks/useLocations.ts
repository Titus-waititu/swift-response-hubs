import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const locationsKeys = {
  all: ["locations"] as const,
  lists: () => [...locationsKeys.all, "list"] as const,
  detail: (id: string) => [...locationsKeys.all, "detail", id] as const,
};

// Queries
export const useGetLocations = () =>
  useQuery({
    queryKey: locationsKeys.lists(),
    queryFn: () => apiClient.get("/locations/"),
  });

export const useGetLocationById = (id: string | undefined) =>
  useQuery({
    queryKey: locationsKeys.detail(id!),
    queryFn: () => apiClient.get(`/locations/${id}`),
    enabled: !!id,
  });

// Mutations
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/locations/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/locations/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: locationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
    },
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/locations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationsKeys.lists() });
    },
  });
};
