import { LogOut, Search, User, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import NotificationsDropdown from "../NotificationsDropdown";
import ProfileDropdown from "../ProfileDropdown";
import { User as UserType } from "@/stores/authStore";
import { useState } from "react";

interface DispatcherTopNavProps {
  user: UserType | null;
  profileImage?: string | null;
  onLogout: () => Promise<void>;
  criticalIncidentCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function DispatcherTopNav({
  user,
  profileImage,
  onLogout,
  criticalIncidentCount,
  isDarkMode,
  onToggleTheme,
}: DispatcherTopNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await onLogout();
    setIsLoggingOut(false);
  };

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
