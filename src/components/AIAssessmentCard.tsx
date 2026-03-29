import {
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Brain,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIAssessmentCardProps {
  severity?: "Critical" | "High" | "Medium" | "Low";
  summary?: string;
  recommendations?: string[];
  detectedInjuries?: number;
  suggestedEquipment?: string[];
  isLoading?: boolean;
  error?: string;
  compact?: boolean;
}

export function AIAssessmentCard({
  severity = "Medium",
  summary,
  recommendations = [],
  detectedInjuries,
  suggestedEquipment = [],
  isLoading = false,
  error,
  compact = false,
}: AIAssessmentCardProps) {
  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            ⚠️ AI analysis failed. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              AI is analyzing the accident details...
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-full" />
            <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded animate-pulse w-4/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "Critical":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          badge: "destructive",
          icon: "🔴",
        };
      case "High":
        return {
          bg: "bg-orange-100 dark:bg-orange-900/30",
          badge: "secondary",
          icon: "🟠",
        };
      case "Medium":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          badge: "default",
          icon: "🟡",
        };
      default:
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          badge: "outline",
          icon: "🟢",
        };
    }
  };

  const colors = getSeverityColor(severity);

  if (compact) {
    return (
      <div
        className={`rounded-lg border border-slate-200 dark:border-slate-700 ${colors.bg} p-3 space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              AI Assessment
            </p>
          </div>
          <Badge variant={colors.badge as any}>
            {colors.icon} {severity}
          </Badge>
        </div>
        {summary && (
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
            {summary}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-base text-slate-900 dark:text-slate-50">
                AI Assessment
              </CardTitle>
              <CardDescription className="text-xs">
                Generated – Requires Human Review
              </CardDescription>
            </div>
          </div>
          <Badge className={`text-white`} variant={colors.badge as any}>
            {colors.icon} {severity}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}
        {summary && (
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-1">
              Analysis
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {summary}
            </p>
          </div>
        )}

        {/* Detected Injuries */}
        {detectedInjuries !== undefined && (
          <div className="flex items-center gap-3 rounded-lg bg-white dark:bg-slate-900/50 p-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Detected Injuries
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                {detectedInjuries}{" "}
                {detectedInjuries === 1 ? "person" : "people"}
              </p>
            </div>
          </div>
        )}

        {/* Suggested Equipment */}
        {suggestedEquipment.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
              Recommended Equipment
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedEquipment.map((equipment, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-white dark:bg-slate-900/50 border-blue-200 dark:border-blue-800"
                >
                  {equipment}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
              Recommendations
            </p>
            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-500 italic">
          💡 Tip: Use this AI assessment to guide your decisions, but always
          apply human judgment.
        </p>
      </CardContent>
    </Card>
  );
}
