import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const uploadsKeys = {
  all: ["uploads"] as const,
  status: (uploadId: string) =>
    [...uploadsKeys.all, "status", uploadId] as const,
};

// Mutations - File Uploads
export const useUploadFile = () =>
  useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });

export const useUploadFiles = () =>
  useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.post("/upload/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });

export const useUploadDocument = () =>
  useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.post("/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });

export const useUploadVideo = () =>
  useMutation({
    mutationFn: (formData: FormData) =>
      apiClient.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
  });

// Queries
export const useGetUploadStatus = (uploadId: string | undefined) =>
  useQuery({
    queryKey: uploadsKeys.status(uploadId!),
    queryFn: () => apiClient.get(`/upload/status/${uploadId}`),
    enabled: !!uploadId,
  });

// Mutations - Delete
export const useDeleteUploadedFile = () =>
  useMutation({
    mutationFn: (publicId: string) =>
      apiClient.delete(`/upload/file/${publicId}`),
  });
