import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import type { IncidentReport } from "@/types/incident";

interface ResponderStatusStatsProps {
  incidents: IncidentReport[];
}

export default function ResponderStatusStats({
  incidents,
}: ResponderStatusStatsProps) {
  const stats = useMemo(() => {
    const total = incidents.length;
    const responding = incidents.filter(
      (i) => i.status === "reported" || i.status === "under_investigation",
    ).length;
    const onScene = incidents.filter((i) => i.status === "in_progress").length;
    const completed = incidents.filter((i) => i.status === "closed").length;
    const critical = incidents.filter(
      (i) => i.severity_level === "Critical",
    ).length;

    const respondingPercent = total > 0 ? (responding / total) * 100 : 0;
    const onScenePercent = total > 0 ? (onScene / total) * 100 : 0;
    const completedPercent = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      responding,
      onScene,
      completed,
      critical,
      respondingPercent,
      onScenePercent,
      completedPercent,
      responseRate: total > 0 ? ((responding + onScene) / total) * 100 : 0,
    };
  }, [incidents]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Assignments */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Total Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {stats.total}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
            Active incidents assigned
          </p>
        </CardContent>
      </Card>

      {/* Responding */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Responding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
            {stats.responding}
          </div>
          <div className="mt-2 w-full bg-yellow-200 dark:bg-yellow-900/50 rounded-full h-2">
            <div
              className="bg-yellow-600 dark:bg-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.respondingPercent}%` }}
            />
          </div>
          <p className="text-xs text-yellow-700 dark:text-yellow-200 mt-1">
            {stats.respondingPercent.toFixed(0)}% of total
          </p>
        </CardContent>
      </Card>

      {/* On Scene */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            On Scene
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {stats.onScene}
          </div>
          <div className="mt-2 w-full bg-orange-200 dark:bg-orange-900/50 rounded-full h-2">
            <div
              className="bg-orange-600 dark:bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.onScenePercent}%` }}
            />
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-200 mt-1">
            {stats.onScenePercent.toFixed(0)}% of total
          </p>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
            {stats.completed}
          </div>
          <div className="mt-2 w-full bg-green-200 dark:bg-green-900/50 rounded-full h-2">
            <div
              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${stats.completedPercent}%` }}
            />
          </div>
          <p className="text-xs text-green-700 dark:text-green-200 mt-1">
            {stats.completedPercent.toFixed(0)}% resolved
          </p>
        </CardContent>
      </Card>

      {/* Critical */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Critical
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900 dark:text-red-100">
            {stats.critical}
          </div>
          <p className="text-xs text-red-700 dark:text-red-200 mt-1">
            High-priority incidents
          </p>
        </CardContent>
      </Card>

      {/* Response Rate */}
      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-teal-900 dark:text-teal-100 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Response Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-teal-900 dark:text-teal-100">
            {stats.responseRate.toFixed(0)}%
          </div>
          <p className="text-xs text-teal-700 dark:text-teal-200 mt-1">
            of incidents being handled
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
