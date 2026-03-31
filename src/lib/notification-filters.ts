import type { UserRole, IncidentReport } from "@/types/incident";

export interface Notification {
  id: string;
  userId?: string;
  incidentId?: string;
  reportId?: string;
  message: string;
  title?: string;
  type?:
    | "alert"
    | "info"
    | "warning"
    | "success"
    | "status_update"
    | "dispatch_instruction"
    | "responder_assignment"
    | "accident_assigned"
    | "accident_reported"
    | "emergency_alert"
    | "system_notification";
  priority?: "low" | "medium" | "high" | "critical";
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Filters notifications based on user role and ownership
 * - Public Reporters: Only see notifications about their own accidents
 * - Dispatchers: Only see notifications about incidents they manage (not internal responder notifications)
 * - Responders: Only see notifications about incidents they're assigned to (not internal dispatcher coordination)
 * - Admins: See all notifications
 */
export const filterNotificationsByRole = (
  notifications: Notification[],
  userRole?: string,
  userId?: string,
  userIncidents?: IncidentReport[],
): Notification[] => {
  if (!notifications || notifications.length === 0) return [];

  return notifications.filter((notification) => {
    // Admins see everything
    if (userRole === "Super Admin") {
      return true;
    }

    // Public Reporters: Only see notifications about their own reported incidents
    if (
      userRole === "Public Reporter" ||
      userRole === "REPORTER" ||
      !userRole
    ) {
      // Filter by user ID match or report ID belonging to user
      const isOwnIncident =
        notification.userId === userId ||
        (userIncidents?.some(
          (incident) =>
            incident.report_id === notification.reportId ||
            incident.report_id === notification.incidentId ||
            incident.backend_accident_id === notification.incidentId,
        ) ??
          false);

      // Exclude internal dispatcher/responder notifications
      const isInternalMessage =
        notification.message?.includes("dispatch_instruction") ||
        notification.message?.includes("responder_assignment") ||
        notification.message?.includes("Dispatch accepted") ||
        notification.message?.includes("Dispatch rejected") ||
        notification.message?.includes("responder") ||
        notification.type === "dispatch_instruction" ||
        notification.type === "responder_assignment";

      return isOwnIncident && !isInternalMessage;
    }

    // Dispatchers: See notifications about incidents they manage
    // But NOT internal responder coordination messages
    if (userRole === "Dispatcher" || userRole === "DISPATCHER") {
      // Exclude pure responder-to-responder or responder status updates
      const isResponderInternalMessage =
        notification.message?.includes("responder assignment") ||
        notification.message?.includes("Responder") ||
        notification.message?.includes("assigned to an incident at Location") ||
        notification.type === "responder_assignment";

      // Include if it's about incident management but exclude internal responder chatter
      const isRelevant =
        notification.type === "accident_reported" ||
        notification.type === "emergency_alert" ||
        notification.type === "dispatch_instruction" ||
        notification.type === "responder_assignment" ||
        notification.type === "system_notification";

      return isRelevant && !isResponderInternalMessage;
    }

    // Responders: See notifications about their assigned incidents
    // But NOT dispatcher internal coordination messages with other dispatchers
    if (userRole === "Responder" || userRole === "RESPONDER") {
      // Show responder assignment and incident updates
      const isResponderRelevant =
        notification.type === "responder_assignment" ||
        notification.type === "accident_assigned" ||
        notification.type === "status_update" ||
        notification.type === "alert" ||
        notification.type === "critical" ||
        notification.type === "emergency_alert";

      // Exclude dispatcher internal discussions
      const isDispatcherInternalMessage =
        notification.message?.includes("dispatcher only") ||
        notification.message?.includes("Dispatcher") ||
        notification.message?.includes(
          "dispatch_instruction and you are not the assignee",
        ) ||
        (notification.type === "dispatch_instruction" &&
          notification.userId !== userId);

      return isResponderRelevant && !isDispatcherInternalMessage;
    }

    // Default: show nothing for unknown roles
    return false;
  });
};

/**
 * Filters notifications by category/type with role awareness
 */
export const filterNotificationsByType = (
  notifications: Notification[],
  types: Notification["type"][],
): Notification[] => {
  return notifications.filter((n) => types.includes(n.type));
};

/**
 * Filters unread notifications with role-based filtering
 */
export const getUnreadNotifications = (
  notifications: Notification[],
  userRole?: string,
  userId?: string,
  userIncidents?: IncidentReport[],
): Notification[] => {
  const filtered = filterNotificationsByRole(
    notifications,
    userRole,
    userId,
    userIncidents,
  );
  return filtered.filter((n) => !n.isRead);
};

/**
 * Groups notifications by incident for easier UI rendering
 */
export const groupNotificationsByIncident = (
  notifications: Notification[],
): Map<string, Notification[]> => {
  const grouped = new Map<string, Notification[]>();

  notifications.forEach((notification) => {
    const key = notification.incidentId || notification.reportId || "unknown";
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(notification);
  });

  return grouped;
};
