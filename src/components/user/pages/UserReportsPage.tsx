import { useState, useMemo } from "react";
import {
  Search,
  Download,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { AIAssessmentCard } from "@/components/AIAssessmentCard";
import { SeverityBadge, StatusBadge } from "@/components/StatusBadge";
import type { IncidentReport } from "@/types/incident";
import { getStatusLabel, STATUS_STEPS } from "@/lib/status-utils";

interface UserReportsPageProps {
  incidents: IncidentReport[];
}

export default function UserReportsPage({ incidents }: UserReportsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");

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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Reports</h1>
        <p className="mt-2 text-muted-foreground">
          View and track your submitted incident reports
        </p>
      </div>

      {/* Filters Card */}
      <Card className="border-border/80 bg-card/85">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by type or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Status Filter
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
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
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredIncidents.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredIncidents.length} report
            {filteredIncidents.length !== 1 ? "s" : ""}
          </div>
          {filteredIncidents.map((incident) => (
            <Card
              key={incident.report_id}
              className="border-border/80 bg-card/85 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-xs tracking-wide text-muted-foreground">
                        {incident.report_id}
                      </span>
                      <StatusBadge status={incident.status} />
                      <SeverityBadge severity={incident.severity_level} />
                    </div>
                    <CardTitle className="text-lg truncate">
                      {incident.incident_type}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {incident.short_description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Location & Time Info */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {incident.location_address}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Reported</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(
                          incident.time_report_submitted,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Victims Info (if available) */}
                {incident.number_of_victims &&
                  incident.number_of_victims > 0 && (
                    <div className="flex gap-2 rounded-md bg-orange-50 dark:bg-orange-950/20 p-3">
                      <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <span className="font-semibold">
                          {incident.number_of_victims}
                        </span>{" "}
                        victim
                        {incident.number_of_victims !== 1 ? "s" : ""} reported
                      </p>
                    </div>
                  )}

                {/* AI Assessment - Show for analyzed incidents */}
                {incident.status !== "reported" && (
                  <div className="border-t border-border/50 pt-4">
                    <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      AI Assessment
                    </p>
                    <AIAssessmentCard
                      severity={incident.severity_level}
                      summary={incident.short_description}
                      detectedInjuries={incident.number_of_victims}
                      recommendations={[
                        `Status: ${incident.status}`,
                        `Severity: ${incident.severity_level}`,
                        incident.number_of_victims
                          ? `Injuries: ${incident.number_of_victims}`
                          : "No injuries reported",
                      ]}
                      isLoading={false}
                      compact={true}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="mb-2 text-lg font-semibold text-foreground">
              No reports found
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter"
                : "You haven't submitted any incident reports yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
