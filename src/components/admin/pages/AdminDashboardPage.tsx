import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle, Users, BarChart3, Radio, TrendingUp } from "lucide-react";
import {
  MetricCard,
  DashboardSection,
  PageHeader,
  StatsGrid,
  ChartContainer,
  ActivityList,
} from "@/components/premium/DashboardComponents";

// Mock data for charts
const incidentsData = [
  { month: "Jan", incidents: 45, resolved: 35 },
  { month: "Feb", incidents: 52, resolved: 42 },
  { month: "Mar", incidents: 48, resolved: 38 },
  { month: "Apr", incidents: 61, resolved: 50 },
  { month: "May", incidents: 55, resolved: 45 },
  { month: "Jun", incidents: 67, resolved: 58 },
];

const severityData = [
  { name: "Critical", value: 24 },
  { name: "High", value: 38 },
  { name: "Medium", value: 52 },
  { name: "Low", value: 86 },
];

const incidentTypesData = [
  { name: "Road Accident", value: 62 },
  { name: "Fire", value: 28 },
  { name: "Medical", value: 45 },
  { name: "Industrial", value: 19 },
  { name: "Other", value: 46 },
];

const SEVERITY_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalIncidents: 200,
    activeIncidents: 12,
    resolvedToday: 8,
    totalUsers: 34,
    onlineUsers: 18,
  });

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setStats({
        totalIncidents: 200,
        activeIncidents: 12,
        resolvedToday: 8,
        totalUsers: 34,
        onlineUsers: Math.floor(Math.random() * 18 + 10),
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const activities = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      title: "Critical accident reported",
      description: "Road traffic accident on Highway 5",
      status: "in-progress" as const,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      title: "Incident resolved",
      description: "Medical emergency case #2024-0451",
      status: "completed" as const,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      title: "New responder assigned",
      description: "Officer John Doe assigned to case #2024-0452",
      status: "pending" as const,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        title="System Dashboard"
        description="System-wide overview and analytics"
      />

      {/* Primary Metrics */}
      <DashboardSection>
        <StatsGrid columns={5}>
          <MetricCard
            label="Total Incidents"
            value={stats.totalIncidents}
            icon={AlertCircle}
            trend={{
              direction: "up",
              value: "+12% from last month",
              color: "neutral",
            }}
          />
          <MetricCard
            label="Active Incidents"
            value={stats.activeIncidents}
            icon={BarChart3}
            trend={{
              direction: "up",
              value: "+3 since yesterday",
              color: stats.activeIncidents > 10 ? "negative" : "neutral",
            }}
          />
          <MetricCard
            label="Resolved Today"
            value={stats.resolvedToday}
            icon={TrendingUp}
            trend={{
              direction: "up",
              value: "+5% efficiency",
              color: "positive",
            }}
          />
          <MetricCard
            label="Total Users"
            value={stats.totalUsers}
            icon={Users}
            trend={{
              direction: "up",
              value: "+2 this week",
              color: "positive",
            }}
          />
          <MetricCard
            label="Online Now"
            value={stats.onlineUsers}
            icon={Radio}
            trend={{
              direction: "up",
              value: `${Math.round((stats.onlineUsers / stats.totalUsers) * 100)}% active`,
              color: "positive",
            }}
          />
        </StatsGrid>
      </DashboardSection>

      {/* Charts Section - Full width trend chart */}
      <ChartContainer
        title="Monthly Trend"
        description="Reported vs resolved incidents over time"
        height="h-96"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={incidentsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-slate-700"
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              className="dark:bg-slate-900 dark:border-slate-700"
              labelStyle={{ color: "#1e293b" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="incidents"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Reported"
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Resolved"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Two-column analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution - Enhanced */}
        <ChartContainer
          title="Severity Breakdown"
          description="Current incident severity distribution"
          height="h-full"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]}
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
                    className="dark:bg-slate-900 dark:border-slate-700"
                    labelStyle={{ color: "#1e293b" }}
                    formatter={(value) => {
                      const total = severityData.reduce(
                        (sum, item) => sum + item.value,
                        0,
                      );
                      const percentage = ((value / total) * 100).toFixed(1);
                      return [`${value} incidents (${percentage}%)`, "Count"];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Enhanced Legend */}
            <div className="mt-6 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
              {severityData.map((item, index) => {
                const total = severityData.reduce((sum, i) => sum + i.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="h-4 w-4 rounded-md flex-shrink-0"
                        style={{
                          backgroundColor:
                            SEVERITY_COLORS[index % SEVERITY_COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartContainer>

        {/* Incidents by Type */}
        <ChartContainer
          title="Incidents by Type"
          description="Distribution across incident categories"
          height="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incidentTypesData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-slate-700"
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="dark:bg-slate-900 dark:border-slate-700"
                labelStyle={{ color: "#1e293b" }}
              />
              <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Recent Activity */}
      <DashboardSection
        title="Recent Activity"
        description="Latest system events and updates"
      >
        <ActivityList items={activities} />
      </DashboardSection>
    </div>
  );
};

export default AdminDashboardPage;
