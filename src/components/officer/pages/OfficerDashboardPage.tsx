import { AlertCircle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MetricCard,
  DashboardSection,
  PageHeader,
  StatsGrid,
  ChartContainer,
} from "@/components/premium/DashboardComponents";
import type { IncidentReport } from "@/types/incident";

interface OfficerDashboardPageProps {
  incidents: IncidentReport[];
  queueStats: {
    newCount: number;
    inProgressCount: number;
    resolvedCount: number;
  };
  incidentTypeBreakdown: Array<{ type: string; count: number }>;
  responseMetrics: {
    dispatchMinutes: number;
    acceptanceMinutes: number | null;
    arrivalMinutes: number;
    resolutionMinutes: number;
  };
  userName: string;
}

export default function OfficerDashboardPage({
  incidents,
  responseMetrics,
}: OfficerDashboardPageProps) {
  const criticalCount = incidents.filter(
    (i) => i.severity_level === "Critical",
  ).length;
  const activeCount = incidents.filter((i) => i.status !== "Closed").length;
  const todayResolved = incidents.filter(
    (i) =>
      i.resolved_time &&
      new Date(i.resolved_time).toDateString() === new Date().toDateString(),
  ).length;

  const severityData = [
    {
      name: "Critical",
      value: incidents.filter((i) => i.severity_level === "Critical").length,
    },
    {
      name: "High",
      value: incidents.filter((i) => i.severity_level === "High").length,
    },
    {
      name: "Medium",
      value: incidents.filter((i) => i.severity_level === "Medium").length,
    },
    {
      name: "Low",
      value: incidents.filter((i) => i.severity_level === "Low").length,
    },
  ];

  const incidentsData = [
    { month: "Mon", reported: 12, resolved: 8 },
    { month: "Tue", reported: 19, resolved: 11 },
    { month: "Wed", reported: 15, resolved: 13 },
    { month: "Thu", reported: 22, resolved: 18 },
    { month: "Fri", reported: 28, resolved: 25 },
    { month: "Sat", reported: 16, resolved: 14 },
    { month: "Sun", reported: 10, resolved: 9 },
  ];

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Officer Dashboard"
        description="Monitor incidents and manage operations across all response zones"
      />

      {/* Critical Metrics */}
      <DashboardSection
        title="Critical Overview"
        description="Most important metrics at a glance"
      >
        <StatsGrid columns={4}>
          <MetricCard
            label="Critical Incidents"
            value={criticalCount}
            icon={AlertCircle}
            trend={{
              direction: criticalCount > 5 ? "up" : "down",
              value: `${criticalCount} active`,
              color: criticalCount > 0 ? "negative" : "positive",
            }}
          />
          <MetricCard
            label="Active Cases"
            value={activeCount}
            icon={BarChart3}
            trend={{
              direction: "up",
              value: `${activeCount} in progress`,
              color: "neutral",
            }}
          />
          <MetricCard
            label="Resolved Today"
            value={todayResolved}
            icon={CheckCircle}
            trend={{
              direction: "up",
              value: `+${todayResolved} closed`,
              color: "positive",
            }}
          />
          <MetricCard
            label="Avg Response"
            value={`${Math.round(responseMetrics.dispatchMinutes)}m`}
            icon={Clock}
            trend={{
              direction: responseMetrics.dispatchMinutes < 5 ? "down" : "up",
              value: "dispatch time",
              color:
                responseMetrics.dispatchMinutes < 5 ? "positive" : "neutral",
            }}
          />
        </StatsGrid>
      </DashboardSection>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents Trend */}
        <ChartContainer
          title="Weekly Incidents"
          description="Reported vs resolved incidents over the week"
          height="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incidentsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
              <XAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#1e293b" }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="reported"
                stroke="#ef4444"
                name="Reported"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#22c55e"
                name="Resolved"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Severity Distribution */}
        <ChartContainer
          title="Severity Breakdown"
          description="Current distribution by incident severity"
          height="h-96"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
              <Pie
                data={severityData}
                cx="50%"
                cy="45%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={60}
                innerRadius={0}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#1e293b" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Response Metrics Detailed */}
      <DashboardSection
        title="Response Performance"
        description="Average times for dispatch workflow stages"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Dispatch Time
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {Math.round(responseMetrics.dispatchMinutes)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                min
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Time to dispatch first responder
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Acceptance Time
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {responseMetrics.acceptanceMinutes !== null
                  ? Math.round(responseMetrics.acceptanceMinutes)
                  : "—"}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                min
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Responder acceptance time
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Arrival Time
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {Math.round(responseMetrics.arrivalMinutes)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                min
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Time to arrive at scene
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Resolution Time
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {Math.round(responseMetrics.resolutionMinutes)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                min
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Complete resolution time
            </p>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
}
