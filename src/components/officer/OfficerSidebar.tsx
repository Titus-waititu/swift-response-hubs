import {
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  AlertCircle,
  Wand2,
  Users,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfficerSidebarProps {
  currentPage: "dashboard" | "accidents" | "ai-assistant" | "users" | "profile";
  onPageChange: (
    page: "dashboard" | "accidents" | "ai-assistant" | "users" | "profile",
  ) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
}

export default function OfficerSidebar({
  currentPage,
  onPageChange,
  sidebarOpen,
  onToggleSidebar,
  userName,
}: OfficerSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "accidents", label: "Manage Accidents", icon: AlertCircle },
    { id: "ai-assistant", label: "AI Investigation", icon: Wand2 },
    { id: "users", label: "Users Profile", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside
      className={`flex flex-col bg-blue-50 dark:bg-blue-950 border-r border-blue-100 dark:border-blue-900 transition-all duration-300 z-10 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-100 dark:border-blue-900">
        {sidebarOpen && (
          <span className="font-bold text-blue-950 dark:text-blue-50">
            SARS
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-8 w-8 text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() =>
              onPageChange(
                id as
                  | "dashboard"
                  | "accidents"
                  | "ai-assistant"
                  | "users"
                  | "profile",
              )
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              currentPage === id
                ? "bg-teal-700 text-white"
                : "text-teal-800 dark:text-teal-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-teal-950 dark:hover:text-teal-50"
            }`}
            title={label}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">{label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* User Info */}
      {sidebarOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-600 dark:text-slate-500">
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
