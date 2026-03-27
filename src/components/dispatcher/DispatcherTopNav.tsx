import { Bell, LogOut, Search, User, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DispatcherTopNavProps {
  userName: string;
  onLogout: () => void;
  criticalIncidentCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function DispatcherTopNav({
  userName,
  onLogout,
  criticalIncidentCount,
  isDarkMode,
  onToggleTheme,
}: DispatcherTopNavProps) {
  return (
    <header className="bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-teal-700 dark:text-teal-300" />
            <Input
              placeholder="Search incidents..."
              className="pl-10 rounded-lg bg-blue-100 dark:bg-blue-900 border-blue-100 dark:border-blue-800 text-blue-950 dark:text-blue-50 placeholder-teal-700 dark:placeholder-teal-300 focus:bg-blue-50 dark:focus:bg-blue-800"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Alerts */}
          <Button
            variant="ghost"
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

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50 hover:bg-blue-100 dark:hover:bg-blue-900 gap-2"
              >
                <User className="h-4 w-4" />
                <p className="text-sm">{userName}</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <DropdownMenuItem className="text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
              <DropdownMenuItem
                onClick={onLogout}
                className="text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
