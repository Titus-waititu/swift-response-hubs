import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Search,
  Filter,
  Eye,
  CheckCheck,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { toast } from "sonner";
import type { IncidentReport, IncidentStatus } from "../../../types/incident";
import { STATUS_FLOW } from "../../../types/incident";
import {
  useGetAccidents,
  useUpdateAccident,
} from "../../../hooks/useAccidents";

interface IncidentsQueuePageProps {
  incidents?: IncidentReport[];
}

export default function IncidentsQueuePage({
  incidents: initialIncidents = [],
}: IncidentsQueuePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [viewingId, setViewingId] = useState<string | null>(null);

  // Fetch incidents from API
  const { data: apiIncidents = [], isLoading } = useGetAccidents();
  const updateStatusMutation = useUpdateAccident();

  // Log API response to debug
  console.log("API Incidents Response:", apiIncidents);

  // Use API data if available, otherwise use initial incidents
  // Transform API response to match component expectations
  const incidents = Array.isArray(apiIncidents)
    ? apiIncidents.map((incident: any) => ({
        report_id: incident.report_id || incident.id || "",
        id: incident.id || incident.report_id || "",
        backend_report_number:
          incident.backend_report_number ||
          incident.report_id ||
          incident.id ||
          "",
        location_address: incident.location_address || incident.location || "",
        reporter_name: incident.reporter_name || incident.reporter?.name || "",
        status: incident.status || "reported",
        severity_level:
          incident.severity_level || incident.severity || "Medium",
        incident_type:
          incident.incident_type || incident.type || "Motor Vehicle",
        ...incident, // Keep all original properties
      }))
    : initialIncidents;

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      (incident.backend_report_number || "").includes(searchQuery) ||
      (incident.location_address || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (incident.reporter_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severity_level === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const currentIncident = incidents.find(
    (inc) => inc.report_id === viewingId || inc.id === viewingId,
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-blue-100 text-blue-800";
      case "under_investigation":
        return "bg-purple-100 text-purple-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reported":
        return "Reported";
      case "under_investigation":
        return "Under Investigation";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: IncidentStatus) => {
    updateStatusMutation.mutate(
      {
        id,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(`Incident status updated to ${newStatus}`);
          // setViewingId(null); // Removed to prevent modal closing on status change
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update incident status");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Incidents Queue
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Monitor and manage incoming incident reports
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-slate-700 dark:text-slate-300">
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder="Search by report # or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-700 dark:text-slate-300">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reported">Reported</SelectItem>
                  <SelectItem value="under_investigation">
                    Under Investigation
                  </SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-700 dark:text-slate-300">
                Severity
              </Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="mt-1 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-50">
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" className="w-full gap-2">
                <Filter className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incidents Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Incidents
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Total: {filteredIncidents.length} incident(s)
              </CardDescription>
            </div>
            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-slate-700 dark:text-slate-300">
                        No incidents found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.report_id || incident.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-slate-50">
                        {incident.backend_report_number ||
                          incident.report_id ||
                          "N/A"}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {incident.incident_type || "Motor Vehicle"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-700 dark:text-slate-300">
                        {incident.location_address || "Unknown Location"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getSeverityColor(
                            incident.severity_level || "Medium",
                          )}
                        >
                          {incident.severity_level || "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            incident.status || "reported",
                          )}
                        >
                          {getStatusLabel(incident.status || "reported")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">
                        {incident.reporter_name || "Anonymous"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setViewingId(incident.report_id || incident.id)
                            }
                            className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="View incident"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {incident.severity_level === "Critical" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800"
                              title="Critical incident"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                            >
                              <DropdownMenuLabel className="text-slate-900 dark:text-slate-50">
                                Update Status
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {STATUS_FLOW.map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() =>
                                    handleUpdateStatus(
                                      incident.report_id || incident.id,
                                      status as IncidentStatus,
                                    )
                                  }
                                  disabled={incident.status === status}
                                  className="cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-700"
                                >
                                  {getStatusLabel(status)}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* View Incident Dialog */}
      {currentIncident && (
        <Dialog open={!!viewingId} onOpenChange={() => setViewingId(null)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-50">
                Incident Details
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Report #
                {currentIncident.backend_report_number ||
                  currentIncident.report_id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Type
                  </Label>
                  <p className="text-slate-900 dark:text-slate-50 mt-1">
                    {currentIncident.incident_type || "General Emergency"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Severity
                  </Label>
                  <Badge
                    className={`mt-1 ${getSeverityColor(currentIncident.severity_level)}`}
                  >
                    {currentIncident.severity_level || "Unknown"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Location
                </Label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {currentIncident.location_address || "Location not provided"}
                </p>
              </div>

              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  Description
                </Label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {currentIncident.short_description ||
                    "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Reporter
                  </Label>
                  <p className="text-slate-900 dark:text-slate-50 mt-1">
                    {currentIncident.reporter_name || "Anonymous / Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      className={getStatusColor(
                        currentIncident.status || "reported",
                      )}
                    >
                      {getStatusLabel(currentIncident.status || "reported")}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setViewingId(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
