import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "../NotificationsDropdown";

interface ResponderTopBarProps {
  onSearchChange: (query: string) => void;
  onToggleSidebar?: () => void;
  unreadCount?: number;
}

export default function ResponderTopBar({
  onSearchChange,
  onToggleSidebar,
  unreadCount = 0,
}: ResponderTopBarProps) {
  return (
    <div className="bg-background border-b border-border">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle + Search */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search incidents..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary"
            />
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="flex items-center gap-2">
          <NotificationsDropdown />
        </div>
      </div>
    </div>
  );
}
