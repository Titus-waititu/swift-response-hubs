import { useState } from "react";
import {
  AlertCircle,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  MapPinIcon,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useUpdateResponderResponse,
  useNotifyDispatcherOfResponse,
} from "@/hooks/useAccidents";
import type { IncidentReport, IncidentStatus } from "@/types/incident";
import { getStatusLabel } from "@/lib/status-utils";

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
      color: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
      textColor: "text-blue-50",
    },
    {
      status: "resolved" as IncidentStatus,
      label: "Resolved",
      icon: CheckCircle2,
      color: "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
      textColor: "text-green-50",
    },
    {
      status: "closed" as IncidentStatus,
      label: "Closed",
      icon: XCircle,
      color: "bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700",
      textColor: "text-slate-50",
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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800";
      case "under_investigation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 border border-purple-200 dark:border-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200 dark:border-green-800";
      case "closed":
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200 border border-slate-200 dark:border-slate-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200";
    }
  };

  return (
    <div className="space-y-5 p-1">
      {/* Header Section - Incident Info */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-850 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-3">
          {incident.incident_type}
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">
              {incident.location_address}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              {new Date(incident.time_report_submitted).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-3">
          Current Status
        </p>
        <div className="flex items-center justify-between">
          <Badge className={`${getStatusBadgeStyle(incident.status)} px-3 py-1 text-sm font-semibold`}>
            {getStatusLabel(incident.status)}
          </Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {new Date().toLocaleTimeString()}
          </span>
        </div>

        {isIncidentComplete && (
          <div className="mt-3 flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-md border border-orange-200 dark:border-orange-800/50">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800 dark:text-orange-200">
              This incident is <strong>{getStatusLabel(incident.status)}</strong> and cannot be updated.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {!isIncidentComplete && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-4">
            Update Status
          </p>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.status}
                  onClick={() => handleQuickStatusUpdate(action.status)}
                  disabled={isLoading}
                  className={`${action.color} ${action.textColor} h-12 font-semibold text-sm shadow-md hover:shadow-lg transition-all`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <IconComponent className="h-5 w-5 mr-2" />
                      {action.label}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full h-10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
      >
        Close
      </Button>
    </div>
  );
}
  );
}
