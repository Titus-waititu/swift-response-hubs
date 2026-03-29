import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  Ambulance,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminPage = "dashboard" | "incidents" | "users" | "services" | "settings";

interface AdminSidebarProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar = ({
  currentPage,
  onNavigate,
  isOpen,
  onToggle,
}: AdminSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "incidents",
      label: "Incidents",
      icon: AlertCircle,
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
    },
    {
      id: "services",
      label: "Emergency Services",
      icon: Ambulance,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-50 transition-all duration-300 flex flex-col border-r border-blue-100 dark:border-blue-900 z-10",
          isOpen ? "w-64" : "w-20",
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-blue-100 dark:border-blue-900 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-700 rounded-sm flex items-center justify-center font-bold text-white">
                A
              </div>
              <h1 className="text-sm font-bold whitespace-nowrap text-blue-950 dark:text-blue-50">
                Admin
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-100 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as AdminPage)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium",
                  isActive
                    ? "bg-teal-700 text-white"
                    : "text-teal-800 dark:text-teal-200 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-teal-950 dark:hover:text-teal-50",
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        {isOpen && (
          <div className="p-4 border-t border-blue-100 dark:border-blue-900 text-xs text-teal-700 dark:text-teal-300 bg-blue-100 dark:bg-blue-900/30">
            <p>Admin Dashboard v1.0</p>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default AdminSidebar;
