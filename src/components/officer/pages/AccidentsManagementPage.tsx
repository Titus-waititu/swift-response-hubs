import { useState } from "react";
import { Eye, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { IncidentReport, IncidentStatus } from "@/types/incident";

interface AccidentsManagementPageProps {
  incidents: IncidentReport[];
}

export default function AccidentsManagementPage({
  incidents,
}: AccidentsManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.backend_report_number?.includes(searchQuery) ||
      incident.location_address
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      incident.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severity_level === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
      case "High":
        return "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100";
      case "Medium":
        return "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100";
      case "Low":
        return "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100";
      case "Under Review":
        return "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100";
      case "Resolved":
        return "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";
      case "Closed":
        return "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100";
      default:
        return "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100";
    }
  };

  const handleViewIncident = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Manage Accidents
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View and manage all incident reports
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">
                Search
              </Label>
              <Input
                placeholder="Search by report #, location, reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 placeholder-slate-500"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">
                Severity
              </Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Incidents ({filteredIncidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Report #
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Type
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Location
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Severity
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Reporter
                  </TableHead>
                  <TableHead className="text-slate-700 dark:text-slate-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        No incidents found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow
                      key={incident.report_id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="font-bold text-slate-900 dark:text-slate-50">
                        #{incident.backend_report_number || incident.report_id}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {incident.incident_type}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-700 dark:text-slate-300">
                        {incident.location_address}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getSeverityColor(incident.severity_level)}
                        >
                          {incident.severity_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {incident.reporter_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewIncident(incident)}
                            title={`View Incident #${incident.backend_report_number || incident.report_id}`}
                            className="h-8 px-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {incident.severity_level === "Critical" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title={`Critical Alert - Incident #${incident.backend_report_number || incident.report_id}`}
                              className="h-8 px-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Incident Details
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Report #
              {selectedIncident?.backend_report_number ||
                selectedIncident?.report_id}
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Type
                  </Label>
                  <p className="text-slate-900 dark:text-slate-50 mt-1">
                    {selectedIncident.incident_type}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Severity
                  </Label>
                  <Badge
                    className={`mt-1 ${getSeverityColor(selectedIncident.severity_level)}`}
                  >
                    {selectedIncident.severity_level}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Location
                </Label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {selectedIncident.location_address}
                </p>
              </div>

              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <p className="text-slate-700 dark:text-slate-300 text-sm mt-2">
                  {selectedIncident.short_description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Reporter
                  </Label>
                  <p className="text-slate-900 dark:text-slate-50 mt-1">
                    {selectedIncident.reporter_name}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Status
                  </Label>
                  <Badge
                    className={`mt-1 ${getStatusColor(selectedIncident.status)}`}
                  >
                    {selectedIncident.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300 text-xs">
                    Submitted
                  </Label>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {new Date(
                      selectedIncident.time_report_submitted,
                    ).toLocaleString()}
                  </p>
                </div>
                {selectedIncident.resolved_time && (
                  <div>
                    <Label className="text-slate-700 dark:text-slate-300 text-xs">
                      Resolved
                    </Label>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                      {new Date(
                        selectedIncident.resolved_time,
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
