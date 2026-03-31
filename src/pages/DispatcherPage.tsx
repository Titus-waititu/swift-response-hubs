import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import IncidentDetailPanel from "@/components/IncidentDetailPanel";
import DispatcherDashboardView from "@/components/dispatcher/DispatcherDashboardView";
import type { DispatcherSession } from "@/components/dispatcher/DispatcherTypes";
import type { IncidentStatus } from "@/types/incident";
import { toast } from "sonner";
import { BarChart3, MapPin, Radio } from "lucide-react";
import { useGetAccidents } from "@/hooks/useAccidents";
import { useUpdateAccidentStatus } from "@/hooks/useAccidents";
import {
  getDispatcherQueueStats,
  getIncidentTypeBreakdown,
  getResponseTimeMetrics,
} from "@/lib/incident-analytics";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";

const DISPATCHER_SESSION_KEY = "swift-response-hub/dispatcher-session/v1";

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function DispatcherPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<DispatcherSession | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const rawSession = window.localStorage.getItem(DISPATCHER_SESSION_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as DispatcherSession;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<"queue" | "map" | "analytics">(
    "queue",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );

  // React Query hooks
  const { data: accidentsResponse } = useGetAccidents();
  const updateStatusMutation = useUpdateAccidentStatus();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/login?role=dispatcher");
    }
  }, [session, navigate]);

  // Derived incidents from API - handle axios response structure
  const accidentsData = Array.isArray(accidentsResponse)
    ? accidentsResponse
    : (accidentsResponse as any)?.data || [];
  const incidents = accidentsData.map(mapBackendAccidentToIncident);

  const selectedIncident = selectedIncidentId
    ? (incidents.find(
        (incident) => incident.report_id === selectedIncidentId,
      ) ?? null)
    : null;

  const filtered = incidents.filter((incident) => {
    const query = search.toLowerCase();
    const matchSearch =
      incident.report_id.toLowerCase().includes(query) ||
      incident.short_description.toLowerCase().includes(query) ||
      incident.location_address.toLowerCase().includes(query) ||
      incident.incident_type.toLowerCase().includes(query);
    const matchStatus =
      statusFilter === "all" || incident.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const queueStats = getDispatcherQueueStats(incidents);
  const incidentTypeBreakdown = getIncidentTypeBreakdown(incidents);
  const responseMetrics = getResponseTimeMetrics(incidents);
  const statusOptions: IncidentStatus[] = [
    "reported",
    "under_investigation",
    "in_progress",
    "resolved",
    "closed",
  ];
  const dispatcherNavItems = [
    {
      label: "Queue",
      icon: Radio,
      onClick: () => setActiveTab("queue"),
      isActive: activeTab === "queue",
    },
    {
      label: "Map",
      icon: MapPin,
      onClick: () => setActiveTab("map"),
      isActive: activeTab === "map",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      onClick: () => setActiveTab("analytics"),
      isActive: activeTab === "analytics",
    },
  ];
  const dispatcherBadge = session ? getInitials(session.name) || "DP" : "DP";

  const handleLogout = () => {
    window.localStorage.removeItem(DISPATCHER_SESSION_KEY);
    setSelectedIncidentId(null);
    setSearch("");
    setStatusFilter("all");
    setSession(null);
    toast.info("Dispatcher signed out");
    navigate("/");
  };

  const handleDashboardHome = () => {
    setSelectedIncidentId(null);
    setSearch("");
    setStatusFilter("all");
    setActiveTab("queue");
  };

  const handleSyncStatus = (
    incident: (typeof incidents)[number],
    nextStatus: IncidentStatus,
  ) => {
    if (!incident.backend_accident_id) {
      return;
    }

    const statusUpdateData: any = { status: nextStatus };

    // Set resolved_time when marking as resolved or closed
    if (
      (nextStatus === "resolved" || nextStatus === "closed") &&
      !incident.resolved_time
    ) {
      statusUpdateData.resolved_time = new Date().toISOString();
    }

    updateStatusMutation.mutate(
      {
        id: incident.backend_accident_id,
        data: statusUpdateData,
      },
      {
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? `Backend status sync failed: ${error.message}`
              : "Backend status sync failed",
          );
        },
      },
    );
  };

  if (!session) {
    return null; // Redirecting in useEffect
  }

  if (selectedIncident) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          brandTo="/dispatcher"
          brandLabel="Dispatcher"
          onBrandClick={handleDashboardHome}
          navItems={dispatcherNavItems}
          userBadge={dispatcherBadge}
        />
        <IncidentDetailPanel
          incident={selectedIncident}
          onBack={() => setSelectedIncidentId(null)}
          role="dispatcher"
          onSyncStatus={handleSyncStatus}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        brandTo="/dispatcher"
        brandLabel="Dispatcher"
        onBrandClick={handleDashboardHome}
        navItems={dispatcherNavItems}
        userBadge={dispatcherBadge}
        showLogout={true}
        onLogout={handleLogout}
      />
      <DispatcherDashboardView
        session={session}
        incidents={incidents}
        filteredIncidents={filtered}
        activeTab={activeTab}
        queueStats={queueStats}
        statusOptions={statusOptions}
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onActiveTabChange={setActiveTab}
        onSelectIncident={setSelectedIncidentId}
        onLogout={handleLogout}
        incidentTypeBreakdown={incidentTypeBreakdown}
        responseMetrics={responseMetrics}
      />
    </div>
  );
}
