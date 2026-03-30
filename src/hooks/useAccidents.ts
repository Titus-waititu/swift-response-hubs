import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuthStore } from "@/stores/authStore";

// Status normalization helper
const normalizeStatus = (rawStatus: any): string => {
  if (!rawStatus) return "reported"; // Default to reported if missing
  
  // Convert to lowercase for case-insensitive matching
  const lowercaseStatus = String(rawStatus).toLowerCase().trim();
  
  const statusMap: Record<string, string> = {
    // Reported variations
    "submitted": "reported",
    "report_submitted": "reported",
    "pending": "reported",
    "reported": "reported",
    "report submitted": "reported",
    "not started": "reported",
    
    // Under Investigation variations
    "under_investigation": "under_investigation",
    "under investigation": "under_investigation",
    "under review": "under_investigation",
    "investigating": "under_investigation",
    "review": "under_investigation",
    "dispatched": "under_investigation",
    "en_route": "under_investigation",
    "en-route": "under_investigation",
    "en route": "under_investigation",
    
    // In Progress variations
    "in_progress": "in_progress",
    "in progress": "in_progress",
    "in-progress": "in_progress",
    "ongoing": "in_progress",
    "active": "in_progress",
    "on_scene": "in_progress",
    "on-scene": "in_progress",
    "on scene": "in_progress",
    "arrived": "in_progress",
    "handling": "in_progress",
    
    // Resolved variations
    "resolved": "resolved",
    "complete": "resolved",
    "completed": "resolved",
    "done": "resolved",
    "finished": "resolved",
    
    // Closed variations
    "closed": "closed",
    "cancelled": "closed",
    "canceled": "closed",
  };

  const normalized = statusMap[lowercaseStatus] || lowercaseStatus;
  
  // Validate it's a valid backend status
  const validStatuses = ["reported", "under_investigation", "in_progress", "resolved", "closed"];
  return validStatuses.includes(normalized) ? normalized : "reported";
};

// Normalize all incidents in array
const normalizeIncidents = (incidents: any[]): any[] => {
  if (!Array.isArray(incidents)) return [];
  return incidents.map(incident => {
    // Try multiple field names for status
    let rawStatus = 
      incident.status || 
      incident.incident_status || 
      incident.report_status ||
      incident.backend_status ||
      incident.statusCode ||
      incident.state ||
      incident.type_status;
    
    console.log("🔍 Normalizing incident:", {
      report_id: incident.report_id,
      backend_accident_id: incident.backend_accident_id,
      rawStatus,
      statusField: incident.status,
      incident_status: incident.incident_status,
      report_status: incident.report_status,
      normalized: normalizeStatus(rawStatus),
    });
    
    return {
      ...incident,
      status: normalizeStatus(rawStatus),
    };
  });
};

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
        const response = await apiClient.get("/accidents/");
        const incidents = Array.isArray(response) ? response : response?.data || [];
        return normalizeIncidents(incidents);
      } catch (error: any) {
        // If 403 Forbidden (likely a USER role), try user-specific endpoint
        if (error?.response?.status === 403 && user?.role === "USER") {
          try {
            // Try alternative endpoint for user's own reports
            const response = await apiClient.get("/user/incidents");
            const incidents = Array.isArray(response) ? response : response?.data || [];
            return normalizeIncidents(incidents);
          } catch (userError: any) {
            if (userError?.response?.status === 404) {
              // If user endpoints don't exist, try with query parameter
              const response = await apiClient.get(`/accidents/?userId=${user?.id}`);
              const incidents = Array.isArray(response) ? response : response?.data || [];
              return normalizeIncidents(incidents);
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

// Responder-specific hook: Get only incidents assigned to the current responder via dispatch records
export const useGetMyAssignedIncidents = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: [...accidentKeys.all, "my-assigned"],
    queryFn: async () => {
      console.log("=== FETCHING RESPONDER ASSIGNMENTS ===");
      let assignments: any[] = [];
      const endpointsToTry = [
        "/dispatch/my-assignments",
        "/dispatch/active",
        "/dispatch/pending",
        "/dispatch/",
      ];

      // Try multiple endpoints with fallback logic
      for (const endpoint of endpointsToTry) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await apiClient.get(endpoint);
          assignments = Array.isArray(response)
            ? response
            : response?.data || [];

          console.log(
            `✓ ${endpoint} returned:`,
            assignments.length,
            "items",
            assignments,
          );

          if (assignments.length > 0) {
            console.log(`✓ Successfully retrieved assignments from ${endpoint}`);
            break; // Exit loop after first successful response
          }
        } catch (err: any) {
          console.warn(
            `✗ ${endpoint} failed (${err?.response?.status}):`,
            err?.message,
          );
          continue; // Try next endpoint
        }
      }

      if (!assignments.length) {
        console.log("⚠ No assignments found from any endpoint");
        return [];
      }

      // Fetch all incidents for reference
      let allIncidents: any[] = [];
      try {
        const allIncidentsResponse = await apiClient.get("/accidents/");
        allIncidents = Array.isArray(allIncidentsResponse)
          ? allIncidentsResponse
          : allIncidentsResponse?.data || [];

        // Normalize all incidents to ensure status is correct
        allIncidents = normalizeIncidents(allIncidents);

        console.log("Total incidents available:", allIncidents.length);
      } catch (err: any) {
        console.error("Failed to fetch incidents:", err?.message);
        return [];
      }

      // Extract accident IDs from assignments
      const assignedAccidentIds = new Set<string | number>();
      assignments.forEach((assignment: any, idx: number) => {
        const ids: (string | number)[] = [];

        // Try all possible accident ID fields in assignment
        if (assignment.accidentId) ids.push(assignment.accidentId);
        if (assignment.accident_id) ids.push(assignment.accident_id);
        if (assignment.incidentId) ids.push(assignment.incidentId);
        if (assignment.incident_id) ids.push(assignment.incident_id);
        if (assignment.report_id) ids.push(assignment.report_id);
        if (assignment.reportId) ids.push(assignment.reportId);

        ids.forEach((id) => {
          assignedAccidentIds.add(String(id));
        });

        console.log(
          `Assignment ${idx}: IDs = [${ids.join(", ")}], Full =`,
          assignment,
        );
      });

      console.log("Accident IDs to match:", Array.from(assignedAccidentIds));

      // Match incidents to assignments
      const myIncidents: any[] = [];

      allIncidents.forEach((incident: any) => {
        const incidentIds = [
          incident.id,
          incident.report_id,
          incident.reportId,
          incident.backend_accident_id,
          incident.backendAccidentId,
          incident.backend_report_number,
          incident.backendReportNumber,
          incident.accident_id,
          incident.accidentId,
        ].filter(Boolean);

        const isMatched = incidentIds.some((id: any) =>
          assignedAccidentIds.has(String(id)),
        );

        if (isMatched) {
          myIncidents.push(incident);
          console.log(
            "✓ MATCHED incident IDs:",
            incidentIds,
            "Status:",
            incident.status,
            "Details:",
            incident,
          );
        }
      });

      console.log(
        "✓ RESULT: Found",
        myIncidents.length,
        "matching incidents",
      );
      console.log("Matched incidents:", myIncidents);

      return myIncidents;
    },
    enabled: !!user && user?.role === "Responder",
    staleTime: 0, // Consider data stale immediately for real-time updates
    refetchInterval: 2000, // Refetch every 2 seconds for faster sync
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
  });
};

export const useGetAccidentById = (id: string | number | undefined) =>
  useQuery({
    queryKey: accidentKeys.detail(id!),
    queryFn: async () => {
      const response = await apiClient.get(`/accidents/${id}`);
      const incident = Array.isArray(response) ? response[0] : response?.data || response;
      return { ...incident, status: normalizeStatus(incident?.status) };
    },
    enabled: !!id,
  });

export const useGetAccidentByReportNumber = (
  reportNumber: string | undefined,
) =>
  useQuery({
    queryKey: [...accidentKeys.all, "report", reportNumber],
    queryFn: async () => {
      const response = await apiClient.get(`/accidents/report/${reportNumber}`);
      const incidents = Array.isArray(response) ? response : response?.data || [];
      return normalizeIncidents(incidents);
    },
    enabled: !!reportNumber,
  });

export const useGetAccidentsByStatus = (status: string | undefined) =>
  useQuery({
    queryKey: [...accidentKeys.all, "status", status],
    queryFn: async () => {
      const response = await apiClient.get(`/accidents/status/${status}`);
      const incidents = Array.isArray(response) ? response : response?.data || [];
      return normalizeIncidents(incidents);
    },
    enabled: !!status,
  });

export const useGetAccidentsByOfficer = (officerId: string | undefined) =>
  useQuery({
    queryKey: [...accidentKeys.all, "officer", officerId],
    queryFn: async () => {
      const response = await apiClient.get(`/accidents/officer/${officerId}`);
      const incidents = Array.isArray(response) ? response : response?.data || [];
      return normalizeIncidents(incidents);
    },
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
      status,
      description,
    }: {
      accidentId: string | number;
      status?: string;
      description?: string;
    }) =>
      apiClient.patch(`/accidents/${accidentId}`, {
        status,
        description,
      }),
    onSuccess: (_, { accidentId }) => {
      console.log("Responder response updated:", accidentId);
      // Invalidate specific incident detail
      queryClient.invalidateQueries({
        queryKey: accidentKeys.detail(accidentId),
      });
      // Invalidate all accident lists to refresh status
      queryClient.invalidateQueries({ queryKey: accidentKeys.lists() });
      // ** CRITICAL: Invalidate responder's assigned incidents query **
      queryClient.invalidateQueries({
        queryKey: [...accidentKeys.all, "my-assigned"],
      });
      // Also invalidate pending dispatches to sync across views
      queryClient.invalidateQueries({
        queryKey: ["dispatches", "my-pending"],
      });
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
