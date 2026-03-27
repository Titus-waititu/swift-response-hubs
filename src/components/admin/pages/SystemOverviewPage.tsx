import {
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  Zap,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type {
  SystemStats,
  DispatchStats,
  UserStats,
  AnalyticsDataPoint,
} from "@/types/api-responses";

// Mock data - replace with actual API calls
const mockChartData = [
  { time: "00:00", incidents: 2, resolved: 1 },
  { time: "04:00", incidents: 5, resolved: 3 },
  { time: "08:00", incidents: 12, resolved: 9 },
  { time: "12:00", incidents: 18, resolved: 15 },
  { time: "16:00", incidents: 14, resolved: 12 },
  { time: "20:00", incidents: 8, resolved: 6 },
];

interface SystemOverviewPageProps {
  systemStats?: SystemStats;
  dispatchStats?: DispatchStats;
  userStats?: UserStats;
}

export default function SystemOverviewPage({
  systemStats,
  dispatchStats,
  userStats,
}: SystemOverviewPageProps) {
  // Default mock data if not provided
  const stats: SystemStats = systemStats || {
    totalUsers: 1247,
    activeUsers: 542,
    totalAccidents: 3481,
    resolvedAccidents: 3268,
    averageResponseTime: 8.5,
    criticalIncidentsToday: 3,
    systemHealth: "healthy",
    uptime: 99.98,
  };

  const dispStats: DispatchStats = dispatchStats || {
    activeDispatches: 7,
    pendingDispatches: 12,
    completedDispatchesToday: 43,
    averageDispatchTime: 6.2,
    responseTimeByType: {
      ambulance: 7.1,
      police: 5.8,
      fire: 6.5,
    },
  };

  const uStats: UserStats = userStats || {
    totalUsers: 1247,
    activeUsers: 542,
    inactiveUsers: 705,
    usersByRole: {
      ADMIN: 5,
      OFFICER: 84,
      RESPONDER: 132,
      USER: 1026,
    },
    newUsersThisMonth: 127,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          System Overview
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Real-time platform metrics and health status
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Users */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {stats.activeUsers}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  of {stats.totalUsers} total
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Incidents */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Critical Today
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {stats.criticalIncidentsToday}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Requires immediate attention
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Avg Response
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {stats.averageResponseTime.toFixed(1)}m
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Average dispatch time
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  System Health
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                  {stats.uptime.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {stats.systemHealth === "healthy" &&
                    "✓ All systems operational"}
                  {stats.systemHealth === "degraded" &&
                    "⚠ Some services degraded"}
                  {stats.systemHealth === "critical" && "✗ Critical issues"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents Over Time */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Incidents & Resolution Trend
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  stroke="currentColor"
                  style={{ color: "var(--slate-600)" }}
                />
                <YAxis
                  stroke="currentColor"
                  style={{ color: "var(--slate-600)" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Reported"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dispatch by Type */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Dispatch Status
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Current queue breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Active Dispatches
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {dispStats.activeDispatches}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Pending Dispatches
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {dispStats.pendingDispatches}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Completed Today
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {dispStats.completedDispatchesToday}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Avg Dispatch Time:{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-50">
                    {dispStats.averageDispatchTime.toFixed(1)} min
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Demographics */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            User Demographics
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Platform user breakdown by role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {uStats.usersByRole.ADMIN}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Admins
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {uStats.usersByRole.OFFICER}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Officers
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {uStats.usersByRole.RESPONDER}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Responders
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {uStats.usersByRole.USER}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Users
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
