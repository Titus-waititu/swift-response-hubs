import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Zap, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { label: "Features", path: "/features" },
  { label: "Documentation", path: "/documentation" },
  { label: "About", path: "/about" },
];

export default function LandingPageHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useProtectedNavigation();
  const { logout } = useAuthStore();

  useEffect(() => {
    // Check localStorage first, then document class
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const shouldBeDark = storedTheme
      ? storedTheme === "dark"
      : prefersDark || document.documentElement.classList.contains("dark");

    setIsDark(shouldBeDark);

    // Apply the theme on mount
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newIsDark = !isDark;

    if (newIsDark) {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setIsDark(newIsDark);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden sm:inline text-foreground">SARS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Theme Toggle & Login */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {mobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navigationItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>

            {/* Login/Authenticated Button */}
            {!isAuthenticated ? (
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/admin")}
                        className="cursor-pointer gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.role === "OFFICER" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/officer")}
                        className="cursor-pointer gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Officer Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.role === "RESPONDER" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/responder")}
                        className="cursor-pointer gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Responder Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.role === "USER" && (
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard/user")}
                        className="cursor-pointer gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        My Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="cursor-pointer gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
