import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const aiKeys = {
  all: ["ai"] as const,
  insights: (accidentId: string) =>
    [...aiKeys.all, "insights", accidentId] as const,
};

// Mutations
export const useAnalyzeAccident = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/ai/analyze-accident", data),
  });

export const useGenerateReport = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/ai/generate-report", data),
  });

export const useExtractText = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/ai/extract-text", data),
  });

export const useClassifySeverity = () =>
  useMutation({
    mutationFn: (data: any) => apiClient.post("/ai/classify-severity", data),
  });

// Queries
export const useGetAiInsights = (accidentId: string | undefined) =>
  useQuery({
    queryKey: aiKeys.insights(accidentId!),
    queryFn: () => apiClient.get(`/ai/insights/${accidentId}`),
    enabled: !!accidentId,
  });
