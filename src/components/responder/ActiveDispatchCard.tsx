import {
  AlertTriangle,
  MapPin,
  Clock,
  PhoneCall,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/incident-utils";
import type { IncidentReport } from "@/types/incident";

interface ActiveDispatchCardProps {
  incident: IncidentReport;
  isUpdating: boolean;
  onStatusUpdate: (status: string) => void;
  onViewDetails: () => void;
}

const STATUS_FLOW = ["Accepted", "En Route", "On Scene", "Completed"];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800";
    case "High":
      return "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-800";
    case "Medium":
      return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-800";
    default:
      return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-800";
  }
};

const getSeverityTextColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "text-red-800 dark:text-red-200";
    case "High":
      return "text-orange-800 dark:text-orange-200";
    case "Medium":
      return "text-yellow-800 dark:text-yellow-200";
    default:
      return "text-blue-800 dark:text-blue-200";
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

export default function ActiveDispatchCard({
  incident,
  isUpdating,
  onStatusUpdate,
  onViewDetails,
}: ActiveDispatchCardProps) {
  const getNextStatus = () => {
    const currentIdx = STATUS_FLOW.indexOf(incident.status);
    if (currentIdx === -1) return STATUS_FLOW[0]; // Default to first
    if (currentIdx < STATUS_FLOW.length - 1) return STATUS_FLOW[currentIdx + 1];
    return null; // Already completed
  };

  const nextStatus = getNextStatus();
  const timeElapsed = incident.created_at
    ? formatTimeAgo(incident.created_at)
    : "Unknown";

  return (
    <Card
      className={`border-2 overflow-hidden shadow-lg ${getSeverityColor(incident.severity_level)}`}
    >
      <CardHeader
        className={`pb-3 ${getSeverityTextColor(incident.severity_level)}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-75">
                ACTIVE DISPATCH
              </span>
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              {incident.incident_type}
            </CardTitle>
            <p className="text-sm mt-2 opacity-90">ID: {incident.report_id}</p>
          </div>
          <Badge
            variant={getSeverityBadgeColor(incident.severity_level)}
            className="text-lg px-3 py-1 h-fit"
          >
            {incident.severity_level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {incident.short_description}
          </p>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50">
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Location
              </p>
              <p className="text-sm font-medium text-foreground truncate">
                {incident.location_address}
              </p>
              {incident.gps_latitude && incident.gps_longitude && (
                <p className="text-xs text-muted-foreground">
                  {incident.gps_latitude.toFixed(4)},{" "}
                  {incident.gps_longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Time Reported
              </p>
              <p className="text-sm font-medium text-foreground">
                {timeElapsed}
              </p>
            </div>
          </div>
        </div>

        {/* Status Progression */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Current Status
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-base px-3 py-1">
              {incident.status}
            </Badge>
            {nextStatus && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Next Status Button */}
            {nextStatus && (
              <Button
                onClick={() => onStatusUpdate(nextStatus)}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {nextStatus}
                  </>
                )}
              </Button>
            )}

            {/* View Details Button */}
            <Button
              onClick={onViewDetails}
              variant="outline"
              className="border-border hover:bg-secondary"
            >
              View Details
            </Button>
          </div>

          {/* Emergency Call Button */}
          <Button
            variant="outline"
            className="w-full border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={() => {
              const phoneNumber =
                incident.phone_number_reporter || incident.phone_number;
              if (phoneNumber) {
                window.location.href = `tel:${phoneNumber}`;
              }
            }}
            disabled={!incident.phone_number_reporter && !incident.phone_number}
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Call Reporter
          </Button>
        </div>

        {/* Quick Stats */}
        {(incident.number_of_victims || incident.vehicles_involved) && (
          <div className="bg-secondary/50 rounded-lg p-3 space-y-1 text-sm">
            {incident.number_of_victims && incident.number_of_victims > 0 && (
              <p className="text-muted-foreground">
                👥{" "}
                <span className="font-semibold">
                  {incident.number_of_victims}
                </span>{" "}
                victim(s)
              </p>
            )}
            {incident.vehicles_involved && incident.vehicles_involved > 0 && (
              <p className="text-muted-foreground">
                🚗{" "}
                <span className="font-semibold">
                  {incident.vehicles_involved}
                </span>{" "}
                vehicle(s)
              </p>
            )}
          </div>
        )}

        {/* Completion Status */}
        {((incident.status === "resolved" || incident.status === "closed") &&
          incident.status === "resolved") ||
        incident.status === "closed" ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-green-800 dark:text-green-200">
              ✓ Incident Complete
            </p>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center">
            Take action to proceed to the next step
          </div>
        )}
      </CardContent>
    </Card>
  );
}
