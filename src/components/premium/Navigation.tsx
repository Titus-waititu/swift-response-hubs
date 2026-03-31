import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "@/hooks/useTheme";
import ProfileDropdown from "@/components/ProfileDropdown";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useProtectedNavigation();
  const { logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout();
    navigate("/");
    setIsLoggingOut(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Documentation", href: "/documentation" },
  ];

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
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Report Accident Button - Desktop */}
            <Link to="/report-accident" className="hidden sm:block">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Report Accident
              </Button>
            </Link>

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
              <Link to="/login" className="hidden sm:block">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            ) : (
              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                isLoading={isLoggingOut}
              />
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-4 pt-4 space-y-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-border pt-3 space-y-2">
              {/* Report Accident Button - Mobile */}
              <Link to="/report-accident">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Report Accident
                </Button>
              </Link>

              {!isAuthenticated ? (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Register
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full"
                  variant="outline"
                >
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
