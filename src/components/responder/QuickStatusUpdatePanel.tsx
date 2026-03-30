import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MapPin, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useUpdateResponderResponse,
  useNotifyDispatcherOfResponse,
} from "@/hooks/useAccidents";
import type { IncidentReport, IncidentStatus } from "@/types/incident";
import { getStatusLabel, getStatusColor } from "@/lib/status-utils";

interface QuickStatusUpdatePanelProps {
  incident: IncidentReport;
  onClose?: () => void;
  onRefresh?: () => void;
}

export default function QuickStatusUpdatePanel({
  incident,
  onClose,
  onRefresh,
}: QuickStatusUpdatePanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateResponderMutation = useUpdateResponderResponse();
  const notifyDispatcherMutation = useNotifyDispatcherOfResponse();

  const quickActions = [
    {
      status: "in_progress" as IncidentStatus,
      label: "Go to Scene",
      icon: MapPin,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      status: "resolved" as IncidentStatus,
      label: "Resolved",
      icon: CheckCircle2,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      status: "closed" as IncidentStatus,
      label: "Closed",
      icon: XCircle,
      color: "bg-slate-600 hover:bg-slate-700",
    },
  ];

  const handleQuickStatusUpdate = async (newStatus: IncidentStatus) => {
    if (!incident.report_id) {
      toast.error("Incident ID not found");
      return;
    }

    try {
      setIsLoading(true);
      const statusLabel = getStatusLabel(newStatus);

      // Update incident status
      await updateResponderMutation.mutateAsync({
        accidentId: incident.backend_accident_id || incident.report_id,
        status: newStatus,
        description: `Status: ${statusLabel}`,
      });

      // Notify dispatcher
      const priority = newStatus === "in_progress" ? "urgent" : "high";
      await notifyDispatcherMutation.mutateAsync({
        title: `${incident.incident_type} - Status Update`,
        message: `Responder updated status to ${statusLabel} at ${incident.location_address}`,
        priority,
        accidentId: incident.backend_accident_id || incident.report_id,
      });

      toast.success(`Status updated to ${statusLabel}`);
      onRefresh?.();
      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if incident is complete
  const isIncidentComplete =
    incident.status === "resolved" || incident.status === "closed";

  return (
    <div className="space-y-4 p-2">
      {/* Incident Created */}
      <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base text-slate-900 dark:text-slate-50">
            Incident Created
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-mono text-slate-600 dark:text-slate-400">
            {new Date(incident.time_report_submitted).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base text-slate-900 dark:text-slate-50">
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge
              className={`${
                incident.status === "reported"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                  : incident.status === "under_investigation"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                    : incident.status === "in_progress"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                      : incident.status === "resolved"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200"
              }`}
            >
              {getStatusLabel(incident.status)}
            </Badge>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {isIncidentComplete && (
            <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                This incident is already{" "}
                <strong>{getStatusLabel(incident.status)}</strong> and cannot be
                updated.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!isIncidentComplete && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 dark:text-slate-50">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.status}
                    onClick={() => handleQuickStatusUpdate(action.status)}
                    disabled={isLoading}
                    className={`${action.color} text-white`}
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <IconComponent className="h-4 w-4 mr-1" />
                        {action.label}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full"
      >
        Close
      </Button>
    </div>
  );
}
