import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

/**
 * Hook for protected navigation with auth checks
 * Redirects to login if user is not authenticated
 */
export const useProtectedNavigation = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();

  const isAuthenticated = !!accessToken && !!user;

  /**
   * Navigate to a protected route
   * If not authenticated, redirects to login
   * If authenticated, navigates to the specified path
   */
  const navigateIfAuthenticated = (path: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  /**
   * Navigate to role-specific dispatcher dashboard
   * Checks if user is dispatcher, otherwise redirects to login
   */
  const navigateToDispatcher = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // If user is dispatcher, go to dispatcher dashboard
    if (user.role === "OFFICER") {
      navigate("/dashboard/officer");
      return;
    }

    // Otherwise redirect back to login
    navigate("/login");
  };

  /**
   * Navigate to report form
   * Can be public or protected based on user role
   */
  const navigateToReport = () => {
    if (!isAuthenticated) {
      // Public users can still report (no auth required for public intake)
      navigate("/report");
      return;
    }
    navigate("/report");
  };

  return {
    isAuthenticated,
    user,
    navigateIfAuthenticated,
    navigateToDispatcher,
    navigateToReport,
  };
};

export default useProtectedNavigation;
