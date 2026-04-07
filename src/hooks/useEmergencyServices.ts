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
    queryFn: async () => {
      const response = await apiClient.get("/emergency-services/");
      // The apiClient interceptor already unwraps response.data, so response is already the data
      if (Array.isArray(response)) {
        return response;
      }
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }
      if (response?.services && Array.isArray(response.services)) {
        return response.services;
      }
      return [];
    },
  });

export const useGetEmergencyServiceById = (id: string | undefined) =>
  useQuery({
    queryKey: emergencyServicesKeys.detail(id!),
    queryFn: async () => {
      const response = await apiClient.get(`/emergency-services/${id}`);
      return response.data;
    },
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
