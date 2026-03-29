import { MapPin, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimeAgo } from "@/lib/incident-utils";
import type { IncidentReport } from "@/types/incident";

interface DispatchQueueListProps {
  incidents: IncidentReport[];
  selectedId?: string | null;
  searchQuery?: string;
  onSelect: (id: string) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10";
    case "High":
      return "border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10";
    case "Medium":
      return "border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10";
    default:
      return "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10";
  }
};

const getSeverityBadgeColor = (severity: string) => {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Submitted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
    case "Under Review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
    case "Dispatched":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
    case "Accepted":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
    case "En Route":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200";
    case "On Scene":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200";
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
    case "Closed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
  }
};

export default function DispatchQueueList({
  incidents,
  selectedId,
  searchQuery = "",
  onSelect,
}: DispatchQueueListProps) {
  // Filter incidents based on search query
  const filteredIncidents = incidents.filter((incident) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      incident.incident_type.toLowerCase().includes(query) ||
      incident.location_address.toLowerCase().includes(query) ||
      incident.report_id.toLowerCase().includes(query)
    );
  });

  if (filteredIncidents.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Dispatch Queue</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? "No matching dispatches found" : "No pending dispatches"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dispatch Queue</CardTitle>
          <Badge variant="outline">{filteredIncidents.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-4">
            {filteredIncidents.map((incident) => (
              <button
                key={incident.report_id}
                onClick={() => onSelect(incident.report_id)}
                className={`w-full text-left transition-all rounded-lg p-3 ${getSeverityColor(
                  incident.severity_level
                )} ${
                  selectedId === incident.report_id
                    ? "ring-2 ring-primary bg-opacity-100"
                    : "hover:bg-opacity-75 cursor-pointer"
                }`}
              >
                <div className="space-y-2">
                  {/* Header with Type and Severity */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">
                        {incident.incident_type}
                      </h4>
                      <p className="text-xs text-muted-foreground">{incident.report_id}</p>
                    </div>
                    <Badge
                      variant={getSeverityBadgeColor(incident.severity_level)}
                      className="flex-shrink-0 text-xs"
                    >
                      {incident.severity_level}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">
                      {incident.location_address}
                    </p>
                  </div>

                  {/* Status and Time */}
                  <div className="flex items-center gap-2 justify-between flex-wrap">
                    <Badge
                      className={`text-xs ${getStatusColor(incident.status)}`}
                      variant="secondary"
                    >
                      {incident.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {incident.created_at ? formatTimeAgo(incident.created_at) : "N/A"}
                    </div>
                  </div>

                  {/* Description Preview */}
                  {incident.short_description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {incident.short_description}
                    </p>
                  )}

                  {/* Victims/Vehicles Quick Stats */}
                  {(incident.number_of_victims || incident.vehicles_involved) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {incident.number_of_victims && incident.number_of_victims > 0 && (
                        <span>👥 {incident.number_of_victims} victims</span>
                      )}
                      {incident.vehicles_involved && incident.vehicles_involved > 0 && (
                        <span>🚗 {incident.vehicles_involved} vehicles</span>
                      )}
                    </div>
                  )}

                  {/* Select Indicator */}
                  {selectedId === incident.report_id && (
                    <div className="flex items-center justify-end text-primary pt-1">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
