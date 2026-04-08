import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle,
  CheckCheck,
  Clock,
  Filter,
  MapPin,
  Radio,
  ScanSearch,
  Search,
  Siren,
  Users,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import { AIAssessmentCard } from "@/components/AIAssessmentCard";
import { formatTimeAgo } from "@/lib/incident-utils";
import {
  formatAverageMinutes,
  isActiveIncident,
} from "@/lib/incident-analytics";

import {
  FocusRow,
  InfoChip,
  MetricStrip,
  SignalRow,
  TopSignalCard,
} from "./DispatcherShared";
import type {
  DispatcherSession,
  DispatcherStatusOptions,
  DispatcherTimingItem,
} from "./DispatcherTypes";
import type { IncidentReport, SeverityLevel } from "@/types/incident";

const severityRailStyles: Record<SeverityLevel, string> = {
  Critical: "before:bg-severity-critical",
  High: "before:bg-severity-high",
  Medium: "before:bg-severity-medium",
  Low: "before:bg-severity-low",
};

interface DispatcherDashboardViewProps {
  session: DispatcherSession;
  incidents: IncidentReport[];
  filteredIncidents: IncidentReport[];
  activeTab: "queue" | "map" | "analytics";
  queueStats: {
    newCount: number;
    inProgressCount: number;
    dispatchedCount: number;
    resolvedCount: number;
  };
  statusOptions: DispatcherStatusOptions;
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onActiveTabChange: (value: "queue" | "map" | "analytics") => void;
  onSelectIncident: (reportId: string) => void;
  onLogout: () => void;
  incidentTypeBreakdown: Array<{ type: string; count: number; pct: number }>;
  responseMetrics: {
    dispatchMinutes: number | null;
    acceptanceMinutes: number | null;
    arrivalMinutes: number | null;
    resolutionMinutes: number | null;
  };
}

export default function DispatcherDashboardView({
  session,
  incidents,
  filteredIncidents,
  activeTab,
  queueStats,
  statusOptions,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onActiveTabChange,
  onSelectIncident,
  onLogout,
  incidentTypeBreakdown,
  responseMetrics,
}: DispatcherDashboardViewProps) {
  const criticalOpenCount = incidents.filter(
    (incident) =>
      isActiveIncident(incident.status) &&
      incident.severity_level === "Critical",
  ).length;
  const openCases = incidents.filter((incident) =>
    isActiveIncident(incident.status),
  ).length;
  const underReviewCount = incidents.filter(
    (incident) => incident.status === "under_investigation",
  ).length;
  const closedCount = incidents.filter(
    (incident) => incident.status === "closed",
  ).length;
  const latestIncident = incidents[0];
  const timingItems: DispatcherTimingItem[] = [
    {
      label: "Dispatch",
      value: formatAverageMinutes(responseMetrics.dispatchMinutes),
    },
    {
      label: "Acceptance",
      value: formatAverageMinutes(responseMetrics.acceptanceMinutes),
    },
    {
      label: "Arrival",
      value: formatAverageMinutes(responseMetrics.arrivalMinutes),
    },
    {
      label: "Resolution",
      value: formatAverageMinutes(responseMetrics.resolutionMinutes),
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute left-[-8rem] top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 py-6 md:py-8">
        <div className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
            <div className="h-24 bg-gradient-to-b from-primary/18 via-info/10 to-transparent" />
            <CardContent className="relative -mt-10 p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/70 px-4 py-2">
                    <Radio className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                      Dispatch Console
                    </span>
                  </div>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                    Coordinate the queue, review accidents, and move cases fast
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    Monitor the live queue, review incoming accident reports,
                    and move cases through the backend-supported lifecycle from
                    submission to closure.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <div className="rounded-full border border-border/70 bg-secondary/70 px-4 py-2 text-sm text-foreground">
                    {session.name}
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Bell className="h-4 w-4" />
                    Alerts
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[11px] font-bold text-primary">
                      {criticalOpenCount}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary"
                    onClick={onLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <TopSignalCard
                  label="Submitted"
                  value={String(queueStats.newCount)}
                  caption="Fresh accident reports that still need a dispatcher review."
                  icon={AlertTriangle}
                  iconColor="text-primary"
                />
                <TopSignalCard
                  label="Under Review"
                  value={String(queueStats.inProgressCount)}
                  caption="Cases actively being investigated by dispatch."
                  icon={Clock}
                  iconColor="text-warning"
                />
                <TopSignalCard
                  label="Resolved"
                  value={String(queueStats.dispatchedCount)}
                  caption="Accidents marked resolved but not yet formally closed."
                  icon={CheckCircle}
                  iconColor="text-info"
                />
                <TopSignalCard
                  label="Closed"
                  value={String(queueStats.resolvedCount)}
                  caption="Cases completed and closed out in the backend lifecycle."
                  icon={CheckCheck}
                  iconColor="text-success"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                  <Siren className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    Queue Signal
                  </CardTitle>
                  <CardDescription>
                    Operational pressure in the current cycle.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <SignalRow
                label="Critical open accidents"
                value={String(criticalOpenCount)}
              />
              <SignalRow
                label="Open submitted or review cases"
                value={String(openCases)}
              />
              <SignalRow
                label="Cases currently under review"
                value={String(underReviewCount)}
              />
              <SignalRow label="Closed accidents" value={String(closedCount)} />
              <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Latest Queue Entry
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {latestIncident?.incident_type ?? "No accidents yet"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {latestIncident
                    ? `${latestIncident.location_address} • ${formatTimeAgo(latestIncident.time_report_submitted)}`
                    : "New accident reports will appear here once intake begins."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            onActiveTabChange(value as "queue" | "map" | "analytics")
          }
        >
          <TabsList className="mb-4 border border-border/70 bg-secondary/75">
            <TabsTrigger
              value="queue"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              Accident Queue
            </TabsTrigger>
            <TabsTrigger
              value="map"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              Map View
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-5">
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="border-border bg-secondary pl-10 text-foreground"
                          placeholder="Search by report ID, accident type, address, or description..."
                          value={search}
                          onChange={(event) =>
                            onSearchChange(event.target.value)
                          }
                        />
                      </div>
                      <Select
                        value={statusFilter}
                        onValueChange={onStatusFilterChange}
                      >
                        <SelectTrigger className="border-border bg-secondary text-foreground">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  {filteredIncidents.map((incident) => (
                    <Card
                      key={incident.report_id}
                      className={`group relative overflow-hidden border-l-4 bg-card/85 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${severityRailStyles[incident.severity_level]}`}
                    >
                      <CardContent className="p-5">
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                          {/* Left Content - Clickable */}
                          <button
                            type="button"
                            className="text-left hover:opacity-75 transition-opacity"
                            onClick={() => onSelectIncident(incident.report_id)}
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="font-mono text-xs tracking-wide text-muted-foreground">
                                {incident.report_id}
                              </span>
                              <StatusBadge status={incident.status} />
                              <SeverityBadge
                                severity={incident.severity_level}
                              />
                            </div>

                            <div className="flex gap-3 mb-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/70">
                                <AlertTriangle className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-base font-semibold text-foreground">
                                  {incident.incident_type}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground line-clamp-2">
                                  {incident.short_description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <InfoChip
                                icon={MapPin}
                                label={incident.location_address}
                              />
                              <InfoChip
                                icon={Clock}
                                label={formatTimeAgo(
                                  incident.time_report_submitted,
                                )}
                              />
                              {incident.number_of_victims !== undefined &&
                                incident.number_of_victims > 0 && (
                                  <InfoChip
                                    icon={Users}
                                    label={`${incident.number_of_victims} Injur${incident.number_of_victims === 1 ? "y" : "ies"}`}
                                  />
                                )}
                            </div>
                          </button>

                          {/* Right Action Panel */}
                          <div className="flex flex-col items-end gap-3 lg:items-start w-full lg:max-w-xs">
                            <div className="text-right lg:text-left w-full">
                              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                                Status
                              </p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {incident.status === "reported"
                                  ? "Needs Review"
                                  : "In Progress"}
                              </p>
                            </div>

                            {/* AI Assessment - Compact Mode */}
                            <div className="w-full">
                              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground mb-2">
                                AI Assessment
                              </p>
                              <AIAssessmentCard
                                severity={incident.severity_level}
                                summary={incident.short_description}
                                recommendations={[
                                  `Priority: ${incident.severity_level} severity case`,
                                  incident.number_of_victims &&
                                  incident.number_of_victims > 0
                                    ? `Injuries: ${incident.number_of_victims} victim${incident.number_of_victims !== 1 ? "s" : ""}`
                                    : "No injuries reported",
                                  "Requires dispatcher review before dispatch",
                                ]}
                                detectedInjuries={
                                  incident.number_of_victims &&
                                  incident.number_of_victims > 0
                                    ? incident.number_of_victims
                                    : undefined
                                }
                                isLoading={false}
                                compact={true}
                              />
                            </div>

                            <Button
                              onClick={() =>
                                onSelectIncident(incident.report_id)
                              }
                              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-fit lg:w-full"
                              size="sm"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                              Open
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredIncidents.length === 0 && (
                    <Card className="border-border/80 bg-card/85">
                      <CardContent className="p-10 text-center">
                        <ScanSearch className="mx-auto h-10 w-10 text-muted-foreground" />
                        <p className="mt-4 text-base font-semibold text-foreground">
                          No accidents match the current queue view
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Adjust the search query or reset the status filter to
                          bring accidents back into view.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Dispatch Focus
                    </CardTitle>
                    <CardDescription>
                      Quick read on the current operational priorities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FocusRow
                      title="Critical accident pressure"
                      value={String(criticalOpenCount)}
                      helper="Highest-severity accidents still open in the system."
                    />
                    <FocusRow
                      title="Open backend cases"
                      value={String(openCases)}
                      helper="Accidents still sitting in submitted or review status."
                    />
                    <FocusRow
                      title="Closure backlog"
                      value={String(queueStats.dispatchedCount)}
                      helper="Cases resolved locally but not yet closed in the backend lifecycle."
                    />
                  </CardContent>
                </Card>

                <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Response Rhythm
                    </CardTitle>
                    <CardDescription>
                      Average cycle times across the queue.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {timingItems.map((item) => (
                      <MetricStrip
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <Card className="overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
                <div className="h-32 bg-gradient-to-b from-info/15 via-primary/10 to-transparent" />
                <CardContent className="relative -mt-10 flex min-h-[380px] items-center justify-center p-8">
                  <div className="max-w-xl text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-border/70 bg-secondary/70">
                      <MapPin className="h-8 w-8 text-info" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold text-foreground">
                      Live map surface
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      This view is ready for live GPS markers, hot-zone
                      clustering, and responder routing overlays. The queue data
                      is already structured to support that integration next.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Map Readiness
                  </CardTitle>
                  <CardDescription>
                    Signals already available for a future geospatial layer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SignalRow
                    label="Accidents with coordinates"
                    value={String(
                      incidents.filter(
                        (incident) =>
                          incident.gps_latitude && incident.gps_longitude,
                      ).length,
                    )}
                  />
                  <SignalRow
                    label="Open cases on the map"
                    value={String(
                      incidents.filter((incident) =>
                        isActiveIncident(incident.status),
                      ).length,
                    )}
                  />
                  <SignalRow
                    label="Critical accidents to highlight"
                    value={String(criticalOpenCount)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        Accident distribution
                      </CardTitle>
                      <CardDescription>
                        Type mix across the current data set.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incidentTypeBreakdown.map((item) => (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-foreground">
                          {item.type}
                        </span>
                        <span className="font-mono text-sm text-muted-foreground">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-info to-accent"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        {item.pct}% of total accidents
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Timing Summary
                    </CardTitle>
                    <CardDescription>
                      Average operational timings across dispatch flow.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {timingItems.map((item) => (
                      <MetricStrip
                        key={item.label}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Queue Notes
                    </CardTitle>
                    <CardDescription>
                      Fast interpretation of the current dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Highest pressure is on{" "}
                      <span className="text-foreground">
                        {criticalOpenCount}
                      </span>{" "}
                      critical active accidents.
                    </p>
                    <p>
                      The most common accident type right now is{" "}
                      <span className="text-foreground">
                        {incidentTypeBreakdown[0]?.type ?? "N/A"}
                      </span>
                      .
                    </p>
                    <p>
                      Average arrival time is{" "}
                      <span className="text-foreground">
                        {formatAverageMinutes(responseMetrics.arrivalMinutes)}
                      </span>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
