import type { IncidentReport, IncidentStatus } from "@/types/incident";

const ACTIVE_INCIDENT_STATUSES: IncidentStatus[] = [
  "reported",
  "under_investigation",
  "in_progress",
];

const RESOLVED_STATUSES: IncidentStatus[] = ["resolved", "closed"];

function getMinutesBetween(start?: string, end?: string) {
  if (!start || !end) {
    return null;
  }

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime < startTime) {
    return null;
  }

  return (endTime - startTime) / 60000;
}

function average(values: Array<number | null>) {
  const valid = values.filter((value): value is number => value !== null);
  if (valid.length === 0) {
    return null;
  }

  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function isActiveIncident(status: IncidentStatus) {
  return ACTIVE_INCIDENT_STATUSES.includes(status);
}

export function isResolvedIncident(status: IncidentStatus) {
  return RESOLVED_STATUSES.includes(status);
}

export function formatAverageMinutes(minutes: number | null) {
  if (minutes === null) {
    return "N/A";
  }

  if (minutes < 1) {
    return "<1m";
  }

  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const remainingMinutes = rounded % 60;

  if (hours === 0) {
    return `${rounded}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function getLandingStats(incidents: IncidentReport[], now = new Date()) {
  const activeIncidents = incidents.filter((incident) =>
    isActiveIncident(incident.status),
  );
  const averageResponse = average(
    incidents.map((incident) =>
      getMinutesBetween(incident.time_report_submitted, incident.resolved_time),
    ),
  );
  const todayKey = now.toDateString();
  const resolvedToday = incidents.filter((incident) => {
    if (!incident.resolved_time) {
      return false;
    }

    return new Date(incident.resolved_time).toDateString() === todayKey;
  }).length;

  return {
    activeIncidents: activeIncidents.length,
    respondersOnDuty: activeIncidents.length,
    averageResponse,
    resolvedToday,
  };
}

export function getDispatcherQueueStats(incidents: IncidentReport[]) {
  return {
    newCount: incidents.filter((incident) => incident.status === "Submitted")
      .length,
    inProgressCount: incidents.filter(
      (incident) => incident.status === "Under Review",
    ).length,
    dispatchedCount: incidents.filter(
      (incident) => incident.status === "Resolved",
    ).length,
    resolvedCount: incidents.filter((incident) => incident.status === "Closed")
      .length,
  };
}

export function getIncidentTypeBreakdown(incidents: IncidentReport[]) {
  const counts = incidents.reduce<Record<string, number>>(
    (accumulator, incident) => {
      accumulator[incident.incident_type] =
        (accumulator[incident.incident_type] ?? 0) + 1;
      return accumulator;
    },
    {},
  );

  const total = incidents.length || 1;

  return Object.entries(counts)
    .map(([type, count]) => ({
      type,
      count,
      pct: Math.round((count / total) * 100),
    }))
    .sort((left, right) => right.count - left.count);
}

export function getResponseTimeMetrics(incidents: IncidentReport[]) {
  return {
    dispatchMinutes: average(
      incidents.map((incident) =>
        getMinutesBetween(incident.time_report_submitted, incident.updated_at),
      ),
    ),
    acceptanceMinutes: null,
    arrivalMinutes: average(
      incidents.map((incident) =>
        getMinutesBetween(
          incident.time_of_incident,
          incident.time_report_submitted,
        ),
      ),
    ),
    resolutionMinutes: average(
      incidents.map((incident) =>
        getMinutesBetween(
          incident.time_report_submitted,
          incident.resolved_time,
        ),
      ),
    ),
  };
}
