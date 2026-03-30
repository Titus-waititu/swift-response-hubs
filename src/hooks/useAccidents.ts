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
    queryFn: async () => {
      try {
        // Try the main endpoint first (works for Dispatcher, Officer, Admin)
        return await apiClient.get("/accidents/");
      } catch (error: any) {
        // If 403 Forbidden (likely a USER role), try user-specific endpoint
        if (error?.response?.status === 403 && user?.role === "USER") {
          try {
            // Try alternative endpoint for user's own reports
            return await apiClient.get("/user/incidents");
          } catch (userError: any) {
            if (userError?.response?.status === 404) {
              // If user endpoints don't exist, try with query parameter
              return await apiClient.get(`/accidents/?userId=${user?.id}`);
            }
            throw userError;
          }
        }
        // Re-throw other errors
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 5000, // Data is considered fresh for 5 seconds
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    refetchOnWindowFocus: true, // Refetch when window regains focus
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

export const useUpdateResponderResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accidentId,
      description,
    }: {
      accidentId: string | number;
      description?: string;
    }) =>
      apiClient.patch(`/accidents/${accidentId}`, {
        description,
      }),
    onSuccess: (_, { accidentId }) => {
      console.log("Responder response updated:", accidentId);
      queryClient.invalidateQueries({
        queryKey: accidentKeys.detail(accidentId),
      });
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
    },
    onError: (error: any) => {
      console.error(
        "Update responder response error:",
        error?.response?.data || error,
      );
    },
  });
};

export const useNotifyDispatcherOfResponse = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({
      title,
      message,
      priority,
      accidentId,
    }: {
      title: string;
      message: string;
      priority?: "low" | "medium" | "high" | "urgent";
      accidentId?: string;
    }) =>
      apiClient.post("/notifications", {
        userId: user?.id,
        type: "status_update",
        title,
        message,
        priority: priority || "high",
        accidentId,
      }),
    onSuccess: () => {
      console.log("Dispatcher notified of response update");
    },
    onError: (error: any) => {
      console.error("Notify dispatcher error:", error?.response?.data || error);
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
