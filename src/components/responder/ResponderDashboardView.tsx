import {
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  LogOut,
  MapPin,
  Shield,
  Eye,
  AlertCircle,
  Bell,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, SeverityBadge } from "@/components/StatusBadge";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { formatTimeAgo } from "@/lib/incident-utils";
import {
  useGetUnreadNotifications,
  useGetNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/useNotifications";
import {
  FocusRow,
  InfoChip,
  SignalRow,
  TopSignalCard,
} from "@/components/dispatcher/DispatcherShared";
import type { IncidentReport } from "@/types/incident";

import type { ResponderSession } from "./ResponderTypes";

const severityRailStyles = {
  Critical: "before:bg-severity-critical",
  High: "before:bg-severity-high",
  Medium: "before:bg-severity-medium",
  Low: "before:bg-severity-low",
} as const;

interface ResponderDashboardViewProps {
  session: ResponderSession;
  activeTab: "active" | "completed" | "notifications";
  activeIncidents: IncidentReport[];
  completedIncidents: IncidentReport[];
  pendingDispatches?: any[];
  onActiveTabChange: (value: "active" | "completed" | "notifications") => void;
  onSelectIncident: (reportId: string) => void;
  onAcceptDispatch?: (dispatchId: string) => void;
  onRejectDispatch?: (dispatchId: string) => void;
  onStatusUpdate?: (incident: any, newStatus: string) => void;
  onLogout: () => void;
}

export default function ResponderDashboardView({
  session,
  activeTab,
  activeIncidents,
  completedIncidents,
  pendingDispatches = [],
  onActiveTabChange,
  onSelectIncident,
  onAcceptDispatch,
  onRejectDispatch,
  onStatusUpdate,
  onLogout,
}: ResponderDashboardViewProps) {
  const { data: unreadNotifications = [] } = useGetUnreadNotifications();
  const { data: allNotifications = [] } = useGetNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  // Ensure we always have an array
  const notificationsArray = Array.isArray(allNotifications)
    ? allNotifications
    : allNotifications?.data && Array.isArray(allNotifications.data)
      ? allNotifications.data
      : [];

  const unreadArray = Array.isArray(unreadNotifications)
    ? unreadNotifications
    : unreadNotifications?.data && Array.isArray(unreadNotifications.data)
      ? unreadNotifications.data
      : [];

  const unreadCount = unreadArray.length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId, {
      onError: (error: any) => {
        console.error("Failed to mark notification as read:", error);
      },
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
      case "critical":
      case "emergency_alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "status_update":
      case "dispatch_instruction":
      case "responder_assignment":
      case "accident_assigned":
        return <Bell className="h-4 w-4 text-teal-500" />;
      case "accident_reported":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "system_notification":
      case "info":
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "alert":
      case "critical":
      case "emergency_alert":
        return "bg-red-50 dark:bg-red-950/30";
      case "status_update":
      case "dispatch_instruction":
      case "responder_assignment":
      case "accident_assigned":
        return "bg-teal-50 dark:bg-teal-950/30";
      case "accident_reported":
        return "bg-blue-50 dark:bg-blue-950/30";
      case "system_notification":
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-950/30";
    }
  };
  const submittedCount = activeIncidents.filter(
    (incident) => incident.status === "Submitted",
  ).length;
  const underReviewCount = activeIncidents.filter(
    (incident) => incident.status === "Under Review",
  ).length;
  const criticalActiveCount = activeIncidents.filter(
    (incident) => incident.severity_level === "Critical",
  ).length;
  const latestAccident = activeIncidents[0] ?? completedIncidents[0];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute left-[-8rem] top-16 h-64 w-64 rounded-full bg-info/10 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-success/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 py-6 md:py-8">
        <div className="mb-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
            <div className="h-24 bg-gradient-to-b from-info/18 via-success/10 to-transparent" />
            <CardContent className="relative -mt-10 p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/70 px-4 py-2">
                    <Shield className="h-4 w-4 text-info" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-info">
                      Responder Console
                    </span>
                  </div>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                    Review backend accident intake from the responder workspace
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    This backend currently supports responder visibility into
                    accident records, but not the richer prototype field
                    workflow. Use this dashboard to track open and completed
                    accidents while status control stays with dispatch.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <div className="rounded-full border border-border/70 bg-secondary/70 px-4 py-2 text-sm text-foreground">
                    {session.name}
                  </div>
                  <div className="rounded-full border border-border/70 bg-secondary/70 px-4 py-2 text-sm text-foreground">
                    {session.unitLabel}
                  </div>
                  <NotificationsDropdown />
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
                  value={String(submittedCount)}
                  caption="Open accident reports that have not moved into review yet."
                  icon={ClipboardList}
                  iconColor="text-warning"
                />
                <TopSignalCard
                  label="Under Review"
                  value={String(underReviewCount)}
                  caption="Accidents currently in the investigation stage."
                  icon={Eye}
                  iconColor="text-success"
                />
                <TopSignalCard
                  label="Critical Open"
                  value={String(criticalActiveCount)}
                  caption="Highest severity open accidents visible to responders."
                  icon={MapPin}
                  iconColor="text-info"
                />
                <TopSignalCard
                  label="Completed"
                  value={String(completedIncidents.length)}
                  caption="Field responses closed and ready for review."
                  icon={ClipboardList}
                  iconColor="text-primary"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                  <Shield className="h-5 w-5 text-info" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">
                    Field Signal
                  </CardTitle>
                  <CardDescription>
                    Current pressure across the unit workspace.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <SignalRow
                label="Critical open accidents"
                value={String(criticalActiveCount)}
              />
              <SignalRow
                label="Open accidents"
                value={String(activeIncidents.length)}
              />
              <SignalRow
                label="Completed accidents"
                value={String(completedIncidents.length)}
              />
              <SignalRow label="Unit status" value="On Duty" />
              <div className="rounded-2xl border border-border/70 bg-secondary/55 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  Latest Accident
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {latestAccident?.incident_type ?? "No accidents yet"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {latestAccident
                    ? `${latestAccident.location_address} • ${formatTimeAgo(latestAccident.time_report_submitted)}`
                    : "New accidents will surface here once they are available to responders."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Dispatches Section */}
        {pendingDispatches && pendingDispatches.length > 0 && (
          <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <CardTitle className="text-amber-900 dark:text-amber-100">
                    Pending Dispatch Requests ({pendingDispatches.length})
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-amber-800 dark:text-amber-200">
                You have new dispatch assignments waiting for your response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingDispatches.map((dispatch: any) => (
                <div
                  key={dispatch.id}
                  className="flex flex-col gap-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {dispatch.incidentDescription ||
                          dispatch.description ||
                          "Dispatch Assignment"}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>
                          <strong>Service Type:</strong> {dispatch.serviceType}
                        </p>
                        <p>
                          <strong>Severity:</strong>{" "}
                          {typeof dispatch.severity === "number"
                            ? dispatch.severity
                            : dispatch.severity}
                          /100
                        </p>
                        {dispatch.latitude && dispatch.longitude && (
                          <p className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <strong>Location:</strong> {dispatch.latitude},{" "}
                            {dispatch.longitude}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onRejectDispatch && onRejectDispatch(dispatch.id)
                      }
                      className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        onAcceptDispatch && onAcceptDispatch(dispatch.id)
                      }
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    >
                      Accept & Respond
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            onActiveTabChange(value as "active" | "completed" | "notifications")
          }
        >
          <TabsList className="mb-4 border border-border/70 bg-secondary/75">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              Open Accidents
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              Completed Log
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground"
            >
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-3">
                {activeIncidents.map((incident) => (
                  <Card
                    key={incident.report_id}
                    className={`group relative overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-info/30 hover:shadow-[0_16px_60px_rgba(0,0,0,0.28)] before:absolute before:inset-y-0 before:left-0 before:w-1.5 ${severityRailStyles[incident.severity_level]}`}
                  >
                    <CardContent className="p-5">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px]">
                        <div
                          className="min-w-0 cursor-pointer"
                          onClick={() => onSelectIncident(incident.report_id)}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs tracking-wide text-muted-foreground">
                              {incident.report_id}
                            </span>
                            <StatusBadge status={incident.status} />
                            <SeverityBadge
                              severity={incident.severity_level}
                            />
                          </div>

                          <div className="mt-3">
                            <p className="text-base font-semibold text-foreground">
                              {incident.incident_type}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {incident.short_description}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
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
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-secondary/45 p-4">
                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                              Case View
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">
                              Open the accident to inspect details from the
                              responder workspace.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm text-foreground hover:bg-background transition-colors"
                            onClick={() => onSelectIncident(incident.report_id)}
                          >
                            Open Accident
                            <ChevronRight className="h-4 w-4 text-info" />
                          </button>
                        </div>
                      </div>

                      {/* Status Update Buttons */}
                      {incident.status !== "Closed" && onStatusUpdate && (
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Update Status
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onStatusUpdate(incident, "Accepted")
                              }
                              className="text-xs"
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onStatusUpdate(incident, "En Route")
                              }
                              className="text-xs"
                            >
                              En Route
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onStatusUpdate(incident, "On Scene")
                              }
                              className="text-xs bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                            >
                              On Scene
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                onStatusUpdate(incident, "Completed")
                              }
                              className="text-xs bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                            >
                              Complete
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {activeIncidents.length === 0 && (
                  <Card className="border-border/80 bg-card/85">
                    <CardContent className="p-10 text-center">
                      <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-4 text-base font-semibold text-foreground">
                        No open accidents in the responder queue
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        New accidents will show up here when the backend exposes
                        them to responder accounts.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Field Priorities
                    </CardTitle>
                    <CardDescription>
                      Fast read on what the unit should act on next.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FocusRow
                      title="Submitted backlog"
                      value={String(submittedCount)}
                      helper="Reports still sitting in the first backend status."
                    />
                    <FocusRow
                      title="Under review"
                      value={String(underReviewCount)}
                      helper="Accidents currently progressing through investigation."
                    />
                    <FocusRow
                      title="Critical active cases"
                      value={String(criticalActiveCount)}
                      helper="Highest-severity accidents currently under response."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-3">
                {completedIncidents.map((incident) => (
                  <Card
                    key={incident.report_id}
                    className="border-border/80 bg-card/85 transition-all hover:border-info/20"
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => onSelectIncident(incident.report_id)}
                    >
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-secondary/70">
                          <CheckCircle className="h-5 w-5 text-success" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs tracking-wide text-muted-foreground">
                              {incident.report_id}
                            </span>
                            <StatusBadge status={incident.status} />
                          </div>
                          <p className="mt-2 text-base font-semibold text-foreground">
                            {incident.incident_type}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {"Resolved and logged"}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </CardContent>
                    </button>
                  </Card>
                ))}

                {completedIncidents.length === 0 && (
                  <Card className="border-border/80 bg-card/85">
                    <CardContent className="p-10 text-center">
                      <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-4 text-base font-semibold text-foreground">
                        Completed accidents will appear here
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Closed accidents will appear here as the backend
                        lifecycle advances.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card className="border-border/80 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Completion Signal
                    </CardTitle>
                    <CardDescription>
                      High-level read on closed field activity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <SignalRow
                      label="Resolved accidents"
                      value={String(completedIncidents.length)}
                    />
                    <SignalRow
                      label="Current open accidents"
                      value={String(activeIncidents.length)}
                    />
                    <SignalRow
                      label="Responder unit"
                      value={session.unitLabel}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <div className="grid gap-4">
              <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Notifications {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {notificationsArray.length === 0
                      ? "No notifications yet"
                      : `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationsArray.length > 0 ? (
                    <div className="space-y-2">
                      {notificationsArray.map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`rounded-lg p-4 space-y-2 flex items-start gap-3 transition-all border ${getNotificationBg(
                            notification.type,
                          )}`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {notification.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                            title="Mark as read"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-base font-semibold text-foreground">
                        No notifications
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You'll receive notifications about assignments, status updates, and dispatch instructions here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
