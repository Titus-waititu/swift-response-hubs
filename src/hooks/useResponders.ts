import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Query Keys
export const respondersKeys = {
  all: ["dispatches"] as const,
  lists: () => [...respondersKeys.all, "active"] as const,
  detail: (id: string) => [...respondersKeys.all, "detail", id] as const,
  statistics: () => [...respondersKeys.all, "statistics"] as const,
};

// Helper to map dispatch status to responder status
const mapDispatchStatus = (
  status: string,
): "available" | "en-route" | "on-scene" | "unavailable" => {
  const statusMap: Record<
    string,
    "available" | "en-route" | "on-scene" | "unavailable"
  > = {
    pending: "unavailable",
    dispatched: "en-route",
    arrived: "on-scene",
    completed: "available",
    cancelled: "unavailable",
    "en-route": "en-route",
    "on-scene": "on-scene",
    available: "available",
  };
  return statusMap[status?.toLowerCase()] || "unavailable";
};

// Queries - Use dispatch endpoints as responders are accessed via active dispatches
export const useGetResponders = () =>
  useQuery<any>({
    queryKey: respondersKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get("/dispatch/active");
      // apiClient interceptor already extracts response.data, so response IS the data array
      const data = Array.isArray(response) ? response : response?.data || [];

      return data.map((dispatch: any) => ({
        id: dispatch.responderId || dispatch.id,
        name: dispatch.serviceProvider || "Unknown Service",
        role: (dispatch.type || "ambulance").toLowerCase() as
          | "ambulance"
          | "fire"
          | "police",
        phone: dispatch.contactNumber || "N/A",
        location: dispatch.location || "En Route",
        status: mapDispatchStatus(dispatch.status),
        currentAssignment: dispatch.accidentId || undefined,
        estimatedAvailable: dispatch.arrivedAt ? "On Scene" : undefined,
        dispatchData: dispatch, // Keep original data
      }));
    },
  });

// Fetch all responder users with emergency_responder role
export const useGetResponderUsers = () =>
  useQuery<any>({
    queryKey: [...respondersKeys.all, "users"],
    queryFn: async () => {
      const response = await apiClient.get("/users/role/emergency_responder");
      // apiClient interceptor already extracts response.data, so response IS the data array
      const data = Array.isArray(response) ? response : response?.data || [];

      console.log("useGetResponderUsers raw data:", data);

      return data.map((user: any) => {
        const transformed = {
          id: user.id,
          name: user.fullName || user.name || "Unknown",
          // Default to ambulance since emergency_responder role doesn't specify type
          role: mapUserTypeToRole(
            user.emergencyServiceType || user.type || "ambulance",
          ),
          phone: user.phoneNumber || user.phone || "N/A",
          location: user.location || "Station",
          // Use isActive to determine status - if not active, mark as unavailable
          status: user.isActive ? "available" : "unavailable",
          currentAssignment: user.currentAssignmentId || undefined,
          estimatedAvailable: user.estimatedAvailableTime || undefined,
          userData: user, // Keep original data
        };
        console.log("Transformed user:", transformed);
        return transformed;
      });
    },
  });

// Helper to map user type to responder role
const mapUserTypeToRole = (type: string): "ambulance" | "fire" | "police" => {
  const typeMap: Record<string, "ambulance" | "fire" | "police"> = {
    ambulance: "ambulance",
    paramedic: "ambulance",
    fire: "fire",
    firefighter: "fire",
    police: "police",
    officer: "police",
  };
  return typeMap[type?.toLowerCase()] || "ambulance";
};

// Helper to map user status to responder status
const mapUserStatusToResponderStatus = (
  status: string,
): "available" | "en-route" | "on-scene" | "unavailable" => {
  const statusMap: Record<
    string,
    "available" | "en-route" | "on-scene" | "unavailable"
  > = {
    active: "available",
    available: "available",
    "en-route": "en-route",
    "on-scene": "on-scene",
    inactive: "unavailable",
    offline: "unavailable",
    "on-duty": "available",
    "off-duty": "unavailable",
  };
  return statusMap[status?.toLowerCase()] || "unavailable";
};

export const useGetResponderById = (id: string | undefined) =>
  useQuery({
    queryKey: respondersKeys.detail(id!),
    queryFn: () => apiClient.get(`/dispatch/${id}/details`),
    enabled: !!id,
  });

export const useGetAvailableResponders = () =>
  useQuery({
    queryKey: [...respondersKeys.all, "available"],
    queryFn: async () => {
      const response = await apiClient.get("/dispatch/active");
      // apiClient interceptor already extracts response.data, so response IS the data array
      const data = Array.isArray(response) ? response : response?.data || [];

      // Filter for available/en-route responders only
      return data
        .filter(
          (d: any) =>
            d.status === "available" ||
            d.status === "en-route" ||
            d.status === "pending",
        )
        .map((dispatch: any) => ({
          id: dispatch.responderId || dispatch.id,
          name: dispatch.serviceProvider || "Unknown Service",
          role: (dispatch.type || "ambulance").toLowerCase() as
            | "ambulance"
            | "fire"
            | "police",
          phone: dispatch.contactNumber || "N/A",
          location: dispatch.location || "En Route",
          status: mapDispatchStatus(dispatch.status),
          dispatchData: dispatch,
        }));
    },
  });

export const useGetDispatchStatistics = () =>
  useQuery({
    queryKey: respondersKeys.statistics(),
    queryFn: () => apiClient.get("/dispatch/statistics"),
  });

// Mutations
export const useDispatchResponder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      responderId,
      incidentId,
      incidentData,
    }: {
      responderId: string;
      incidentId: string;
      incidentData?: any;
    }) => {
      // Convert severity string to number (0-100)
      let severityNum = 50;
      if (incidentData?.severity) {
        const severityMap: Record<string, number> = {
          low: 25,
          moderate: 50,
          high: 75,
          critical: 100,
        };
        severityNum =
          severityMap[String(incidentData.severity).toLowerCase()] ||
          parseInt(incidentData.severity as string) ||
          50;
      }

      // Map incidentData to API expected format
      const payload = {
        responderId,
        accidentId: incidentId, // Include accident ID
        serviceType:
          incidentData?.serviceType || incidentData?.type || "ambulance",
        severity: severityNum, // Ensure it's a number
        incidentDescription:
          incidentData?.description ||
          incidentData?.incidentDescription ||
          "Dispatch to incident",
        latitude:
          typeof incidentData?.latitude === "string"
            ? parseFloat(incidentData.latitude)
            : incidentData?.latitude || 0, // Ensure it's a number
        longitude:
          typeof incidentData?.longitude === "string"
            ? parseFloat(incidentData.longitude)
            : incidentData?.longitude || 0, // Ensure it's a number
      };

      console.log("Dispatching with payload:", payload);
      return apiClient.post(`/dispatch/send-to-responder`, payload);
    },
    onSuccess: (data) => {
      console.log("Dispatch successful:", data);
      queryClient.invalidateQueries({ queryKey: respondersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: respondersKeys.statistics() });
    },
    onError: (error: any) => {
      console.error(
        "Dispatch error:",
        error?.response?.data || error?.message || error,
      );
    },
  });
};

export const useBroadcastToResponders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      message,
      type = "alert",
      priority = "high",
    }: {
      message: string;
      type?: "alert" | "info" | "warning" | "success";
      priority?: "low" | "medium" | "high" | "critical";
    }) =>
      apiClient.post("/notifications/send", {
        message,
        type,
        priority,
        recipients: "responder", // Send to responder role
      }),
    onSuccess: (data) => {
      console.log("Broadcast sent successfully:", data);
      queryClient.invalidateQueries({ queryKey: respondersKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Broadcast error:", error?.response?.data || error);
    },
  });
};

export const useGetDispatchDetails = (id: string | undefined) =>
  useQuery({
    queryKey: respondersKeys.detail(id!),
    queryFn: () => apiClient.get(`/dispatch/${id}/details`),
    enabled: !!id,
  });

// Responder-specific hooks - for viewing and accepting dispatches
export const useGetMyPendingDispatches = () => {
  return useQuery({
    queryKey: [...respondersKeys.all, "my-pending"],
    queryFn: async () => {
      const response = await apiClient.get("/dispatch/my-pending");
      const data = Array.isArray(response) ? response : response?.data || [];
      console.log("My pending dispatches:", data);
      return data;
    },
  });
};

export const useAcceptDispatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dispatchId: string) =>
      apiClient.patch(`/dispatch/${dispatchId}/accept`),
    onSuccess: () => {
      console.log("Dispatch accepted");
      queryClient.invalidateQueries({
        queryKey: [...respondersKeys.all, "my-pending"],
      });
      queryClient.invalidateQueries({ queryKey: respondersKeys.lists() });
    },
    onError: (error: any) => {
      console.error("Accept dispatch error:", error?.response?.data || error);
    },
  });
};

export const useRejectDispatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dispatchId: string) =>
      apiClient.patch(`/dispatch/${dispatchId}/reject`),
    onSuccess: () => {
      console.log("Dispatch rejected");
      queryClient.invalidateQueries({
        queryKey: [...respondersKeys.all, "my-pending"],
      });
    },
    onError: (error: any) => {
      console.error("Reject dispatch error:", error?.response?.data || error);
    },
  });
};
