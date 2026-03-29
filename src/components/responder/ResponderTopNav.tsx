import { Search, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResponderTopNavProps {
  userName: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function ResponderTopNav({
  userName,
  isDarkMode,
  onToggleTheme,
  onLogout,
}: ResponderTopNavProps) {
  return (
    <header className="bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700 dark:text-teal-300" />
            <Input
              placeholder="Search assignments..."
              className="bg-blue-100 dark:bg-blue-900 border-blue-100 dark:border-blue-800 text-blue-950 dark:text-blue-50 placeholder-teal-700 pl-9"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationsDropdown />

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
                size="icon"
                className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                Logged in as
              </div>
              <div className="px-2 py-1 text-sm text-slate-900 dark:text-slate-50 font-medium mb-2">
                {userName}
              </div>
              <DropdownMenuItem
                onClick={onLogout}
                className="gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
