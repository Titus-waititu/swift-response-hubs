import type { ComponentType } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Radio,
  FileText,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type AppHeaderNavItem = {
  label: string;
  path?: string;
  icon: ComponentType<{ className?: string }>;
  onClick?: () => void;
  isActive?: boolean;
};

const defaultNavItems: AppHeaderNavItem[] = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Report", path: "/report", icon: FileText },
  { label: "Dispatcher", path: "/dispatcher", icon: Radio },
  { label: "Responder", path: "/responder", icon: Shield },
];

interface AppHeaderProps {
  brandTo?: string;
  brandLabel?: string;
  onBrandClick?: () => void;
  navItems?: AppHeaderNavItem[];
  userBadge?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

export default function AppHeader({
  brandTo = "/",
  brandLabel = "SARS",
  onBrandClick,
  navItems = defaultNavItems,
  userBadge = "DA",
  onLogout,
  showLogout = false,
}: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  const getIsActive = (item: AppHeaderNavItem) =>
    item.isActive ??
    (item.path
      ? item.path === currentPath || item.path === location.pathname
      : false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      toast.info("Signed out successfully");
      navigate("/");
    }
  };

  const renderNavItem = (item: AppHeaderNavItem, compact = false) => {
    const active = getIsActive(item);
    const className = compact
      ? `flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
          active
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`
      : `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          active
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        }`;

    if (item.path) {
      return (
        <Link
          key={`${item.label}-${item.path}`}
          to={item.path}
          className={className}
          onClick={item.onClick}
        >
          <item.icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          {item.label}
        </Link>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        className={className}
        onClick={item.onClick}
      >
        <item.icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {item.label}
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Brand */}
        <Link
          to={brandTo}
          className="flex items-center gap-2"
          onClick={onBrandClick}
        >
          <img
            src="/srs-logo.png"
            alt="SRS"
            className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            {brandLabel}
            <span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {showLogout ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {userBadge}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                  Menu
                </div>
                <DropdownMenuSeparator />
                {navItems.map(
                  (item) =>
                    item.path && (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link
                          to={item.path}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ),
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {userBadge}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="flex flex-col items-stretch border-t border-border px-4 py-2 sm:hidden">
          {navItems.map((item) => renderNavItem(item, false))}
          {showLogout && (
            <>
              <div className="border-t border-border my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
