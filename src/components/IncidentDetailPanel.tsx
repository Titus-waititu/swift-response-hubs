import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import MapViewer from "@/components/MapViewer";
import { useIncidentStore } from "@/context/IncidentStore";
import type { IncidentReport, IncidentStatus } from "@/types/incident";
import { toast } from "sonner";

interface Props {
  incident: IncidentReport;
  onBack: () => void;
  role: "dispatcher" | "responder";
  onSyncStatus?: (
    incident: IncidentReport,
    nextStatus: IncidentStatus,
  ) => void | Promise<void>;
}

const BACKEND_STATUS_OPTIONS: IncidentStatus[] = [
  "reported",
  "under_investigation",
  "in_progress",
  "resolved",
  "closed",
];

export default function IncidentDetailPanel({
  incident,
  onBack,
  role,
  onSyncStatus,
}: Props) {
  const { updateIncident } = useIncidentStore();

  useEffect(() => {
    console.log("🔍 IncidentDetailPanel opened with data:", {
      incident,
      gps_latitude: incident.gps_latitude,
      gps_longitude: incident.gps_longitude,
      role,
      hasGPS: !!incident.gps_latitude && !!incident.gps_longitude,
      shouldShowMap:
        role === "responder" &&
        !!incident.gps_latitude &&
        !!incident.gps_longitude,
    });
  }, [incident, role]);
  const [status, setStatus] = useState<IncidentStatus>(incident.status);

  useEffect(() => {
    setStatus(incident.status);
  }, [incident]);

  const syncStatus = (nextStatus: IncidentStatus) => {
    if (!onSyncStatus) {
      return;
    }

    void onSyncStatus(incident, nextStatus);
  };

  const handleSaveDispatcherChanges = () => {
    const now = new Date().toISOString();
    updateIncident(incident.report_id, {
      status,
      resolved_time:
        status === "resolved" && !incident.resolved_time
          ? now
          : incident.resolved_time,
    });

    syncStatus(status);
    toast.success("Accident updated");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-muted-foreground hover:text-foreground gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-lg font-bold text-foreground">
            {incident.report_id}
          </span>
          <StatusBadge status={incident.status} />
          <SeverityBadge severity={incident.severity_level} />
        </div>
        <h2 className="mt-2 text-xl font-bold text-foreground">
          {incident.incident_type}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {incident.short_description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Accident Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Accident Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row
              label="Reported injuries"
              value={String(incident.number_of_victims ?? 0)}
            />
            <Row
              label="Vehicles"
              value={String(incident.vehicles_involved ?? "N/A")}
            />
            <Row
              label="Reported"
              value={new Date(incident.time_report_submitted).toLocaleString()}
            />
          </CardContent>
        </Card>

        {/* Reporter & Location */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-info" />
              Location & Reporter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Address" value={incident.location_address} />
            <Row
              label="GPS"
              value={`${incident.gps_latitude}, ${incident.gps_longitude}`}
            />

            {/* Map Viewer for Responders */}
            {role === "responder" &&
              incident.gps_latitude !== undefined &&
              incident.gps_latitude !== null &&
              incident.gps_longitude !== undefined &&
              incident.gps_longitude !== null &&
              !isNaN(Number(incident.gps_latitude)) &&
              !isNaN(Number(incident.gps_longitude)) && (
                <div className="border-t border-border pt-3 mt-3">
                  <p className="font-medium text-foreground mb-2">
                    Location Map
                  </p>
                  <MapViewer
                    latitude={incident.gps_latitude}
                    longitude={incident.gps_longitude}
                    address={incident.location_address}
                  />
                </div>
              )}

            <div className="border-t border-border pt-3">
              <Row label="Reporter" value={incident.reporter_name} />
              <Row label="Phone" value={incident.phone_number} />
              <Row label="Email" value={incident.email || "—"} />
            </div>
          </CardContent>
        </Card>

        {/* Dispatcher Actions */}
        {role === "dispatcher" && (
          <Card className="border-border bg-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm text-foreground flex items-center gap-2">
                <Navigation className="h-4 w-4 text-warning" />
                Dispatcher Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">
                  Backend-supported status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as IncidentStatus)}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BACKEND_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4 text-sm leading-6 text-muted-foreground">
                This backend currently supports coarse accident status
                management only. Responder assignment, verification notes, ETA,
                and reject/duplicate workflows were removed from the main
                controls to match the API.
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  className="bg-success text-success-foreground hover:bg-success/90 gap-2"
                  onClick={handleSaveDispatcherChanges}
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Status
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Responder Actions */}
        {role === "responder" && (
          <Card className="border-border bg-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm text-foreground flex items-center gap-2">
                <Navigation className="h-4 w-4 text-info" />
                Responder View
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4 text-sm leading-6 text-muted-foreground">
                The current backend exposes responder accident access, but it
                does not support the richer field workflow from the prototype.
                This view is intentionally read-only until responder-specific
                update endpoints exist.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        {(incident.backend_accident_id ||
          incident.resolved_time ||
          incident.updated_at) && (
          <Card className="border-border bg-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Accident Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <Row
                  label="Backend ID"
                  value={incident.backend_accident_id || "—"}
                />
                <Row
                  label="Created"
                  value={
                    incident.created_at
                      ? new Date(incident.created_at).toLocaleString()
                      : "—"
                  }
                />
                <Row
                  label="Updated"
                  value={
                    incident.updated_at
                      ? new Date(incident.updated_at).toLocaleString()
                      : "—"
                  }
                />
                <Row
                  label="Resolved"
                  value={
                    incident.resolved_time
                      ? new Date(incident.resolved_time).toLocaleString()
                      : "—"
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground text-right">{value || "—"}</span>
    </div>
  );
}
