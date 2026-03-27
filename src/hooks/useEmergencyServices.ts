import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const emergencyServicesKeys = {
  all: ["emergencyServices"] as const,
  lists: () => [...emergencyServicesKeys.all, "list"] as const,
  detail: (id: string) => [...emergencyServicesKeys.all, "detail", id] as const,
};

// Queries
export const useGetEmergencyServices = () =>
  useQuery({
    queryKey: emergencyServicesKeys.lists(),
    queryFn: () => apiClient.get("/emergency-services/"),
  });

export const useGetEmergencyServiceById = (id: string | undefined) =>
  useQuery({
    queryKey: emergencyServicesKeys.detail(id!),
    queryFn: () => apiClient.get(`/emergency-services/${id}`),
    enabled: !!id,
  });

// Mutations
export const useCreateEmergencyService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/emergency-services/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emergencyServicesKeys.lists(),
      });
    },
  });
};

export const useUpdateEmergencyService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/emergency-services/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: emergencyServicesKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: emergencyServicesKeys.lists(),
      });
    },
  });
};

export const useDeleteEmergencyService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/emergency-services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emergencyServicesKeys.lists(),
      });
    },
  });
};
