import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import type { IncidentReport } from "../../../types/incident";

interface DispatcherDashboardPageProps {
  incidents: IncidentReport[];
  queueStats: {
    newCount: number;
    inProgressCount: number;
    dispatchedCount: number;
    resolvedCount: number;
  };
  incidentTypeBreakdown: Array<{ type: string; count: number; pct: number }>;
  responseMetrics: {
    dispatchMinutes: number | null;
    acceptanceMinutes: number | null;
    arrivalMinutes: number | null;
    resolutionMinutes: number | null;
  };
}

export default function DispatcherDashboardPage({
  incidents,
  queueStats,
  incidentTypeBreakdown,
  responseMetrics,
}: DispatcherDashboardPageProps) {
  const criticalCount = incidents.filter(
    (i) => i.severity_level === "Critical" && i.status !== "Closed",
  ).length;
  const activeCount = incidents.filter((i) => i.status !== "Closed").length;
  const closedToday = incidents.filter(
    (i) =>
      i.status === "Closed" &&
      new Date(i.time_report_submitted).toDateString() ===
        new Date().toDateString(),
  ).length;

  const incidentsData = [
    { month: "Mon", reported: 12, resolved: 8 },
    { month: "Tue", reported: 19, resolved: 11 },
    { month: "Wed", reported: 15, resolved: 13 },
    { month: "Thu", reported: 22, resolved: 18 },
    { month: "Fri", reported: 28, resolved: 25 },
    { month: "Sat", reported: 18, resolved: 16 },
  ];

  const severityData = [
    {
      name: "Critical",
      value: incidents.filter((i) => i.severity_level === "Critical").length,
      color: "#dc2626",
    },
    {
      name: "High",
      value: incidents.filter((i) => i.severity_level === "High").length,
      color: "#ea580c",
    },
    {
      name: "Medium",
      value: incidents.filter((i) => i.severity_level === "Medium").length,
      color: "#eab308",
    },
    {
      name: "Low",
      value: incidents.filter((i) => i.severity_level === "Low").length,
      color: "#10b981",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-50">
          Dispatcher Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Monitor incidents and response metrics in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical Incidents */}
        <Card className="hover:shadow-lg transition-shadow bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  Critical Incidents
                </p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {criticalCount}
                </p>
              </div>
              <div className="p-3 bg-red-900 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              <span className="text-red-600 font-medium">⚠ Active</span>
            </p>
          </CardContent>
        </Card>

        {/* Active Cases */}
        <Card className="hover:shadow-lg transition-shadow bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  Active Cases
                </p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {activeCount}
                </p>
              </div>
              <div className="p-3 bg-blue-900 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              <span className="text-blue-600 font-medium">
                ↑ {queueStats.inProgressCount}
              </span>{" "}
              in progress
            </p>
          </CardContent>
        </Card>

        {/* Resolved Today */}
        <Card className="hover:shadow-lg transition-shadow bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  Resolved Today
                </p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {closedToday}
                </p>
              </div>
              <div className="p-3 bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              <span className="text-green-600 font-medium">✓ Completed</span>
            </p>
          </CardContent>
        </Card>

        {/* Avg Response Time */}
        <Card className="hover:shadow-lg transition-shadow bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  Avg Response Time
                </p>
                <p className="text-2xl font-bold text-slate-50 mt-1">
                  {responseMetrics.dispatchMinutes
                    ? `${Math.round(responseMetrics.dispatchMinutes)}m`
                    : "—"}
                </p>
              </div>
              <div className="p-3 bg-purple-900 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              <span className="text-purple-600 font-medium">
                ⏱ Dispatch time
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Incidents Over Time */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Incidents Trend</CardTitle>
            <CardDescription className="text-slate-400">
              Daily reported vs resolved incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incidentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reported"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Severity Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">
              Severity Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">
              Current breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {severityData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-50">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Metrics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-50">Response Metrics</CardTitle>
          <CardDescription className="text-slate-400">
            Average time by stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Dispatch",
                value: responseMetrics.dispatchMinutes,
                color: "bg-blue-900",
              },
              {
                label: "Acceptance",
                value: responseMetrics.acceptanceMinutes,
                color: "bg-purple-900",
              },
              {
                label: "Arrival",
                value: responseMetrics.arrivalMinutes,
                color: "bg-orange-900",
              },
              {
                label: "Resolution",
                value: responseMetrics.resolutionMinutes,
                color: "bg-green-900",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className={`${metric.color} rounded-lg p-4 border border-slate-700`}
              >
                <p className="text-xs text-slate-400 font-medium">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-slate-50 mt-2">
                  {metric.value ? `${Math.round(metric.value)}m` : "—"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
