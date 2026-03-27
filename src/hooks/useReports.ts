import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const reportsKeys = {
  all: ["reports"] as const,
  lists: () => [...reportsKeys.all, "list"] as const,
  detail: (id: string) => [...reportsKeys.all, "detail", id] as const,
  byNumber: (reportNumber: string) =>
    [...reportsKeys.all, "number", reportNumber] as const,
  byAccident: (accidentId: string) =>
    [...reportsKeys.all, "accident", accidentId] as const,
  byOfficer: (officerId: string) =>
    [...reportsKeys.all, "officer", officerId] as const,
  submitted: () => [...reportsKeys.all, "submitted"] as const,
  draft: () => [...reportsKeys.all, "draft"] as const,
  statistics: () => [...reportsKeys.all, "statistics"] as const,
};

// Queries
export const useGetReports = () =>
  useQuery({
    queryKey: reportsKeys.lists(),
    queryFn: () => apiClient.get("/reports/"),
  });

export const useGetReportById = (id: string | undefined) =>
  useQuery({
    queryKey: reportsKeys.detail(id!),
    queryFn: () => apiClient.get(`/reports/${id}`),
    enabled: !!id,
  });

export const useGetReportByNumber = (reportNumber: string | undefined) =>
  useQuery({
    queryKey: reportsKeys.byNumber(reportNumber!),
    queryFn: () => apiClient.get(`/reports/report/${reportNumber}`),
    enabled: !!reportNumber,
  });

export const useGetReportsByAccident = (accidentId: string | undefined) =>
  useQuery({
    queryKey: reportsKeys.byAccident(accidentId!),
    queryFn: () => apiClient.get(`/reports/accident/${accidentId}`),
    enabled: !!accidentId,
  });

export const useGetReportsByOfficer = (officerId: string | undefined) =>
  useQuery({
    queryKey: reportsKeys.byOfficer(officerId!),
    queryFn: () => apiClient.get(`/reports/officer/${officerId}`),
    enabled: !!officerId,
  });

export const useGetSubmittedReports = () =>
  useQuery({
    queryKey: reportsKeys.submitted(),
    queryFn: () => apiClient.get("/reports/submitted"),
  });

export const useGetDraftReports = () =>
  useQuery({
    queryKey: reportsKeys.draft(),
    queryFn: () => apiClient.get("/reports/draft"),
  });

export const useGetReportStatistics = () =>
  useQuery({
    queryKey: reportsKeys.statistics(),
    queryFn: () => apiClient.get("/reports/statistics"),
  });

// Mutations
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/reports/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.draft() });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.patch(`/reports/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
    },
  });
};

export const useSubmitReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.patch(`/reports/${id}/submit`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportsKeys.submitted() });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/reports/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportsKeys.lists() });
    },
  });
};
