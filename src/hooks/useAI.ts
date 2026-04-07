import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { toast } from "sonner";

// Query Keys
export const aiKeys = {
  all: ["ai"] as const,
  insights: (accidentId: string) =>
    [...aiKeys.all, "insights", accidentId] as const,
};

// Mutations
export const useAnalyzeAccident = () =>
  useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/ai/analyze-accident", data);
      return response as any;
    },
    onError: (error: any) => {
      console.error("AI analysis error:", error);
      toast.error("Failed to analyze accident");
    },
  });

export const useGenerateReport = () =>
  useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/ai/generate-report", data);
      return response as any;
    },
    onError: (error: any) => {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report");
    },
  });

export const useExtractText = () =>
  useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/ai/extract-text", data);
      return response as any;
    },
    onError: (error: any) => {
      console.error("Text extraction error:", error);
      toast.error("Failed to extract text");
    },
  });

export const useClassifySeverity = () =>
  useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post("/ai/classify-severity", data);
      return response as any;
    },
    onError: (error: any) => {
      console.error("Severity classification error:", error);
      toast.error("Failed to classify severity");
    },
  });

// Queries
export const useGetAiInsights = (accidentId: string | undefined) =>
  useQuery({
    queryKey: aiKeys.insights(accidentId!),
    queryFn: () => apiClient.get(`/ai/insights/${accidentId}`),
    enabled: !!accidentId,
  });

// Unified AI analysis hook
export const useAccidentAnalysis = (accidentData: any) => {
  return useMutation({
    mutationFn: async (data: any = accidentData) => {
      if (!data) throw new Error("No accident data provided");

      const response = await apiClient.post("/ai/analyze-accident", {
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        severity: data.severity,
        numberOfInjuries: data.numberOfInjuries,
        numberOfVehicles: data.numberOfVehicles,
      });

      return response as any;
    },
  });
};
