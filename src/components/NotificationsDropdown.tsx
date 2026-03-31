import { Bell, AlertCircle, Info, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  useGetUnreadNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/useNotifications";
import { useAuthStore } from "@/stores/authStore";
import { useCallback } from "react";
import { toast } from "sonner";

export default function NotificationsDropdown() {
  const { data: unreadNotifications = [] } = useGetUnreadNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const { user } = useAuthStore();

  // Ensure we always have an array
  const notificationsArray = Array.isArray(unreadNotifications)
    ? unreadNotifications
    : unreadNotifications && Array.isArray(unreadNotifications)
      ? unreadNotifications
      : [];

  // Notifications are already filtered by role in the hook
  const filteredNotifications = notificationsArray;

  const unreadCount = filteredNotifications.length;

  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      markAsReadMutation.mutate(notificationId, {
        onError: (error: any) => {
          toast.error("Failed to mark notification as read");
        },
      });
    },
    [markAsReadMutation],
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
      case "critical":
      case "emergency_alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "status_update":
      case "dispatch_instruction":
      case "responder_assignment":
      case "accident_assigned":
        return <Info className="h-4 w-4 text-teal-500" />;
      case "accident_reported":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "system_notification":
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "alert":
      case "critical":
      case "emergency_alert":
        return "bg-red-50 dark:bg-red-950/30";
      case "success":
        return "bg-green-50 dark:bg-green-950/30";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30";
      case "status_update":
      case "dispatch_instruction":
      case "responder_assignment":
      case "accident_assigned":
        return "bg-teal-50 dark:bg-teal-950/30";
      case "accident_reported":
        return "bg-blue-50 dark:bg-blue-950/30";
      case "system_notification":
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-950/30";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50 hover:bg-blue-100 dark:hover:bg-blue-900 relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-0"
      >
        {/* Header */}
        <div className="sticky top-0 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Notifications
          </h2>
          {unreadCount > 0 && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {unreadCount} unread
            </p>
          )}
        </div>

        {/* Notifications List */}
        {unreadCount > 0 ? (
          <div className="space-y-2 p-2">
            {filteredNotifications.map((notification: any) => (
              <div
                key={notification.id}
                className={`rounded-lg p-3 space-y-1 flex items-start gap-3 transition-all ${getNotificationBg(
                  notification.type,
                )}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50 line-clamp-2">
                    {notification.message}
                  </p>
                  {notification.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                      {notification.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  title="Mark as read"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No new notifications
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
