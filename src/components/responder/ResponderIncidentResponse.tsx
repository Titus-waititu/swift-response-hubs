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
import type { IncidentReport, IncidentStatus } from "@/types/incident";
import {
  getNextStatuses,
  getStatusLabel,
  getStatusColor,
} from "@/lib/status-utils";

interface ResponderIncidentResponseProps {
  incident: IncidentReport;
  onClose?: () => void;
  onRefresh?: () => void;
}

export default function ResponderIncidentResponse({
  incident,
  onClose,
  onRefresh,
}: ResponderIncidentResponseProps) {
  // Check if incident can still be responded to
  const isIncidentComplete =
    incident.status === "resolved" || incident.status === "closed";

  // Get next valid statuses responder can transition to
  const nextStatuses = getNextStatuses(incident.status);
  const initialStatus: IncidentStatus =
    nextStatuses.length > 0 ? nextStatuses[0] : "in_progress";

  const [selectedStatus, setSelectedStatus] =
    useState<IncidentStatus>(initialStatus);
  const [updateNotes, setUpdateNotes] = useState("");
  const [notifyDispatch, setNotifyDispatch] = useState(true);

  const updateResponderMutation = useUpdateResponderResponse();
  const notifyDispatcherMutation = useNotifyDispatcherOfResponse();

  const handleStatusChange = (status: IncidentStatus) => {
    setSelectedStatus(status);
  };

  const handleUpdateStatus = async () => {
    if (!incident.report_id) {
      toast.error("Incident ID not found");
      return;
    }

    try {
      const statusLabel = getStatusLabel(selectedStatus);
      const description = updateNotes
        ? `Status: ${statusLabel} - ${updateNotes}`
        : `Status: ${statusLabel}`;

      // Update incident status via backend
      await updateResponderMutation.mutateAsync({
        accidentId: incident.backend_accident_id || incident.report_id,
        status: selectedStatus, // Send the actual status
        description,
      });

      // Notify dispatcher if enabled
      if (notifyDispatch) {
        const priority = selectedStatus === "in_progress" ? "urgent" : "high";
        await notifyDispatcherMutation.mutateAsync({
          title: `${incident.incident_type} - Status Update`,
          message: `Responder updated status to ${statusLabel} at ${incident.location_address}${updateNotes ? ` - ${updateNotes}` : ""}`,
          priority,
          accidentId: incident.backend_accident_id || incident.report_id,
        });
      }

      toast.success(`Status updated to ${statusLabel} and dispatcher notified`);
      setUpdateNotes("");
      // Refresh parent component data
      onRefresh?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  const isLoading =
    updateResponderMutation.isPending || notifyDispatcherMutation.isPending;

  // If incident is already resolved/closed, show error state
  if (isIncidentComplete) {
    return (
      <div className="space-y-4">
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Cannot Respond
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800 dark:text-orange-200">
              This incident is already{" "}
              <strong>{getStatusLabel(incident.status)}</strong> and cannot be
              updated. Only active incidents can be responded to.
            </p>
            <Button onClick={onClose} variant="outline" className="mt-4">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                    selectedStatus === status
                      ? `border-teal-500 ring-2 ring-teal-500 ${getStatusColor(status)} bg-opacity-80`
                      : `border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600`
                  }`}
                >
                  <AlertCircle className="h-4 w-4 mx-auto mb-1" />
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current Status: {getStatusLabel(incident.status)}
            </p>
          </div>

          {/* Status Description */}
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              You are marking this incident as{" "}
              <strong>{getStatusLabel(selectedStatus)}</strong>
            </p>
          </div>

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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
