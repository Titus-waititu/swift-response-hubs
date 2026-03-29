import { useState, useMemo } from "react";
import {
  Search,
  ChevronRight,
  MapPin,
  Clock,
  MessageSquare,
  ChevronDown,
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
import ResponderIncidentResponse from "@/components/responder/ResponderIncidentResponse";
import IncidentDetailsPanel from "@/components/responder/IncidentDetailsPanel";
import StatusHistoryDisplay from "@/components/responder/StatusHistoryDisplay";
import type { IncidentReport } from "@/types/incident";

interface ResponderAssignmentsPageProps {
  incidents: IncidentReport[];
}

export default function ResponderAssignmentsPage({
  incidents,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Assignments
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View and manage your incident assignments
        </p>
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
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIncident(incident);
                            }}
                            className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
                            title="Update response status"
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
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
                    // Expandable Status History Row
                    ...(expandedIncidents.has(incident.report_id!)
                      ? [
                          <TableRow
                            key={`${incident.report_id}-details`}
                            className="bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-700"
                          >
                            <TableCell colSpan={7} className="p-4">
                              <StatusHistoryDisplay
                                createdAt={incident.created_at || ""}
                                statusColor="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200"
                                compact={false}
                              />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              Update Response Status
            </DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <ResponderIncidentResponse
              incident={selectedIncident}
              onClose={() => setSelectedIncident(null)}
            />
          )}
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
