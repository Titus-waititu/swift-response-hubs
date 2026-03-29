import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Radio,
  MapPin,
  Flag,
} from "lucide-react";

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  timestamp?: Date | string;
  status: "completed" | "current" | "pending";
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  layout?: "vertical" | "horizontal";
  size?: "sm" | "md" | "lg";
}

const getDefaultIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("submitted")) return <Clock className="h-5 w-5" />;
  if (lower.includes("review") || lower.includes("reviewing"))
    return <AlertCircle className="h-5 w-5" />;
  if (lower.includes("dispatch")) return <Radio className="h-5 w-5" />;
  if (lower.includes("route") || lower.includes("en route"))
    return <MapPin className="h-5 w-5" />;
  if (lower.includes("scene") || lower.includes("on scene"))
    return <Flag className="h-5 w-5" />;
  if (lower.includes("complete") || lower.includes("resolved"))
    return <CheckCircle className="h-5 w-5" />;
  return <Clock className="h-5 w-5" />;
};

const getDefaultColor = (status: "completed" | "current" | "pending") => {
  switch (status) {
    case "completed":
      return "bg-green-500 text-white";
    case "current":
      return "bg-teal-500 text-white ring-4 ring-teal-200 dark:ring-teal-900";
    case "pending":
      return "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300";
  }
};

export default function Timeline({
  steps,
  layout = "vertical",
  size = "md",
}: TimelineProps) {
  const sizeClasses = {
    sm: {
      dot: "h-6 w-6",
      line: "w-1",
      text: "text-xs",
    },
    md: {
      dot: "h-8 w-8",
      line: "w-1.5",
      text: "text-sm",
    },
    lg: {
      dot: "h-10 w-10",
      line: "w-2",
      text: "text-base",
    },
  };

  const styles = sizeClasses[size];

  if (layout === "horizontal") {
    return (
      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`${styles.dot} rounded-full flex items-center justify-center transition-all ${
                  step.color || getDefaultColor(step.status)
                }`}
              >
                {step.icon || getDefaultIcon(step.title)}
              </div>
              <div className={`mt-2 text-center ${styles.text}`}>
                <p className="font-semibold text-slate-900 dark:text-slate-50">
                  {step.title}
                </p>
                {step.timestamp && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-12 ${
                  steps[index + 1].status === "pending"
                    ? "bg-slate-300 dark:bg-slate-600"
                    : "bg-green-500"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Vertical layout
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          {/* Timeline dot and line */}
          <div className="flex flex-col items-center">
            <div
              className={`${styles.dot} rounded-full flex items-center justify-center transition-all ${step.color || getDefaultColor(step.status)}`}
            >
              {step.icon || getDefaultIcon(step.title)}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-1 ${styles.line} flex-1 min-h-12 ${
                  step.status === "completed"
                    ? "bg-green-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className={`font-semibold text-slate-900 dark:text-slate-50 ${styles.text}`}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    className={`text-slate-600 dark:text-slate-400 mt-1 ${styles.text}`}
                  >
                    {step.description}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  step.status === "completed"
                    ? "default"
                    : step.status === "current"
                      ? "secondary"
                      : "outline"
                }
                className={`flex-shrink-0 ${
                  step.status === "current" ? "animate-pulse" : ""
                }`}
              >
                {step.status}
              </Badge>
            </div>
            {step.timestamp && (
              <p
                className={`text-slate-500 dark:text-slate-400 mt-2 ${styles.text}`}
              >
                {new Date(step.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
