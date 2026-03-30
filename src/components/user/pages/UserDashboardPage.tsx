import {
  FileText,
  AlertCircle,
  Clock,
  Plus,
  CheckCircle2,
  MapPin,
  Truck,
} from "lucide-react";
import {
  MetricCard,
  DashboardSection,
  PageHeader,
  StatsGrid,
  EmptyState,
} from "@/components/premium/DashboardComponents";
import { AIAssessmentCard } from "@/components/AIAssessmentCard";
import type { IncidentReport } from "@/types/incident";
import {
  STATUS_STEPS,
  getStatusIndex,
  getStatusLabel,
} from "@/lib/status-utils";

interface UserDashboardPageProps {
  incidents: IncidentReport[];
  userName: string;
}

export default function UserDashboardPage({
  incidents,
  userName,
}: UserDashboardPageProps) {
  const totalReports = incidents.length;
  const pendingReports = incidents.filter(
    (i) => i.status !== "closed" && i.status !== "resolved",
  ).length;
  const resolvedReports = incidents.filter((i) => i.status === "closed").length;
  const recentReports = incidents.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${userName}!`}
        description="Track your incident reports and monitor real-time progress from dispatch through to responders arriving on scene"
      />

      {/* Overview Metrics */}
      <DashboardSection
        title="Overview"
        description="Quick summary of your incident reports"
      >
        <StatsGrid columns={3}>
          <MetricCard
            label="Total Reports"
            value={totalReports}
            icon={FileText}
            trend={{
              direction: "up",
              value: "See all →",
              color: "neutral",
            }}
          />
          <MetricCard
            label="In Progress"
            value={pendingReports}
            icon={Clock}
            trend={
              pendingReports > 0
                ? {
                    direction: "down",
                    value: `${pendingReports} being handled`,
                    color: "neutral",
                  }
                : undefined
            }
          />
          <MetricCard
            label="Resolved"
            value={resolvedReports}
            icon={CheckCircle2}
            trend={{
              direction: "up",
              value: `${resolvedReports} closed`,
              color: "positive",
            }}
            backgroundColor="bg-green-50 dark:bg-green-900/20"
            iconBackgroundColor="bg-green-100 dark:bg-green-900/40"
            iconColor="text-green-600 dark:text-green-400"
            valueTextColor="text-green-700 dark:text-green-300"
          />
        </StatsGrid>
      </DashboardSection>

      {/* Recent Reports with Real-Time Status Progress */}
      <DashboardSection
        title="Recent Reports"
        description="Your latest incident submissions with real-time status updates"
      >
        {recentReports.length > 0 ? (
          <div className="space-y-4">
            {recentReports.map((incident) => {
              const currentStatusIndex = getStatusIndex(incident.status);
              return (
                <div
                  key={incident.report_id}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                          <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {incident.incident_type}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {incident.report_id}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {incident.location_address}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          incident.severity_level === "Critical"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            : incident.severity_level === "High"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                              : incident.severity_level === "Medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {incident.severity_level}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(incident.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline - Real-Time Progress */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">
                      Real-Time Progress 🔄
                    </p>
                    <div className="overflow-x-auto pb-2">
                      <div className="flex justify-between items-start min-w-[500px] px-2 pt-2">
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStatusIndex;
                          const isCurrent = idx === currentStatusIndex;
                          const StepIcon = step.icon;

                          return (
                            <div
                              key={step.id}
                              className="relative flex flex-col items-center flex-1"
                            >
                              {/* Connector line */}
                              {idx < STATUS_STEPS.length - 1 && (
                                <div
                                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                                    idx < currentStatusIndex
                                      ? "bg-green-500"
                                      : "bg-slate-200 dark:bg-slate-700"
                                  }`}
                                />
                              )}

                              <div
                                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                  isCurrent
                                    ? "bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-900/30 scale-125 shadow-lg"
                                    : isCompleted
                                      ? "bg-green-500 text-white shadow-sm"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                <StepIcon className="h-4 w-4" />
                              </div>
                              <div className="mt-3 flex flex-col items-center text-center px-1">
                                <div className="flex items-center justify-center gap-2">
                                  <p
                                    className={`text-xs font-semibold whitespace-nowrap ${
                                      isCurrent
                                        ? "text-orange-600 dark:text-orange-400 text-sm font-bold"
                                        : isCompleted
                                          ? "text-slate-900 dark:text-white"
                                          : "text-slate-500 dark:text-slate-400"
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                  {isCurrent && (
                                    <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-[10px] font-semibold text-orange-700 dark:text-orange-300 whitespace-nowrap">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block text-center balance">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1">
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                        Status: {getStatusLabel(incident.status)}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Updated: {new Date(incident.updated_at).toLocaleTimeString()}
                      </span>
                    </p>
                  </div>

                  {/* Additional Info */}
                  {(incident.number_of_victims ||
                    incident.short_description) && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                      {incident.number_of_victims && (
                        <p className="text-slate-600 dark:text-slate-400">
                          <span className="font-medium">
                            Reported Injuries:
                          </span>{" "}
                          {incident.number_of_victims}
                        </p>
                      )}
                      {incident.short_description && (
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                          <span className="font-medium">Description:</span>{" "}
                          {incident.short_description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* AI Assessment Card */}
                  {incident.status !== "reported" && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <AIAssessmentCard
                        severity={incident.severity_level}
                        summary={`Incident analysis for ${incident.incident_type}`}
                        recommendations={[
                          `Priority Level: ${incident.severity_level}`,
                          `Injuries: ${incident.number_of_victims || 0} victim${incident.number_of_victims !== 1 ? "s" : ""}`,
                          `Status: ${incident.status}`,
                        ]}
                        detectedInjuries={incident.number_of_victims}
                        isLoading={false}
                        compact={true}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No reports yet"
            description="You haven't submitted any incident reports yet. Click below to report an accident."
            action={{
              label: "Submit Report",
              onClick: () => console.log("Navigate to submit report"),
            }}
          />
        )}
      </DashboardSection>

      {/* CTA Section */}
      {totalReports === 0 && (
        <div className="rounded-lg border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex-shrink-0">
              <Plus className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-cyan-900 dark:text-cyan-100">
                Get started
              </h3>
              <p className="mt-1 text-sm text-cyan-800 dark:text-cyan-200">
                Report your first accident to help emergency responders arrive
                faster. Your information helps keep communities safe.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
