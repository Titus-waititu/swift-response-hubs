import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { User as UserType } from "@/stores/authStore";
import { LogOut, User, Settings, LayoutDashboard, Loader2 } from "lucide-react";

interface ProfileDropdownProps {
  user: UserType | null;
  profileImage?: string | null;
  onLogout: () => Promise<void>;
  isLoading?: boolean;
}

export default function ProfileDropdown({
  user,
  profileImage,
  onLogout,
  isLoading = false,
}: ProfileDropdownProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    const role = user?.role?.toLowerCase();
    return `/dashboard/${role}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 p-0 hover:bg-secondary/50"
          title={`${user?.name} (${user?.role})`}
          disabled={isLoading}
        >
          <UserAvatar user={user} profileImage={profileImage} size="md" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-border">
          <p className="font-semibold text-sm text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-1">
            {user?.role}
          </p>
        </div>

        {/* Menu Items */}
        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer gap-2"
        >
          <User className="h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/profile?tab=settings")}
          className="cursor-pointer gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate(getDashboardPath())}
          className="cursor-pointer gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
