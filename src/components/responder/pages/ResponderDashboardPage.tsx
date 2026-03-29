import {
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import {
  MetricCard,
  DashboardSection,
  PageHeader,
  StatsGrid,
  EmptyState,
} from "@/components/premium/DashboardComponents";
import ResponderStatusStats from "@/components/responder/ResponderStatusStats";
import StatusHistoryDisplay from "@/components/responder/StatusHistoryDisplay";
import type { IncidentReport } from "@/types/incident";

interface ResponderDashboardPageProps {
  incidents: IncidentReport[];
  userName: string;
}

export default function ResponderDashboardPage({
  incidents,
  userName,
}: ResponderDashboardPageProps) {
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpanded = (reportId: string) => {
    const newExpanded = new Set(expandedIncidents);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedIncidents(newExpanded);
  };
  const assignedCount = incidents.filter((i) => i.status !== "Closed").length;
  const completedToday = incidents.filter(
    (i) =>
      i.resolved_time &&
      new Date(i.resolved_time).toDateString() === new Date().toDateString(),
  ).length;
  const pendingCount = incidents.filter(
    (i) => i.status === "Submitted" || i.status === "Under Review",
  ).length;
  const criticalCount = incidents.filter(
    (i) => i.severity_level === "Critical" && i.status !== "Closed",
  ).length;
  const recentIncidents = incidents.slice(0, 8);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title={`Welcome, ${userName}!`}
        description="Emergency Response Dashboard – Track your assignments and respond to incidents"
      />

      {/* Priority Metrics */}
      <DashboardSection
        title="Active Status"
        description="Your real-time assignment status"
      >
        <StatsGrid columns={4}>
          <MetricCard
            label="Active Assignments"
            value={assignedCount}
            icon={Zap}
            trend={{
              direction: assignedCount > 5 ? "up" : "down",
              value: `${assignedCount} waiting`,
              color: assignedCount > 0 ? "neutral" : "positive",
            }}
          />
          <MetricCard
            label="Critical Cases"
            value={criticalCount}
            icon={AlertCircle}
            trend={{
              direction: criticalCount > 0 ? "up" : "down",
              value: `${criticalCount} urgent`,
              color: criticalCount > 0 ? "negative" : "positive",
            }}
          />
          <MetricCard
            label="Pending Review"
            value={pendingCount}
            icon={Clock}
            trend={{
              direction: "up",
              value: `${pendingCount} in review`,
              color: "neutral",
            }}
          />
          <MetricCard
            label="Completed Today"
            value={completedToday}
            icon={CheckCircle}
            trend={{
              direction: "up",
              value: `${completedToday} closed`,
              color: "positive",
            }}
          />
        </StatsGrid>
      </DashboardSection>

      {/* Detailed Status Stats */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Response Progress Overview
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Track your response status across all assignments
        </p>
        <ResponderStatusStats incidents={incidents} />
      </div>

      {/* Critical Alert */}
      {criticalCount > 0 && (
        <div className="rounded-lg border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Critical Incidents
              </h3>
              <p className="mt-1 text-sm text-red-800 dark:text-red-200">
                You have {criticalCount}{" "}
                {criticalCount === 1
                  ? "critical incident"
                  : "critical incidents"}{" "}
                awaiting immediate response.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Assignments */}
      <DashboardSection
        title="Current Assignments"
        description="Your active and pending incidents"
      >
        {recentIncidents.length > 0 ? (
          <div className="space-y-3">
            {recentIncidents.map((incident) => {
              const isCritical = incident.severity_level === "Critical";
              const isPending =
                incident.status === "Submitted" ||
                incident.status === "Under Review";
              const isExpanded = expandedIncidents.has(incident.report_id!);

              return (
                <div key={incident.report_id || incident.backend_accident_id}>
                  <div
                    onClick={() => toggleExpanded(incident.report_id!)}
                    className={`flex items-center justify-between rounded-lg border-l-4 p-4 transition-all cursor-pointer ${
                      isCritical
                        ? "border-l-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20"
                        : isPending
                          ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                          : "border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/10 hover:bg-cyan-100 dark:hover:bg-cyan-900/20"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
                            isCritical
                              ? "bg-red-100 dark:bg-red-900/30"
                              : isPending
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : "bg-cyan-100 dark:bg-cyan-900/30"
                          }`}
                        >
                          <AlertCircle
                            className={`h-5 w-5 ${
                              isCritical
                                ? "text-red-600 dark:text-red-400"
                                : isPending
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-cyan-600 dark:text-cyan-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {incident.incident_type}
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {incident.location_address}
                          </p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                            {new Date(
                              incident.created_at || "",
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            isCritical
                              ? "bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200"
                              : isPending
                                ? "bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                                : "bg-cyan-200 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200"
                          }`}
                        >
                          {incident.severity_level}
                        </span>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {incident.status === "Closed"
                            ? "✓ Done"
                            : incident.status}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Status History */}
                  {isExpanded && (
                    <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                      <StatusHistoryDisplay
                        createdAt={incident.created_at || ""}
                        currentStatus={
                          incident.short_description?.includes("Status:")
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="No assignments"
            description="You're all caught up! No incidents are currently assigned to you."
          />
        )}
      </DashboardSection>

      {/* Quick Info */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">
            Tip:
          </span>{" "}
          Enable notifications to get real-time alerts for new incident
          assignments. Check your profile settings.
        </p>
      </div>
    </div>
  );
}
