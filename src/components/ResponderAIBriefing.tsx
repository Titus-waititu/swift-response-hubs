import { AlertTriangle, Zap, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SeverityBadge } from "@/components/StatusBadge";
import type { SeverityLevel } from "@/types/incident";

interface ResponderAIBriefingProps {
  severity: SeverityLevel;
  summary: string;
  detectedInjuries?: number;
  suggestedEquipment?: string[];
  sceneHazards?: string[];
  criticalNotes?: string;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * ResponderAIBriefing Component
 *
 * Displays AI-generated briefing information for responders
 * Shows: Severity, scene summary, detected injuries, equipment needed, hazards
 * Used in ResponderDashboard to provide quick intelligence before arrival
 *
 * Key features:
 * - Large, legible layout for high-stress situations
 * - Color-coded severity (Critical=red, High=orange, Medium=yellow, Low=green)
 * - Equipment check-list for pack verification
 * - Hazard warnings highlighted prominently
 * - Critical notes section for special situations
 */
export function ResponderAIBriefing({
  severity,
  summary,
  detectedInjuries = 0,
  suggestedEquipment = [],
  sceneHazards = [],
  criticalNotes,
  isLoading = false,
  error = null,
}: ResponderAIBriefingProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/80">
        <CardHeader>
          <CardTitle className="text-foreground">
            AI Briefing Loading...
          </CardTitle>
          <CardDescription>Analyzing scene data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">
            briefing unavailable
          </CardTitle>
          <CardDescription>Unable to load AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const severityColors: Record<
    SeverityLevel,
    { bg: string; border: string; badge: string }
  > = {
    Critical: {
      bg: "bg-red-50 dark:bg-red-950/20",
      border: "border-red-200 dark:border-red-800",
      badge: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100",
    },
    High: {
      bg: "bg-orange-50 dark:bg-orange-950/20",
      border: "border-orange-200 dark:border-orange-800",
      badge:
        "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100",
    },
    Medium: {
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      border: "border-yellow-200 dark:border-yellow-800",
      badge:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100",
    },
    Low: {
      bg: "bg-green-50 dark:bg-green-950/20",
      border: "border-green-200 dark:border-green-800",
      badge:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100",
    },
  };

  const colors = severityColors[severity];

  return (
    <Card className={`border-2 ${colors.border} ${colors.bg}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg text-foreground">
              AI Briefing
            </CardTitle>
            <CardDescription className="text-sm">
              Real-time scene intelligence
            </CardDescription>
          </div>
          <SeverityBadge severity={severity} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Section */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Scene Summary</p>
          <p className="text-sm leading-relaxed text-foreground/80">
            {summary}
          </p>
        </div>

        {/* Injuries Section */}
        {detectedInjuries > 0 && (
          <div className={`rounded-md p-3 ${colors.badge}`}>
            <p className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4" />
              {detectedInjuries} Injured
            </p>
            <p className="text-xs mt-1">
              {detectedInjuries === 1
                ? "Single patient requiring immediate assessment"
                : `Multiple patients (${detectedInjuries}) - triage recommended`}
            </p>
          </div>
        )}

        {/* Critical Notes - Highlighted */}
        {criticalNotes && (
          <div className="rounded-md border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 p-3">
            <p className="flex items-start gap-2 text-sm">
              <Zap className="h-4 w-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="font-semibold text-red-900 dark:text-red-100">
                {criticalNotes}
              </span>
            </p>
          </div>
        )}

        {/* Suggested Equipment */}
        {suggestedEquipment.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              Equipment Needed
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedEquipment.map((equipment, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary dark:text-primary/90"
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {equipment}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scene Hazards - Prominent Warning */}
        {sceneHazards.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              Scene Hazards
            </p>
            <div className="space-y-1">
              {sceneHazards.map((hazard, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 rounded-sm bg-red-50 dark:bg-red-950/30 p-2 text-xs text-red-900 dark:text-red-100"
                >
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400 flex-shrink-0" />
                  <span>{hazard}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="border-t border-border/30 pt-3 text-xs text-muted-foreground">
          <p>
            ⚠️ <span className="font-medium">AI-assisted intelligence</span> —
            Cross-reference with dispatch and follow scene safety protocols
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
