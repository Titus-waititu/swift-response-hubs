import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  detail: (id: string) => [...mediaKeys.all, "detail", id] as const,
};

// Queries
export const useGetMedia = () =>
  useQuery({
    queryKey: mediaKeys.lists(),
    queryFn: () => apiClient.get("/media/"),
  });

export const useGetMediaById = (id: string | undefined) =>
  useQuery({
    queryKey: mediaKeys.detail(id!),
    queryFn: () => apiClient.get(`/media/${id}`),
    enabled: !!id,
  });

// Mutations
export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/media/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/media/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
    },
  });
};
