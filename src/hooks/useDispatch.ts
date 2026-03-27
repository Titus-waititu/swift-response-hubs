import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const dispatchKeys = {
  all: ["dispatch"] as const,
  lists: () => [...dispatchKeys.all, "list"] as const,
  active: () => [...dispatchKeys.all, "active"] as const,
  pending: () => [...dispatchKeys.all, "pending"] as const,
  completed: () => [...dispatchKeys.all, "completed"] as const,
  statistics: () => [...dispatchKeys.all, "statistics"] as const,
  accident: (accidentId: string) =>
    [...dispatchKeys.all, "accident", accidentId] as const,
};

// Queries
export const useGetActiveDispatches = () =>
  useQuery({
    queryKey: dispatchKeys.active(),
    queryFn: () => apiClient.get("/dispatch/active"),
  });

export const useGetDispatchByAccident = (accidentId: string | undefined) =>
  useQuery({
    queryKey: dispatchKeys.accident(accidentId!),
    queryFn: () => apiClient.get(`/dispatch/accident/${accidentId}`),
    enabled: !!accidentId,
  });

export const useGetPendingDispatches = () =>
  useQuery({
    queryKey: dispatchKeys.pending(),
    queryFn: () => apiClient.get("/dispatch/pending"),
  });

export const useGetCompletedDispatches = () =>
  useQuery({
    queryKey: dispatchKeys.completed(),
    queryFn: () => apiClient.get("/dispatch/completed"),
  });

export const useGetDispatchStatistics = () =>
  useQuery({
    queryKey: dispatchKeys.statistics(),
    queryFn: () => apiClient.get("/dispatch/statistics"),
  });

// Mutations
export const useManualDispatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/dispatch/manual", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dispatchKeys.all });
    },
  });
};
