import { IncidentStatus, SeverityLevel } from "@/types/incident";

export function getStatusColor(status: IncidentStatus): string {
  const map: Record<IncidentStatus, string> = {
    "Submitted": "bg-status-submitted",
    "Under Review": "bg-status-review",
    "Resolved": "bg-status-resolved",
    "Closed": "bg-status-closed",
  };
  return map[status] || "bg-muted";
}

export function getStatusTextColor(status: IncidentStatus): string {
  return "text-primary-foreground";
}

export function getSeverityColor(severity: SeverityLevel): string {
  const map: Record<SeverityLevel, string> = {
    "Critical": "bg-severity-critical",
    "High": "bg-severity-high",
    "Medium": "bg-severity-medium",
    "Low": "bg-severity-low",
  };
  return map[severity] || "bg-muted";
}

export function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function generateReportId(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
  return `INC-${year}-${num}`;
}
