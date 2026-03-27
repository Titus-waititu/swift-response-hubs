import { FileText, AlertCircle, Clock, Plus } from "lucide-react";
import {
  MetricCard,
  DashboardSection,
  PageHeader,
  StatsGrid,
  EmptyState,
} from "@/components/premium/DashboardComponents";
import type { IncidentReport } from "@/types/incident";

interface UserDashboardPageProps {
  incidents: IncidentReport[];
  userName: string;
}

export default function UserDashboardPage({
  incidents,
  userName,
}: UserDashboardPageProps) {
  const totalReports = incidents.length;
  const pendingReports = incidents.filter((i) => i.status !== "Closed").length;
  const resolvedReports = incidents.filter((i) => i.status === "Closed").length;
  const recentReports = incidents.slice(0, 5);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${userName}!`}
        description="Track your incident reports and manage submissions from one place"
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
            label="Pending"
            value={pendingReports}
            icon={Clock}
            trend={
              pendingReports > 0
                ? {
                    direction: "down",
                    value: `${pendingReports} awaiting update`,
                    color: "neutral",
                  }
                : undefined
            }
          />
          <MetricCard
            label="Resolved"
            value={resolvedReports}
            icon={AlertCircle}
            trend={{
              direction: "up",
              value: `${resolvedReports} closed`,
              color: "positive",
            }}
          />
        </StatsGrid>
      </DashboardSection>

      {/* Recent Reports */}
      <DashboardSection
        title="Recent Reports"
        description="Your latest incident submissions"
      >
        {recentReports.length > 0 ? (
          <div className="space-y-3">
            {recentReports.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                      <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {incident.incident_type}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {incident.location}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                        {new Date(
                          incident.created_time || "",
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
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
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {incident.status === "Closed"
                      ? "✓ Resolved"
                      : "⏳ " + incident.status}
                  </span>
                </div>
              </div>
            ))}
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
