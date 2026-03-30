import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import Timeline, { TimelineStep } from "@/components/Timeline";
import { useGetAccidents } from "@/hooks/useAccidents";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import { MapPin, Phone, AlertTriangle, Clock, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const STATUS_FLOW = [
  { status: "reported", label: "Report Submitted", color: "bg-blue-500" },
  {
    status: "under_investigation",
    label: "Being Investigated",
    color: "bg-yellow-500",
  },
  {
    status: "in_progress",
    label: "Responders En Route",
    color: "bg-orange-500",
  },
  { status: "resolved", label: "Incident Resolved", color: "bg-green-500" },
  { status: "closed", label: "Closed", color: "bg-slate-500" },
];

export default function IncidentStatusPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { data: accidentsResponse } = useGetAccidents();
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Enable real-time polling
  useRealtimeUpdates({
    queryKeys: [["accidents"]],
    interval: 5000, // Poll every 5 seconds
    enabled: !!reportId,
  });

  // Find the incident matching the reportId
  useEffect(() => {
    if (!accidentsResponse) {
      setLoading(true);
      return;
    }

    const accidentsData = Array.isArray(accidentsResponse)
      ? accidentsResponse
      : accidentsResponse?.data || [];

    const found = accidentsData.find((acc: any) => {
      const mapped = mapBackendAccidentToIncident(acc);
      return mapped.report_id === reportId;
    });

    if (found) {
      setIncident(mapBackendAccidentToIncident(found));
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("Incident not found");
    }
  }, [accidentsResponse, reportId]);

  // Build timeline steps
  const getTimelineSteps = (): TimelineStep[] => {
    if (!incident) return [];

    const steps: TimelineStep[] = [];
    const currentStatusIndex = STATUS_FLOW.findIndex(
      (s) => s.status === incident.status,
    );

    STATUS_FLOW.forEach((step, index) => {
      if (index < currentStatusIndex) {
        steps.push({
          id: step.status,
          title: step.label,
          timestamp: incident.created_at,
          status: "completed",
        });
      } else if (index === currentStatusIndex) {
        steps.push({
          id: step.status,
          title: step.label,
          timestamp: incident.updated_at,
          status: "current",
        });
      } else {
        steps.push({
          id: step.status,
          title: step.label,
          status: "pending",
        });
      }
    });

    return steps;
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

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="text-slate-600 dark:text-slate-400">
              Loading incident details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!incident) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/user-dashboard")}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Card className="max-w-md mx-auto border-red-200 dark:border-red-900">
            <CardContent className="pt-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                Incident not found
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Incident Status
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Report ID: {incident.report_id}
              </p>
            </div>
            <Badge variant={getSeverityColor(incident.severity_level)}>
              {incident.severity_level}
            </Badge>
          </div>

          {/* Status Overview Card */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Status
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                    {incident.status}
                  </p>
                </div>
                <Badge variant="outline" className="text-lg">
                  {incident.status === "reported" && "🔔"}
                  {incident.status === "under_investigation" && "👀"}
                  {incident.status === "in_progress" && "🚗"}
                  {incident.status === "resolved" && "✅"}
                  {incident.status === "closed" && "🔒"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                    Reported
                  </p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-50 mt-1">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <p className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-50 mt-1">
                    {new Date(incident.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Timeline
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Progress of your incident response
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Timeline
                steps={getTimelineSteps()}
                layout="vertical"
                size="md"
              />
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Incident Type
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {incident.incident_type}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Severity
                  </p>
                  <div className="mt-1">
                    <Badge variant={getSeverityColor(incident.severity_level)}>
                      {incident.severity_level}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                  Description
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                  {incident.short_description}
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-1">
                    {incident.location_address}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ({incident.gps_latitude.toFixed(4)},{" "}
                    {incident.gps_longitude.toFixed(4)})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {incident.phone_number}
                  </p>
                </div>
              </div>
              {incident.email && (
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {incident.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/user-dashboard")}
              className="flex-1"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Clock className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
