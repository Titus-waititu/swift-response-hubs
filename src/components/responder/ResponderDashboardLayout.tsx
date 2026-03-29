import { useCallback, useMemo, useState } from "react";
import {
  useGetAccidents,
  useUpdateResponderResponse,
  useNotifyDispatcherOfResponse,
} from "@/hooks/useAccidents";
import {
  useGetUnreadNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/useNotifications";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import { toast } from "sonner";

import ActiveDispatchCard from "./ActiveDispatchCard";
import DispatchQueueList from "./DispatchQueueList";
import IncidentDetailsDrawer from "./IncidentDetailsDrawer";
import StatusTimeline from "./StatusTimeline";
import ResponderTopBar from "./ResponderTopBar";
import ResponderSidebar from "./ResponderSidebar";

interface ResponderDashboardLayoutProps {
  userName?: string;
  unitLabel?: string;
  onLogout?: () => void;
}

export default function ResponderDashboardLayout({
  userName = "Responder",
  unitLabel = "Unit 1",
  onLogout,
}: ResponderDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingIncidentId, setUpdatingIncidentId] = useState<string | null>(
    null,
  );

  // Data fetching
  const { data: accidentsResponse, refetch: refetchAccidents } =
    useGetAccidents();
  const { data: unreadNotificationsResponse = [] } =
    useGetUnreadNotifications();
  const updateResponderMutation = useUpdateResponderResponse();
  const notifyDispatcherMutation = useNotifyDispatcherOfResponse();
  const markAsReadMutation = useMarkNotificationAsRead();

  // Real-time polling
  useRealtimeUpdates({
    queryKeys: [["accidents"]],
    interval: 5000,
    enabled: true,
  });

  // Transform data
  const accidentsData = useMemo(() => {
    const data = Array.isArray(accidentsResponse)
      ? accidentsResponse
      : accidentsResponse?.data || [];
    return data.map(mapBackendAccidentToIncident);
  }, [accidentsResponse]);

  // Filter incidents - only active/dispatched
  const activeIncidents = useMemo(() => {
    return accidentsData
      .filter((i) =>
        ["Submitted", "Under Review", "Dispatched", "In Progress"].includes(
          i.status,
        ),
      )
      .sort((a, b) => {
        // Prioritize Critical > High > Medium > Low
        const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        const severityDiff =
          (severityOrder[a.severity_level as keyof typeof severityOrder] ||
            99) -
          (severityOrder[b.severity_level as keyof typeof severityOrder] || 99);
        if (severityDiff !== 0) return severityDiff;
        // Then by time
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [accidentsData]);

  // Get active dispatch (first in queue)
  const activeDispatch = activeIncidents[0] || null;

  // Filter queue (all except active)
  const dispatchQueue = useMemo(() => {
    return activeIncidents.slice(1);
  }, [activeIncidents]);

  // Get selected incident
  const selectedIncident = useMemo(() => {
    return selectedIncidentId
      ? activeIncidents.find((i) => i.report_id === selectedIncidentId) || null
      : null;
  }, [selectedIncidentId, activeIncidents]);

  // Unread notifications count
  const unreadNotifications = Array.isArray(unreadNotificationsResponse)
    ? unreadNotificationsResponse
    : unreadNotificationsResponse?.data || [];
  const unreadCount = unreadNotifications.length;

  // Handle status update
  const handleStatusUpdate = useCallback(
    async (incident: any, newStatus: string) => {
      setUpdatingIncidentId(incident.report_id);
      try {
        const statusMap: Record<string, string> = {
          Accepted: "Accepted",
          "En Route": "In Progress",
          "On Scene": "In Progress",
          Completed: "Resolved",
        };

        const accidentId = incident.backend_accident_id || incident.report_id;
        const backendStatus = statusMap[newStatus] || newStatus;

        // Update responder response
        await updateResponderMutation.mutateAsync({
          accidentId,
          description: `Responder status: ${newStatus}`,
        });

        // Notify dispatcher
        await notifyDispatcherMutation.mutateAsync({
          title: `Responder Update - ${incident.incident_type}`,
          message: `Responder status updated to ${newStatus} at ${incident.location_address}`,
          priority: newStatus === "On Scene" ? "urgent" : "high",
          accidentId,
        });

        toast.success(`Status updated to ${newStatus}`, {
          description: "Dispatcher notified of your status change",
        });

        refetchAccidents();
      } catch (error: any) {
        toast.error("Failed to update status", {
          description: error?.message || "Please try again",
        });
      } finally {
        setUpdatingIncidentId(null);
      }
    },
    [updateResponderMutation, notifyDispatcherMutation, refetchAccidents],
  );

  // Handle mark as read
  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsReadMutation.mutate(notificationId);
    },
    [markAsReadMutation],
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <ResponderSidebar
        currentPage="dashboard"
        onPageChange={() => {}}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={userName}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <ResponderTopBar
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          unreadCount={unreadCount}
        />

        {/* Main area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 md:p-6">
            {/* Left: Active Dispatch + Queue */}
            <div className="lg:col-span-2 space-y-4 overflow-y-auto">
              {/* Active Dispatch (Primary Focus) */}
              {activeDispatch ? (
                <ActiveDispatchCard
                  incident={activeDispatch}
                  isUpdating={updatingIncidentId === activeDispatch.report_id}
                  onStatusUpdate={(status) =>
                    handleStatusUpdate(activeDispatch, status)
                  }
                  onViewDetails={() =>
                    setSelectedIncidentId(activeDispatch.report_id)
                  }
                />
              ) : (
                <div className="rounded-lg border-2 border-dashed border-border bg-card p-8 text-center">
                  <div className="text-6xl mb-4">😌</div>
                  <h3 className="text-lg font-semibold text-foreground">
                    No Active Emergencies
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    You're all caught up. New dispatches will appear here.
                  </p>
                </div>
              )}

              {/* Timeline */}
              {activeDispatch && <StatusTimeline incident={activeDispatch} />}

              {/* Dispatch Queue */}
              {dispatchQueue.length > 0 && (
                <DispatchQueueList
                  incidents={dispatchQueue}
                  selectedId={selectedIncidentId}
                  onSelect={setSelectedIncidentId}
                  searchQuery={searchQuery}
                />
              )}
            </div>

            {/* Right: Incident Details Panel - Desktop only */}
            <div className="hidden lg:flex flex-col bg-card rounded-lg border border-border overflow-hidden">
              {selectedIncident ? (
                <IncidentDetailsDrawer
                  incident={selectedIncident}
                  isOpen={!!selectedIncident}
                  onClose={() => setSelectedIncidentId(null)}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Select an incident to view details
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: Incident Details Drawer */}
            {selectedIncident && (
              <IncidentDetailsDrawer
                incident={selectedIncident}
                isOpen={!!selectedIncident}
                onClose={() => setSelectedIncidentId(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
