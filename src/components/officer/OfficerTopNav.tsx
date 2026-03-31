import { Search, Bell, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileDropdown from "@/components/ProfileDropdown";
import { User as UserType } from "@/stores/authStore";
import { useState } from "react";

interface OfficerTopNavProps {
  user: UserType | null;
  profileImage?: string | null;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => Promise<void>;
  criticalIncidentCount: number;
}

export default function OfficerTopNav({
  user,
  profileImage,
  isDarkMode,
  onToggleTheme,
  onLogout,
  criticalIncidentCount,
}: OfficerTopNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await onLogout();
    setIsLoggingOut(false);
  };

  return (
    <header className="bg-blue-50 dark:bg-blue-950 border-b border-blue-100 dark:border-blue-900 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700 dark:text-teal-300" />
            <Input
              placeholder="Search incidents..."
              className="bg-blue-100 dark:bg-blue-900 border-blue-100 dark:border-blue-800 text-blue-950 dark:text-blue-50 placeholder-teal-700 pl-9"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Alerts */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-teal-700 dark:text-teal-300 hover:text-teal-950 dark:hover:text-teal-50"
            >
              <Bell className="h-5 w-5" />
              {criticalIncidentCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Button>
          </div>

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

          {/* Profile Dropdown */}
          <ProfileDropdown
            user={user}
            profileImage={profileImage}
            onLogout={handleLogout}
            isLoading={isLoggingOut}
          />
        </div>
      </div>
    </header>
  );
}
