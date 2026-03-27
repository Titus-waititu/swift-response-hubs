import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavigationProps {
  isLoggedIn?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Navigation = ({
  isLoggedIn = false,
  isDarkMode = false,
  onToggleTheme,
}: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "How It Works", href: "#how-it-works" },
    ...(isLoggedIn ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-blue-950 shadow-lg"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-700 dark:bg-teal-600 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span
              className={`font-semibold text-lg hidden sm:inline transition-colors ${
                isScrolled
                  ? "text-blue-950 dark:text-blue-50"
                  : "text-blue-950 dark:text-blue-50"
              }`}
            >
              SARS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? "text-blue-900 dark:text-blue-100 hover:text-teal-700 dark:hover:text-teal-400"
                    : "text-blue-900 dark:text-blue-100 hover:text-teal-700 dark:hover:text-teal-400"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className={`${
                isScrolled
                  ? "text-blue-900 dark:text-blue-100"
                  : "text-blue-900 dark:text-blue-100"
              }`}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </Button>

            {/* Auth Buttons */}
            {!isLoggedIn && (
              <div className="hidden sm:flex gap-3">
                <Button
                  variant="outline"
                  asChild
                  className={`${
                    isScrolled
                      ? "border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-50"
                      : "border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-50"
                  }`}
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white"
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-blue-950 border-t border-blue-100 dark:border-blue-900">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm font-medium text-blue-900 dark:text-blue-100 hover:text-teal-700 dark:hover:text-teal-400 py-2"
                >
                  {link.label}
                </a>
              ))}
              {!isLoggedIn && (
                <div className="flex gap-2 pt-2 border-t border-blue-100 dark:border-blue-900">
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
