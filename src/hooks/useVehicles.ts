import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const vehiclesKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehiclesKeys.all, "list"] as const,
  detail: (id: string) => [...vehiclesKeys.all, "detail", id] as const,
  byAccident: (accidentId: string) =>
    [...vehiclesKeys.all, "accident", accidentId] as const,
  byPlate: (licensePlate: string) =>
    [...vehiclesKeys.all, "plate", licensePlate] as const,
};

// Queries
export const useGetVehicles = () =>
  useQuery({
    queryKey: vehiclesKeys.lists(),
    queryFn: () => apiClient.get("/vehicles/"),
  });

export const useGetVehicleById = (id: string | undefined) =>
  useQuery({
    queryKey: vehiclesKeys.detail(id!),
    queryFn: () => apiClient.get(`/vehicles/${id}`),
    enabled: !!id,
  });

export const useGetVehiclesByAccident = (accidentId: string | undefined) =>
  useQuery({
    queryKey: vehiclesKeys.byAccident(accidentId!),
    queryFn: () => apiClient.get(`/vehicles/accident/${accidentId}`),
    enabled: !!accidentId,
  });

export const useGetVehiclesByPlate = (licensePlate: string | undefined) =>
  useQuery({
    queryKey: vehiclesKeys.byPlate(licensePlate!),
    queryFn: () => apiClient.get(`/vehicles/plate/${licensePlate}`),
    enabled: !!licensePlate,
  });

// Mutations
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/vehicles/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.lists() });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/vehicles/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.lists() });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/vehicles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesKeys.lists() });
    },
  });
};
