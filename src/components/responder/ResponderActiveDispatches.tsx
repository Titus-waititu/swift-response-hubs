import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Zap,
  PhoneCall,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useGetAccidents } from "@/hooks/useAccidents";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import { formatTimeAgo } from "@/lib/incident-utils";
import { getNextStatuses, getStatusLabel } from "@/lib/status-utils";
import type { IncidentStatus } from "@/types/incident";
import { toast } from "sonner";

interface ResponderActiveDispatchesProps {
  onStatusUpdate?: (incident: any, newStatus: IncidentStatus) => void;
}

export default function ResponderActiveDispatches({
  onStatusUpdate,
}: ResponderActiveDispatchesProps) {
  const { data: accidentsResponse, refetch } = useGetAccidents();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Enable real-time polling
  useRealtimeUpdates({
    queryKeys: [["accidents"]],
    interval: 5000,
    enabled: true,
  });

  // Get only active/dispatched incidents
  const activeDispatches = useMemo(() => {
    const accidentsData = Array.isArray(accidentsResponse)
      ? accidentsResponse
      : accidentsResponse || [];

    return accidentsData
      .map(mapBackendAccidentToIncident)
      .filter((i) =>
        ["reported", "under_investigation", "in_progress"].includes(i.status),
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [accidentsResponse]);

  const handleStatusUpdate = async (
    incident: any,
    newStatus: IncidentStatus,
  ) => {
    setUpdatingId(incident.report_id);
    try {
      onStatusUpdate?.(incident, newStatus);
      const statusLabel = getStatusLabel(newStatus);
      toast.success(`Status updated to ${statusLabel}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      case "Medium":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "reported":
      case "under_investigation":
        return "outline";
      case "in_progress":
        return "secondary";
      case "resolved":
        return "default";
      default:
        return "outline";
    }
  };

  const DispatchCard = ({ dispatch }: { dispatch: any }) => (
    <div
      key={dispatch.report_id}
      className={`border-l-4 rounded-lg overflow-hidden transition-all ${
        dispatch.severity_level === "Critical"
          ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
          : dispatch.severity_level === "High"
            ? "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
            : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
      }`}
    >
      <div
        className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() =>
          setExpandedId(
            expandedId === dispatch.report_id ? null : dispatch.report_id,
          )
        }
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                dispatch.severity_level === "Critical"
                  ? "bg-red-100 dark:bg-red-900/40"
                  : dispatch.severity_level === "High"
                    ? "bg-orange-100 dark:bg-orange-900/40"
                    : "bg-blue-100 dark:bg-blue-900/40"
              }`}
            >
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                {dispatch.incident_type}
              </h3>
              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{dispatch.location_address}</span>
              </div>
            </div>
          </div>
          <ChevronRight
            className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 ${
              expandedId === dispatch.report_id ? "rotate-90" : ""
            }`}
          />
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Badge variant={getSeverityColor(dispatch.severity_level)}>
            {dispatch.severity_level}
          </Badge>
          <Badge variant={getStatusBadgeVariant(dispatch.status)}>
            {dispatch.status}
          </Badge>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(dispatch.created_at)}
          </div>
        </div>

        {/* Expanded Content */}
        {expandedId === dispatch.report_id && (
          <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-4">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  Reporter
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {dispatch.reporter_name}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  Contact
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {dispatch.phone_number}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 mb-1">
                Incident Description
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {dispatch.short_description}
              </p>
            </div>

            {/* Victims & Vehicles */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {dispatch.number_of_victims > 0 && (
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    🚑 Victims
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {dispatch.number_of_victims}
                  </p>
                </div>
              )}
              {dispatch.vehicles_involved > 0 && (
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    🚗 Vehicles
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {dispatch.vehicles_involved}
                  </p>
                </div>
              )}
            </div>

            {/* GPS Coordinates */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900/30 rounded-lg text-sm">
              <p className="font-medium text-slate-900 dark:text-slate-50 mb-1">
                📍 Location
              </p>
              <p className="text-slate-600 dark:text-slate-400 font-mono">
                {dispatch.gps_latitude.toFixed(4)},{" "}
                {dispatch.gps_longitude.toFixed(4)}
              </p>
            </div>

            {/* Status Update Buttons */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                Update Status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {getNextStatuses(dispatch.status).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="outline"
                    disabled={updatingId === dispatch.report_id}
                    onClick={() => handleStatusUpdate(dispatch, status)}
                    className={`text-xs ${
                      updatingId === dispatch.report_id ? "opacity-50" : ""
                    }`}
                  >
                    {updatingId === dispatch.report_id ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mr-1" />
                        Updating...
                      </>
                    ) : (
                      getStatusLabel(status)
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <Button
              size="sm"
              className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
              onClick={() => {
                window.location.href = `tel:${dispatch.phone_number}`;
              }}
            >
              <PhoneCall className="h-4 w-4" />
              Call Reporter
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Active Dispatches
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            {activeDispatches.length} incident
            {activeDispatches.length !== 1 ? "s" : ""} assigned to you
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {activeDispatches.length > 0 ? (
          <div className="space-y-3">
            {activeDispatches.map((dispatch) => (
              <DispatchCard key={dispatch.report_id} dispatch={dispatch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-500 text-4xl mb-3">
              🎉
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              No active dispatches at the moment
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              You're all caught up!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
