import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "@/stores/authStore";

// Query Keys
export const accidentKeys = {
  all: ["accidents"] as const,
  lists: () => [...accidentKeys.all, "list"] as const,
  list: (filters?: string) => [...accidentKeys.lists(), { filters }] as const,
  details: () => [...accidentKeys.all, "detail"] as const,
  detail: (id: string | number) => [...accidentKeys.details(), id] as const,
  statistics: () => [...accidentKeys.all, "statistics"] as const,
};

// Queries
export const useGetAccidents = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: accidentKeys.lists(),
    queryFn: () => {
      // Dispatcher and Officer need ALL accidents across the system
      if (
        user?.role === "DISPATCHER" ||
        user?.role === "OFFICER" ||
        user?.role === "ADMIN"
      ) {
        return apiClient.get("/accidents/");
      }
      // USER and RESPONDER fetch their specific/relevant accidents
      if (user?.id) {
        return apiClient.get(`/accidents/user/${user.id}`);
      }
      // Fallback to all accidents if user ID is not available
      return apiClient.get("/accidents/");
    },
    enabled: !!user,
  });
};

export const useGetAccidentById = (id: string | number | undefined) =>
  useQuery({
    queryKey: accidentKeys.detail(id!),
    queryFn: () => apiClient.get(`/accidents/${id}`),
    enabled: !!id,
  });

export const useGetAccidentByReportNumber = (
  reportNumber: string | undefined,
) =>
  useQuery({
    queryKey: [...accidentKeys.all, "report", reportNumber],
    queryFn: () => apiClient.get(`/accidents/report/${reportNumber}`),
    enabled: !!reportNumber,
  });

export const useGetAccidentsByStatus = (status: string | undefined) =>
  useQuery({
    queryKey: [...accidentKeys.all, "status", status],
    queryFn: () => apiClient.get(`/accidents/status/${status}`),
    enabled: !!status,
  });

export const useGetAccidentsByOfficer = (officerId: string | undefined) =>
  useQuery({
    queryKey: [...accidentKeys.all, "officer", officerId],
    queryFn: () => apiClient.get(`/accidents/officer/${officerId}`),
    enabled: !!officerId,
  });

export const useGetAccidentStatistics = () =>
  useQuery({
    queryKey: accidentKeys.statistics(),
    queryFn: () => apiClient.get("/accidents/statistics"),
  });

// Mutations
export const useCreateAccident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/accidents/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
  });
};

export const useCreateAccidentReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/accidents/report", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
  });
};

export const useUpdateAccident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      apiClient.patch(`/accidents/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accidentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
  });
};

export const useAssignOfficer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      apiClient.patch(`/accidents/${id}/assign-officer`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accidentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
  });
};

export const useUpdateAccidentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      apiClient.patch(`/accidents/${id}/status`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accidentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
  });
};

export const useDeleteAccident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => apiClient.delete(`/accidents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
  });
};
