import { User as UserType } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Settings, User, Moon, Sun, Bell } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useState } from "react";

interface AdminTopNavProps {
  user: UserType | null;
  profileImage?: string | null;
  onLogout: () => Promise<void>;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  criticalIncidentCount?: number;
}

const AdminTopNav = ({
  user,
  profileImage,
  onLogout,
  isDarkMode,
  onToggleTheme,
  criticalIncidentCount = 0,
}: AdminTopNavProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await onLogout();
    setIsLoggingOut(false);
  };

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
};

export default AdminTopNav;
