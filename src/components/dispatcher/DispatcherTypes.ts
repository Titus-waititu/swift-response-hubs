import type { LucideIcon } from "lucide-react";

import type { IncidentReport, IncidentStatus, SeverityLevel } from "@/types/incident";

export interface DispatcherSession {
  userId: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface DispatcherMetric {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  iconColor: string;
}

export interface DispatcherSignal {
  label: string;
  value: string;
}

export interface DispatcherFocusItem {
  title: string;
  value: string;
  helper: string;
}

export interface DispatcherTimingItem {
  label: string;
  value: string;
}

export type DispatcherSeverityRail = Record<SeverityLevel, string>;

export type DispatcherStatusOptions = IncidentStatus[];
