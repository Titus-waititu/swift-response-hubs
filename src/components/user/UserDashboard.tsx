import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import UserSidebar from "@/components/user/UserSidebar";
import UserTopNav from "@/components/user/UserTopNav";
import UserDashboardPage from "@/components/user/pages/UserDashboardPage";
import UserSubmitReportPage from "@/components/user/pages/UserSubmitReportPage";
import UserReportsPage from "@/components/user/pages/UserReportsPage";
import UserSettingsPage from "@/components/user/pages/UserSettingsPage";
import ProfilePage from "@/components/ProfilePage";
import { useGetAccidents } from "@/hooks/useAccidents";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import type { IncidentReport } from "@/types/incident";

type UserPage = "dashboard" | "submit" | "reports" | "settings" | "profile";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState<UserPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("user-theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  // Apply theme on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("user-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Enable real-time polling for user reports with fresh data
  const { data: accidents, refetch } = useGetAccidents({
    staleTime: 0, // Always treat data as stale to fetch fresh data on every refetch
  });

  // Force refetch every 2 seconds to ensure latest status
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refetch();
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [refetch]);

  useRealtimeUpdates({
    queryKeys: [["accidents", "list"]],
    interval: 3000, // Poll every 3 seconds for faster real-time status updates
    enabled: true,
  });

  const accidentsArray = Array.isArray(accidents) ? accidents : accidents || [];
  const allIncidents: IncidentReport[] = accidentsArray.map(
    mapBackendAccidentToIncident,
  );

  // Filter incidents to show only those reported by the current user
  const incidents: IncidentReport[] = allIncidents.filter(
    (incident) => incident.reportedById === user?.id,
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <UserDashboardPage incidents={incidents} userName={user.name} />;
      case "submit":
        return <UserSubmitReportPage />;
      case "reports":
        return <UserReportsPage incidents={incidents} />;
      case "settings":
        return <UserSettingsPage user={user} />;
      case "profile":
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex bg-white dark:bg-slate-950 overflow-hidden">
      <UserSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={user.name}
      />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <UserTopNav
          user={user}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
