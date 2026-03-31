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
  Zap,
  Clock,
  MapPin,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useGetAccidents } from "@/hooks/useAccidents";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import { formatTimeAgo } from "@/lib/incident-utils";

interface DispatcherIncidentsQueueProps {
  onSelectIncident?: (incident: any) => void;
}

const STATUS_PRIORITY = {
  Submitted: 1,
  "Under Review": 2,
  Dispatched: 3,
  Closed: 4,
};

export default function DispatcherIncidentsQueue({
  onSelectIncident,
}: DispatcherIncidentsQueueProps) {
  const { data: accidentsResponse, refetch } = useGetAccidents();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Enable real-time polling
  useRealtimeUpdates({
    queryKeys: [["accidents"]],
    interval: 5000,
    enabled: true,
  });

  // Transform and sort incidents
  const incidents = useMemo(() => {
    const accidentsData = Array.isArray(accidentsResponse)
      ? accidentsResponse
      : accidentsResponse?.data || [];

    return accidentsData.map(mapBackendAccidentToIncident).sort((a, b) => {
      // Sort by priority (submitted first) then by time
      const priorityDiff =
        (STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY] || 99) -
        (STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [accidentsResponse]);

  // Separate into active and closed
  const activeIncidents = incidents.filter((i) => i.status !== "Closed");
  const closedIncidents = incidents.filter((i) => i.status === "closed");

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

  const getSeverityIcon = (severity: string) => {
    return severity === "Critical" || severity === "High" ? (
      <AlertTriangle className="h-4 w-4" />
    ) : (
      <Zap className="h-4 w-4" />
    );
  };

  const IncidentCard = ({
    incident,
    isActive,
  }: {
    incident: any;
    isActive: boolean;
  }) => (
    <div
      key={incident.report_id}
      className={`border-l-4 rounded-lg overflow-hidden transition-all ${
        incident.severity_level === "Critical"
          ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
          : incident.severity_level === "High"
            ? "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
            : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
      }`}
    >
      <div
        className="p-4 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() =>
          setExpandedId(
            expandedId === incident.report_id ? null : incident.report_id,
          )
        }
      >
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-lg flex-shrink-0 ${
                incident.severity_level === "Critical"
                  ? "bg-red-100 dark:bg-red-900/40"
                  : incident.severity_level === "High"
                    ? "bg-orange-100 dark:bg-orange-900/40"
                    : "bg-blue-100 dark:bg-blue-900/40"
              }`}
            >
              {getSeverityIcon(incident.severity_level)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                {incident.incident_type}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">
                {incident.location_address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Badge variant={getSeverityColor(incident.severity_level)}>
              {incident.severity_level}
            </Badge>
            <ChevronRight
              className={`h-5 w-5 text-slate-400 transition-transform ${
                expandedId === incident.report_id ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(incident.created_at)}
          </div>
          <Badge variant="outline" className="text-xs">
            {incident.status}
          </Badge>
        </div>

        {/* Expanded Content */}
        {expandedId === incident.report_id && (
          <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  Reporter
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {incident.reporter_name}
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">
                  Phone
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {incident.phone_number}
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium text-slate-900 dark:text-slate-50 mb-1">
                Description
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {incident.short_description}
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-3 w-3" />
              {incident.gps_latitude.toFixed(4)},{" "}
              {incident.gps_longitude.toFixed(4)}
            </div>

            {isActive && (
              <Button
                onClick={() => onSelectIncident?.(incident)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                View & Assign Responders
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Active Incidents */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Incoming Incidents
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {activeIncidents.length} active incident
              {activeIncidents.length !== 1 ? "s" : ""}
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
        <CardContent className="space-y-3">
          {activeIncidents.length > 0 ? (
            activeIncidents.map((incident) => (
              <IncidentCard
                key={incident.report_id}
                incident={incident}
                isActive={true}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-slate-400 dark:text-slate-500 mb-2">📭</div>
              <p className="text-slate-600 dark:text-slate-400">
                No active incidents at this time
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Closed Incidents */}
      {closedIncidents.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50 text-lg">
              Closed Incidents
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {closedIncidents.length} resolved incident
              {closedIncidents.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 opacity-75">
            {closedIncidents.slice(0, 3).map((incident) => (
              <IncidentCard
                key={incident.report_id}
                incident={incident}
                isActive={false}
              />
            ))}
            {closedIncidents.length > 3 && (
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-2">
                +{closedIncidents.length - 3} more
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
