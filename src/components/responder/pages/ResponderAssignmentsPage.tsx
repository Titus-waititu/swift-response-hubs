import { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  MapPin,
  Clock,
  MessageSquare,
  ChevronDown,
  Zap,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import QuickStatusUpdatePanel from "@/components/responder/QuickStatusUpdatePanel";
import IncidentDetailsPanel from "@/components/responder/IncidentDetailsPanel";
import StatusHistoryDisplay from "@/components/responder/StatusHistoryDisplay";
import type { IncidentReport } from "@/types/incident";
import {
  useUpdateResponderResponse,
  useNotifyDispatcherOfResponse,
} from "@/hooks/useAccidents";
import { getStatusLabel } from "@/lib/status-utils";
import { toast } from "sonner";

interface ResponderAssignmentsPageProps {
  incidents: IncidentReport[];
  onRefreshAssignments?: () => void;
}

export default function ResponderAssignmentsPage({
  incidents,
  onRefreshAssignments,
}: ResponderAssignmentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);
  const [selectedIncidentForDetails, setSelectedIncidentForDetails] =
    useState<IncidentReport | null>(null);
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(
    new Set(),
  );
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mutations for quick status updates
  const updateResponderMutation = useUpdateResponderResponse();
  const notifyDispatcherMutation = useNotifyDispatcherOfResponse();

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshAssignments?.();
      toast.success("Assignments refreshed");
    } catch (error) {
      toast.error("Failed to refresh assignments");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.incident_type
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        incident.location_address
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || incident.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [incidents, searchTerm, statusFilter]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive";
      case "High":
        return "secondary";
      default:
        return "outline";
    }
  };

  const toggleExpanded = (reportId: string) => {
    const newExpanded = new Set(expandedIncidents);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedIncidents(newExpanded);
  };

  const handleQuickStatusUpdate = async (
    incident: IncidentReport,
    newStatus: string,
  ) => {
    if (!incident.report_id) {
      toast.error("Incident ID not found");
      return;
    }

    try {
      setQuickActionLoading(incident.report_id);
      const statusLabel = getStatusLabel(newStatus);
      const description = `Status: ${statusLabel}`;

      // Update incident status via backend
      await updateResponderMutation.mutateAsync({
        accidentId: incident.backend_accident_id || incident.report_id,
        status: newStatus, // Send the new status
        description,
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
      // Refresh parent component data
      onRefreshAssignments?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    } finally {
      setQuickActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                Assignments
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                View and manage your incident assignments
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full whitespace-nowrap h-fit">
              <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                Auto-updating
              </span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="mt-1"
          title="Manually refresh assignments (auto-refresh happens every second)"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by type or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
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
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Your Assignments ({filteredIncidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="w-10 text-slate-900 dark:text-slate-50"></TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-50">
                    Type
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-50">
                    Location
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-50">
                    Severity
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-50">
                    Status
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-50">
                    Reported
                  </TableHead>
                  <TableHead className="text-slate-900 dark:text-slate-50 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.flatMap((incident) => [
                    <TableRow
                      key={incident.report_id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <TableCell className="w-10">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleExpanded(incident.report_id!)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expandedIncidents.has(incident.report_id!) ? "rotate-180" : ""}`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900 dark:text-slate-50">
                        {incident.incident_type}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {incident.location_address}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getSeverityColor(incident.severity_level)}
                        >
                          {incident.severity_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{incident.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(
                          incident.time_report_submitted!,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Status Badge */}
                          <div className="flex items-center gap-1">
                            <Badge
                              className={`text-xs font-semibold ${
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
                          </div>

                          {/* Respond Button */}
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncident(incident);
                            }}
                            disabled={
                              incident.status === "resolved" ||
                              incident.status === "closed"
                            }
                            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
                            title={
                              incident.status === "resolved" ||
                              incident.status === "closed"
                                ? "Cannot respond to resolved or closed incidents"
                                : "Update response status"
                            }
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Respond
                          </Button>

                          {/* Details Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncidentForDetails(incident);
                            }}
                            className="dark:text-slate-400 dark:hover:bg-slate-700"
                            title="View incident details"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>,
                    // Expandable Status History Row with Quick Actions
                    ...(expandedIncidents.has(incident.report_id!)
                      ? [
                          <TableRow
                            key={`${incident.report_id}-details`}
                            className="bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700"
                          >
                            <TableCell colSpan={7} className="p-4">
                              <div className="space-y-4">
                                <StatusHistoryDisplay
                                  createdAt={incident.created_at || ""}
                                  currentStatus={
                                    incident.short_description?.includes(
                                      "Status:",
                                    )
                                      ? incident.short_description
                                      : undefined
                                  }
                                  statusSelectedAt={
                                    incident.updated_at
                                      ? new Date(incident.updated_at)
                                      : undefined
                                  }
                                  statusColor="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200"
                                  compact={false}
                                />
                                {/* Quick Action Buttons */}
                                {incident.status !== "resolved" &&
                                incident.status !== "closed" ? (
                                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-semibold mb-3">
                                      Quick Actions
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                      {incident.status !== "in_progress" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleQuickStatusUpdate(
                                              incident,
                                              "in_progress",
                                            )
                                          }
                                          disabled={
                                            quickActionLoading ===
                                            incident.report_id
                                          }
                                          className="text-xs border-teal-300 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                        >
                                          <Zap className="h-3 w-3 mr-1" />
                                          {quickActionLoading ===
                                          incident.report_id
                                            ? "..."
                                            : "Go to Scene"}
                                        </Button>
                                      )}
                                      {incident.status !== "resolved" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleQuickStatusUpdate(
                                              incident,
                                              "resolved",
                                            )
                                          }
                                          disabled={
                                            quickActionLoading ===
                                            incident.report_id
                                          }
                                          className="text-xs border-green-300 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                        >
                                          <CheckCircle2 className="h-3 w-3 mr-1" />
                                          {quickActionLoading ===
                                          incident.report_id
                                            ? "..."
                                            : "Resolved"}
                                        </Button>
                                      )}
                                      {incident.status !== "closed" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            handleQuickStatusUpdate(
                                              incident,
                                              "closed",
                                            )
                                          }
                                          disabled={
                                            quickActionLoading ===
                                            incident.report_id
                                          }
                                          className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                          {quickActionLoading ===
                                          incident.report_id
                                            ? "..."
                                            : "Closed"}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </TableCell>
                          </TableRow>,
                        ]
                      : []),
                  ])
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-slate-600 dark:text-slate-400"
                    >
                      No assignments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Response Modal */}
      <Dialog
        open={!!selectedIncident}
        onOpenChange={(open) => !open && setSelectedIncident(null)}
      >
        <DialogContent className="max-w-xs w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-0 gap-0 rounded-lg overflow-hidden max-h-[95vh]">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 px-5 py-3 flex items-center justify-between">
            <DialogTitle className="text-white text-base font-bold">
              Update Status
            </DialogTitle>
          </div>
          <div className="px-3 py-4 overflow-y-auto">
            {selectedIncident && (
              <QuickStatusUpdatePanel
                incident={selectedIncident}
                onClose={() => setSelectedIncident(null)}
                onRefresh={onRefreshAssignments}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog
        open={!!selectedIncidentForDetails}
        onOpenChange={(open) => !open && setSelectedIncidentForDetails(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Incident Details
            </DialogTitle>
          </DialogHeader>
          {selectedIncidentForDetails && (
            <IncidentDetailsPanel incident={selectedIncidentForDetails} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
