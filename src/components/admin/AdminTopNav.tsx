import { User as UserType } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Moon, Sun, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminTopNavProps {
  user: UserType | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  criticalIncidentCount?: number;
}

const AdminTopNav = ({
  user,
  onLogout,
  isDarkMode,
  onToggleTheme,
  criticalIncidentCount = 0,
}: AdminTopNavProps) => {
  return (
    <header className="bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-950 dark:text-blue-50">
              Swift Response Hub
            </h2>
            <p className="text-xs text-teal-700 dark:text-teal-300">
              Admin Control Panel
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <Input
            type="search"
            placeholder="Search incidents, users..."
            className="rounded-sm bg-blue-100 dark:bg-blue-900 border-blue-100 dark:border-blue-800 text-blue-950 dark:text-blue-50 placeholder-teal-700 dark:placeholder-teal-300 focus:bg-blue-50 dark:focus:bg-blue-800"
          />
        </div>

        {/* Right Section - Alerts & Controls */}
        <div className="flex items-center gap-3">
          {/* Alerts */}
          <Button
            variant="ghost"
            size="icon"
            className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50 hover:bg-blue-100 dark:hover:bg-blue-900 relative"
          >
            <Bell className="h-5 w-5" />
            {criticalIncidentCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50 hover:bg-blue-100 dark:hover:bg-blue-900"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User Info */}
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-blue-950 dark:text-blue-50">
                  {user.name}
                </p>
                <p className="text-xs text-teal-700 dark:text-teal-300">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-teal-700 text-white hover:bg-teal-800 rounded-full w-10 h-10"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              <DropdownMenuItem className="cursor-pointer text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-700 dark:hover:text-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminTopNav;
