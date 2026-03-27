import { describe, expect, it } from "vitest";

import { mockIncidents } from "@/data/mockIncidents";
import {
  formatAverageMinutes,
  getDispatcherQueueStats,
  getIncidentTypeBreakdown,
  getLandingStats,
  getResponseTimeMetrics,
} from "@/lib/incident-analytics";

describe("accident analytics", () => {
  it("derives landing stats from live accidents", () => {
    const stats = getLandingStats(mockIncidents, new Date("2026-03-11T12:00:00Z"));

    expect(stats.activeIncidents).toBe(4);
    expect(stats.respondersOnDuty).toBe(4);
    expect(stats.resolvedToday).toBe(2);
    expect(formatAverageMinutes(stats.averageResponse)).toBe("4h 12m");
  });

  it("derives dispatcher queue counts and timing metrics", () => {
    const queueStats = getDispatcherQueueStats(mockIncidents);
    const responseTimes = getResponseTimeMetrics(mockIncidents);
    const breakdown = getIncidentTypeBreakdown(mockIncidents);

    expect(queueStats).toEqual({
      newCount: 2,
      inProgressCount: 2,
      dispatchedCount: 1,
      resolvedCount: 1,
    });
    expect(formatAverageMinutes(responseTimes.dispatchMinutes)).toBe("1h 31m");
    expect(formatAverageMinutes(responseTimes.acceptanceMinutes)).toBe("N/A");
    expect(formatAverageMinutes(responseTimes.arrivalMinutes)).toBe("3m");
    expect(formatAverageMinutes(responseTimes.resolutionMinutes)).toBe("4h 12m");
    expect(breakdown[0]).toEqual({ type: "Road Traffic Accident", count: 1, pct: 17 });
  });
});
