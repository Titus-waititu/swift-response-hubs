import { Check, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IncidentReport } from "@/types/incident";

interface StatusTimelineProps {
  incident: IncidentReport;
}

const STATUS_STEPS = [
  { status: "Accepted", label: "Accepted", icon: "🎯" },
  { status: "En Route", label: "En Route", icon: "🚗" },
  { status: "On Scene", label: "On Scene", icon: "📍" },
  { status: "Completed", label: "Completed", icon: "✓" },
];

const getStepIndex = (status: string) => {
  return STATUS_STEPS.findIndex((step) => step.status === status);
};

const isStepCompleted = (stepIndex: number, currentIndex: number) => {
  return stepIndex < currentIndex;
};

const isStepActive = (stepIndex: number, currentIndex: number) => {
  return stepIndex === currentIndex;
};

export default function StatusTimeline({ incident }: StatusTimelineProps) {
  const currentIndex = getStepIndex(incident.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = isStepCompleted(index, currentIndex);
            const isActive = isStepActive(index, currentIndex);
            const isPending = index > currentIndex;

            return (
              <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                {/* Timeline Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : isActive
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm">{step.icon}</span>
                    )}
                  </div>
                  {index < STATUS_STEPS.length - 1 && (
                    <div
                      className={`w-1 h-12 mt-2 ${
                        isCompleted || isActive
                          ? "bg-green-300 dark:bg-green-700"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>

                {/* Timeline Content */}
                <div className="flex-1 pt-1">
                  <h4
                    className={`font-semibold text-sm ${
                      isCompleted
                        ? "text-foreground"
                        : isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isCompleted
                      ? "Completed"
                      : isActive
                        ? "In Progress"
                        : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
