import { X, MapPin, Phone, AlertTriangle, MapIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimeAgo } from "@/lib/incident-utils";
import type { IncidentReport } from "@/types/incident";

interface IncidentDetailsDrawerProps {
  incident: IncidentReport | null;
  isOpen: boolean;
  onClose: () => void;
}

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

export default function IncidentDetailsDrawer({
  incident,
  isOpen,
  onClose,
}: IncidentDetailsDrawerProps) {
  if (!isOpen || !incident) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 w-96 max-w-full bg-background border-l border-border shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Incident Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="p-4 space-y-4">
            {/* Title and ID */}
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {incident.incident_type}
              </h3>
              <p className="text-sm text-muted-foreground">
                Report ID: {incident.report_id}
              </p>
            </div>

            {/* Severity and Status */}
            <div className="flex gap-2 flex-wrap">
              <Badge variant={getSeverityColor(incident.severity_level)}>
                {incident.severity_level}
              </Badge>
              <Badge variant="outline">{incident.status}</Badge>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">
                Description
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {incident.detailed_description || incident.short_description}
              </p>
            </div>

            {/* Location Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {incident.location_address}
                </p>
                {incident.gps_latitude && incident.gps_longitude && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {incident.gps_latitude.toFixed(6)}, {incident.gps_longitude.toFixed(6)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        window.open(
                          `https://maps.google.com/?q=${incident.gps_latitude},${incident.gps_longitude}`,
                          "_blank"
                        );
                      }}
                    >
                      <MapIcon className="h-4 w-4 mr-2" />
                      Open in Maps
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Timing Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Reported</p>
                  <p className="text-sm font-medium">
                    {incident.created_at
                      ? new Date(incident.created_at).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time Elapsed</p>
                  <p className="text-sm font-medium">
                    {incident.created_at ? formatTimeAgo(incident.created_at) : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Reporter Contact Card */}
            {(incident.phone_number_reporter || incident.phone_number) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Reporter Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {incident.phone_number_reporter || incident.phone_number}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const phoneNumber = incident.phone_number_reporter || incident.phone_number;
                      window.location.href = `tel:${phoneNumber}`;
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Reporter
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Victims and Vehicles Card */}
            {(incident.number_of_victims || incident.vehicles_involved) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Scene Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incident.number_of_victims && incident.number_of_victims > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Victims</p>
                      <p className="text-lg font-bold text-red-600">
                        {incident.number_of_victims} ({incident.number_of_victims === 1 ? "1 person" : `${incident.number_of_victims} people`})
                      </p>
                    </div>
                  )}
                  {incident.vehicles_involved && incident.vehicles_involved > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicles Involved</p>
                      <p className="text-lg font-bold text-amber-600">
                        {incident.vehicles_involved}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI Insights Card - Optional */}
            {incident.ai_insights && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {incident.ai_insights}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Media Card */}
            {(incident.image_urls && incident.image_urls.length > 0) || (incident.photos && incident.photos.length > 0) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {(incident.image_urls || incident.photos)?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Incident media ${index + 1}`}
                        className="rounded-lg w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(url, "_blank")}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{incident.status}</p>
                </div>
                {incident.assigned_to && (
                  <div>
                    <p className="text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{incident.assigned_to}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
