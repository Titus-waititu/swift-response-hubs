import {
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  AlertCircle,
  Users,
  Ambulance,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";

interface DispatcherSidebarProps {
  currentPage: "dashboard" | "queue" | "responders" | "services" | "settings";
  onPageChange: (
    page: "dashboard" | "queue" | "responders" | "services" | "settings",
  ) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
}

export default function DispatcherSidebar({
  currentPage,
  onPageChange,
  sidebarOpen,
  onToggleSidebar,
  userName,
}: DispatcherSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "queue", label: "Incidents Queue", icon: AlertCircle },
    { id: "responders", label: "Responders", icon: Users },
    { id: "services", label: "Emergency Services", icon: Ambulance },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-blue-50 dark:bg-blue-950 border-r border-blue-100 dark:border-blue-900 transition-all duration-300 flex flex-col z-10 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-blue-100 dark:border-blue-900 flex items-center justify-between">
        {sidebarOpen && (
          <h2 className="font-bold text-blue-950 dark:text-blue-50">
            Dispatch
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-teal-700 dark:text-teal-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-teal-700 text-white hover:bg-teal-800"
                  : "text-teal-800 dark:text-teal-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-teal-950 dark:hover:text-teal-50"
              }`}
              onClick={() => onPageChange(item.id as any)}
            >
              <Icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User Info */}
      {sidebarOpen && (
        <div className="p-4 border-t border-blue-100 dark:border-blue-900 bg-blue-100 dark:bg-blue-900/30">
          <p className="text-xs text-teal-700 dark:text-teal-300">
            LOGGED IN AS
          </p>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate mt-1">
            {userName}
          </p>
        </div>
      )}
    </aside>
  );
}
