import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Shield } from "lucide-react";

import AppHeader from "@/components/AppHeader";
import IncidentDetailPanel from "@/components/IncidentDetailPanel";
import ResponderDashboardView from "@/components/responder/ResponderDashboardView";
import type { ResponderSession } from "@/components/responder/ResponderTypes";
import { toast } from "sonner";
import { useGetAccidents } from "@/hooks/useAccidents";
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

  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );

  // React Query hooks
  const { data: accidentsResponse } = useGetAccidents();
  const { data: pendingDispatches = [] } = useGetMyPendingDispatches();
  const acceptDispatchMutation = useAcceptDispatch();
  const rejectDispatchMutation = useRejectDispatch();

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
  const incidents = accidentsData.map(mapBackendAccidentToIncident);
  const assignedStatuses = ["Submitted", "Under Review"];
  const completedStatuses = ["Resolved", "Closed"];

  const selectedIncident = selectedIncidentId
    ? (incidents.find(
        (incident) => incident.report_id === selectedIncidentId,
      ) ?? null)
    : null;
  const activeIncidents = incidents.filter((incident) =>
    assignedStatuses.includes(incident.status),
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
        onLogout={handleLogout}
      />
    </div>
  );
}
