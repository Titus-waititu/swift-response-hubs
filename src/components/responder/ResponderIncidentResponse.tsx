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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  MapPin,
  Clock,
  CheckCircle,
  Send,
  History,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  useUpdateResponderResponse,
  useNotifyDispatcherOfResponse,
} from "@/hooks/useAccidents";
import type { IncidentReport } from "@/types/incident";

interface ResponderIncidentResponseProps {
  incident: IncidentReport;
  onClose?: () => void;
}

type ResponseStatus =
  | "responding"
  | "en-route"
  | "on-scene"
  | "treating"
  | "transported"
  | "completed";

const statusFlow: {
  value: ResponseStatus;
  label: string;
  icon: any;
  color: string;
}[] = [
  {
    value: "responding",
    label: "Responding",
    icon: AlertCircle,
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
  },
  {
    value: "en-route",
    label: "En Route",
    icon: MapPin,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  },
  {
    value: "on-scene",
    label: "On Scene",
    icon: MapPin,
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200",
  },
  {
    value: "treating",
    label: "Treating",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
  },
  {
    value: "transported",
    label: "Patient Transported",
    icon: MapPin,
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircle,
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
  },
];

export default function ResponderIncidentResponse({
  incident,
  onClose,
}: ResponderIncidentResponseProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<ResponseStatus>("responding");
  const [statusSelectedAt, setStatusSelectedAt] = useState<Date>(new Date());
  const [updateNotes, setUpdateNotes] = useState("");
  const [notifyDispatch, setNotifyDispatch] = useState(true);

  const updateResponderMutation = useUpdateResponderResponse();
  const notifyDispatcherMutation = useNotifyDispatcherOfResponse();

  const currentStatus = statusFlow.find((s) => s.value === selectedStatus);

  const handleStatusChange = (status: ResponseStatus) => {
    setSelectedStatus(status);
    setStatusSelectedAt(new Date());
  };

  const handleUpdateStatus = async () => {
    if (!incident.report_id) {
      toast.error("Incident ID not found");
      return;
    }

    try {
      const statusLabel =
        statusFlow.find((s) => s.value === selectedStatus)?.label ||
        selectedStatus;
      const description = updateNotes
        ? `Status: ${statusLabel} - ${updateNotes}`
        : `Status: ${statusLabel}`;

      // Update responder response status
      await updateResponderMutation.mutateAsync({
        accidentId: incident.backend_accident_id || incident.report_id,
        description,
      });

      // Notify dispatcher if enabled
      if (notifyDispatch) {
        const priority =
          selectedStatus === "on-scene" || selectedStatus === "treating"
            ? "urgent"
            : "high";
        await notifyDispatcherMutation.mutateAsync({
          title: `${incident.incident_type} - Status Update`,
          message: `Responder status updated to ${statusLabel} at ${incident.location_address}${updateNotes ? ` - ${updateNotes}` : ""}`,
          priority,
          accidentId: incident.backend_accident_id || incident.report_id,
        });
      }

      toast.success(`Status updated to ${statusLabel} and dispatcher notified`);
      setUpdateNotes("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  const isLoading =
    updateResponderMutation.isPending || notifyDispatcherMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Incident Info */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            {incident.incident_type}
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Incident #{incident.report_id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>{incident.location_address}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <span className="capitalize">
              Severity: {incident.severity_level}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>
              Reported:{" "}
              {new Date(incident.created_at || "").toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-900 dark:text-slate-50 text-base">
            Update Response Status
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 text-xs">
            Update your response status and notify dispatch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Status Flow Visualization */}
          <div className="space-y-3">
            <Label className="text-slate-700 dark:text-slate-300">
              Response Status
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {statusFlow.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                    selectedStatus === status.value
                      ? `border-teal-500 ${status.color} ring-2 ring-teal-500`
                      : `border-slate-200 dark:border-slate-700 ${status.color}`
                  }`}
                >
                  <status.icon className="h-4 w-4 mx-auto mb-1" />
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Description */}
          {currentStatus && (
            <div className={`p-3 rounded-lg ${currentStatus.color}`}>
              <p className="text-sm font-medium">
                You are marking this incident as{" "}
                <strong>{currentStatus.label}</strong>
              </p>
            </div>
          )}

          {/* Update Notes */}
          <div className="space-y-1">
            <Label
              htmlFor="update-notes"
              className="text-slate-700 dark:text-slate-300 text-sm"
            >
              Update Notes (optional)
            </Label>
            <Textarea
              id="update-notes"
              placeholder="Add details (e.g., 'Patient stable', 'En route to hospital')"
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              maxLength={500}
              className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 min-h-16 text-sm"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {updateNotes.length}/500 characters
            </p>
          </div>

          {/* Notify Dispatch Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="notify-dispatch"
              checked={notifyDispatch}
              onChange={(e) => setNotifyDispatch(e.target.checked)}
              className="rounded border-slate-300"
            />
            <Label
              htmlFor="notify-dispatch"
              className="text-slate-700 dark:text-slate-300 cursor-pointer flex-1"
            >
              Notify Dispatch of this status update
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-3 border-t border-slate-200 dark:border-slate-700">
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleUpdateStatus}
              disabled={isLoading}
              className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Updating..." : "Update Status & Notify"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status History */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <CardTitle className="text-slate-900 dark:text-slate-50 text-base">
              Status History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline connector line */}
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-teal-300 dark:from-slate-600 dark:to-teal-600" />

              {/* Incident Created Timeline Entry */}
              <div className="relative flex gap-3 pl-10">
                <div className="absolute left-0 top-1.5 w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
                  <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 pb-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Incident Created
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs"
                    >
                      {new Date(incident.created_at || "").toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Current Response Status Timeline Entry */}
              {currentStatus && (
                <div className="relative flex gap-3 pl-10">
                  <div className="absolute left-0 top-1.5 w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center border-2 border-teal-400 shadow-lg shadow-teal-500/50 ring-2 ring-teal-100 dark:ring-teal-900/30">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                      Current Status
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        className={`${currentStatus.color} border-0 px-3 py-1 text-sm font-semibold shadow-sm`}
                      >
                        <currentStatus.icon className="h-3 w-3 mr-1 inline" />
                        {currentStatus.label}
                      </Badge>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded">
                        {statusSelectedAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
