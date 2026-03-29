import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  AlertCircle,
  Car,
  FileText,
  User,
} from "lucide-react";
import type { IncidentReport } from "@/types/incident";

interface IncidentDetailsPanelProps {
  incident: IncidentReport;
}

export default function IncidentDetailsPanel({
  incident,
}: IncidentDetailsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                {incident.incident_type}
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Report #{incident.report_id}
              </p>
            </div>
            <Badge
              className={`px-3 py-1 ${getSeverityColor(incident.severity_level)}`}
            >
              {incident.severity_level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {incident.location_address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Calendar className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Incident Time</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {new Date(incident.time_of_incident).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Calendar className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Reported At</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {new Date(incident.time_report_submitted).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reporter Info */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900 dark:text-slate-50">
            Reporter Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Name</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {incident.reporter_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Phone
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {incident.phone_number}
              </p>
            </div>
          </div>
          {incident.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 break-all">
                  {incident.email}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Incident Details */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900 dark:text-slate-50">
            Incident Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Description
            </p>
            <p className="text-sm text-slate-900 dark:text-slate-50 leading-relaxed">
              {incident.short_description}
            </p>
          </div>
          {incident.number_of_victims !== undefined &&
            incident.number_of_victims > 0 && (
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <Users className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Victims
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {incident.number_of_victims}{" "}
                    {incident.number_of_victims === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>
            )}
          {incident.vehicles_involved !== undefined &&
            incident.vehicles_involved > 0 && (
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Vehicles Involved
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {incident.vehicles_involved}{" "}
                    {incident.vehicles_involved === 1 ? "vehicle" : "vehicles"}
                  </p>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {/* Location Coordinates */}
      {incident.gps_latitude && incident.gps_longitude && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-900 dark:text-slate-50">
              GPS Coordinates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Latitude
                </p>
                <p className="text-sm font-mono text-slate-900 dark:text-slate-50">
                  {incident.gps_latitude.toFixed(6)}
                </p>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Longitude
                </p>
                <p className="text-sm font-mono text-slate-900 dark:text-slate-50">
                  {incident.gps_longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos */}
      {incident.photos && incident.photos.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-900 dark:text-slate-50">
              Photos ({incident.photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {incident.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="relative bg-slate-100 dark:bg-slate-900 rounded overflow-hidden aspect-square"
                >
                  <img
                    src={photo}
                    alt={`Incident photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e0e7ff' width='100' height='100'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Info */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900 dark:text-slate-50">
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="text-base py-1 px-3">
            {incident.status}
          </Badge>
          {incident.resolved_time && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Resolved: {new Date(incident.resolved_time).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
