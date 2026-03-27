import { Badge } from "@/components/ui/badge";
import { IncidentStatus, SeverityLevel } from "@/types/incident";
import { getStatusColor, getSeverityColor } from "@/lib/incident-utils";

export function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <Badge className={`${getStatusColor(status)} text-primary-foreground border-0 font-mono text-xs tracking-wide`}>
      {status}
    </Badge>
  );
}

export function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  return (
    <Badge className={`${getSeverityColor(severity)} text-primary-foreground border-0 font-mono text-xs tracking-wide ${severity === "Critical" ? "pulse-urgent" : ""}`}>
      {severity}
    </Badge>
  );
}
