import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { IncidentReport } from "@/types/incident";

interface UserReportsPageProps {
  incidents: IncidentReport[];
}

export default function UserReportsPage({ incidents }: UserReportsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch =
        incident.incident_type
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        incident.location?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Closed":
        return "success";
      case "Resolved":
        return "outline";
      case "Under Review":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          My Reports
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          View and manage your incident reports
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

      {/* Reports Table */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Reports ({filteredIncidents.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow className="border-slate-200 dark:border-slate-700">
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
                    Reported Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((incident) => (
                    <TableRow
                      key={incident.id}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-50">
                        {incident.incident_type}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {incident.location}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getSeverityColor(incident.severity_level)}
                        >
                          {incident.severity_level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(incident.status) as any}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(incident.reported_time!).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-slate-600 dark:text-slate-400"
                    >
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
