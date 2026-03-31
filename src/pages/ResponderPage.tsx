import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import AppHeader from "@/components/AppHeader";
import IncidentDetailPanel from "@/components/IncidentDetailPanel";
import ResponderDashboardView from "@/components/responder/ResponderDashboardView";
import type { ResponderSession } from "@/components/responder/ResponderTypes";
import { toast } from "sonner";
import {
  useGetAccidents,
  useUpdateResponderResponse,
  useNotifyDispatcherOfResponse,
  useGetMyAssignedIncidents,
} from "@/hooks/useAccidents";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import {
  useGetMyPendingDispatches,
  useAcceptDispatch,
  useRejectDispatch,
} from "@/hooks/useResponders";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";

const RESPONDER_SESSION_KEY = "swift-response-hub/responder-session/v1";

function getInitials(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function ResponderPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<ResponderSession | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawSession = window.localStorage.getItem(RESPONDER_SESSION_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as ResponderSession;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "notifications"
  >("active");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );

  // React Query hooks
  const { data: accidentsResponse, refetch: refetchAccidents } =
    useGetMyAssignedIncidents();
  const { data: pendingDispatches = [], refetch: refetchDispatches } =
    useGetMyPendingDispatches(!!session);
  const acceptDispatchMutation = useAcceptDispatch();
  const rejectDispatchMutation = useRejectDispatch();
  const updateResponderMutation = useUpdateResponderResponse();
  const notifyDispatcherMutation = useNotifyDispatcherOfResponse();

  const queryClient = useQueryClient();

  // Fetch assignments immediately on login
  useEffect(() => {
    if (session) {
      console.log(
        "Session established, fetching assigned incidents and dispatches...",
      );
      // Invalidate both responder assignment queries to trigger fresh fetches
      queryClient.invalidateQueries({
        queryKey: ["accidents", "my-assigned"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["dispatches", "active", "my-pending"],
        exact: false,
      });
    }
  }, [session, queryClient]);

  // Enable real-time polling
  useRealtimeUpdates({
    queryKeys: [["accidents"]],
    interval: 5000,
    enabled: !!session,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/login?role=responder");
    }
  }, [session, navigate]);

  // Derived incidents from API - handle axios response structure
  const accidentsData = Array.isArray(accidentsResponse)
    ? accidentsResponse
    : (accidentsResponse as any)?.data || [];
  console.log("ResponderPage - Raw accidents data:", accidentsData);

  // Note: useGetMyAssignedIncidents returns already-normalized incidents, so skip remapping
  const incidents = accidentsData.map((incident: any) => {
    // Check if already has report_id (already normalized from my-assigned hook)
    if (incident.report_id) {
      return incident;
    }
    // Otherwise map it
    return mapBackendAccidentToIncident(incident);
  });
  console.log("ResponderPage - Mapped incidents:", incidents);

  const assignedStatuses = ["reported", "under_investigation"]; // Use normalized statuses
  const completedStatuses = ["resolved", "closed"]; // Use normalized statuses

  const selectedIncident = selectedIncidentId
    ? (incidents.find(
        (incident) => incident.report_id === selectedIncidentId,
      ) ?? null)
    : null;
  const activeIncidents = incidents.filter((incident) =>
    assignedStatuses.includes(incident.status),
  );
  console.log(
    "ResponderPage - Active incidents (count):",
    activeIncidents.length,
    "Incidents:",
    activeIncidents,
  );

  const completedIncidents = incidents.filter((incident) =>
    completedStatuses.includes(incident.status),
  );
  const dashboardNavItems = [
    {
      label: `Open (${activeIncidents.length})`,
      icon: Shield,
      onClick: () => setActiveTab("active"),
      isActive: activeTab === "active",
    },
    {
      label: `Completed (${completedIncidents.length})`,
      icon: ClipboardList,
      onClick: () => setActiveTab("completed"),
      isActive: activeTab === "completed",
    },
  ];
  const responderBadge = session
    ? getInitials(session.unitLabel) || "RS"
    : "RS";

  const handleResponderHome = () => {
    setSelectedIncidentId(null);
    setActiveTab("active");
  };

  const handleAcceptDispatch = (dispatchId: string) => {
    acceptDispatchMutation.mutate(dispatchId, {
      onSuccess: () => {
        toast.success("Dispatch accepted! New assignment added.");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to accept dispatch",
        );
      },
    });
  };

  const handleRejectDispatch = (dispatchId: string) => {
    rejectDispatchMutation.mutate(dispatchId, {
      onSuccess: () => {
        toast.success("Dispatch rejected.");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to reject dispatch",
        );
      },
    });
  };

  const handleStatusUpdate = async (incident: any, newStatus: string) => {
    try {
      const statusMap: Record<string, string> = {
        Accepted: "Accepted",
        "En Route": "In Progress",
        "On Scene": "In Progress",
        Completed: "Resolved",
      };

      const backendStatus = statusMap[newStatus] || newStatus;
      const accidentId = incident.backend_accident_id || incident.report_id;

      await updateResponderMutation.mutateAsync({
        accidentId,
        status: backendStatus,
        description: `Responder status: ${newStatus}`,
      });

      // Notify dispatcher
      await notifyDispatcherMutation.mutateAsync({
        title: `Responder Update - ${incident.incident_type}`,
        message: `Responder status updated to ${newStatus} at ${incident.location_address}`,
        priority: newStatus === "On Scene" ? "urgent" : "high",
        accidentId,
      });

      toast.success(`Status updated to ${newStatus}`);
      refetchAccidents();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(RESPONDER_SESSION_KEY);
    setSelectedIncidentId(null);
    setActiveTab("active");
    setSession(null);
    toast.info("Responder signed out");
    navigate("/");
  };

  if (!session) {
    return null; // Redirecting in useEffect
  }

  if (selectedIncident) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          brandTo="/responder"
          brandLabel="Responder"
          onBrandClick={handleResponderHome}
          navItems={dashboardNavItems}
          userBadge={responderBadge}
          showLogout={true}
          onLogout={handleLogout}
        />
        <IncidentDetailPanel
          incident={selectedIncident}
          onBack={() => setSelectedIncidentId(null)}
          role="responder"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        brandTo="/responder"
        brandLabel="Responder"
        onBrandClick={handleResponderHome}
        navItems={dashboardNavItems}
        userBadge={responderBadge}
        showLogout={true}
        onLogout={handleLogout}
      />
      <ResponderDashboardView
        session={session}
        activeTab={activeTab}
        activeIncidents={activeIncidents}
        completedIncidents={completedIncidents}
        pendingDispatches={pendingDispatches}
        onActiveTabChange={setActiveTab}
        onSelectIncident={setSelectedIncidentId}
        onAcceptDispatch={handleAcceptDispatch}
        onRejectDispatch={handleRejectDispatch}
        onStatusUpdate={handleStatusUpdate}
        onLogout={handleLogout}
      />
    </div>
  );
}
