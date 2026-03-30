import type { IncidentStatus } from "@/types/incident";
import { STATUS_FLOW } from "@/types/incident";
import {
  FileText,
  AlertCircle,
  MapPin,
  Truck,
  CheckCircle2,
  Lock,
} from "lucide-react";

export interface StatusStep {
  id: IncidentStatus;
  label: string;
  icon: any;
  description: string;
  color: string;
  bgColor: string;
}

// Map backend status values to display information
export const STATUS_STEPS: StatusStep[] = [
  {
    id: "reported",
    label: "Reported",
    icon: FileText,
    description: "Report received",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "under_investigation",
    label: "Under Investigation",
    icon: AlertCircle,
    description: "Being assessed",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "in_progress",
    label: "In Progress",
    icon: Truck,
    description: "En route/responding",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    id: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    description: "Handled",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "closed",
    label: "Closed",
    icon: Lock,
    description: "Complete",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-900/30",
  },
];

/**
 * Get the index of a status in the workflow
 */
export const getStatusIndex = (status: IncidentStatus | string): number => {
  return STATUS_STEPS.findIndex((step) => step.id === status);
};

/**
 * Get display label for a status
 */
export const getStatusLabel = (status: IncidentStatus | string): string => {
  const step = STATUS_STEPS.find((s) => s.id === status);
  return step?.label || status;
};

/**
 * Get color classes for a status badge
 */
export const getStatusColor = (status: IncidentStatus | string): string => {
  const step = STATUS_STEPS.find((s) => s.id === status);
  return step?.bgColor || "bg-slate-100 dark:bg-slate-900/30";
};

/**
 * Get text color for a status
 */
export const getStatusTextColor = (status: IncidentStatus | string): string => {
  const step = STATUS_STEPS.find((s) => s.id === status);
  return step?.color || "text-slate-600 dark:text-slate-400";
};

/**
 * Check if a status is in a completed state
 */
export const isStatusCompleted = (status: IncidentStatus | string): boolean => {
  return status === "resolved" || status === "closed";
};

/**
 * Get the next possible statuses in the workflow
 */
export const getNextStatuses = (
  currentStatus: IncidentStatus | string,
): IncidentStatus[] => {
  const currentIndex = getStatusIndex(currentStatus);
  if (currentIndex === -1) return [];

  // Return all statuses after current in the flow
  return STATUS_FLOW.slice(currentIndex + 1) as IncidentStatus[];
};

/**
 * Check if a status transition is valid
 */
export const isValidStatusTransition = (
  from: IncidentStatus | string,
  to: IncidentStatus | string,
): boolean => {
  const fromIndex = getStatusIndex(from);
  const toIndex = getStatusIndex(to);

  if (fromIndex === -1 || toIndex === -1) return false;

  // Can transition to same or forward in the flow
  return toIndex >= fromIndex;
};
