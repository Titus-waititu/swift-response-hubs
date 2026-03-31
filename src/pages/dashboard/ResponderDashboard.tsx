import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import ResponderSidebar from "@/components/responder/ResponderSidebar";
import ResponderTopNav from "@/components/responder/ResponderTopNav";
import ResponderDashboardPage from "@/components/responder/pages/ResponderDashboardPage";
import ResponderAssignmentsPage from "@/components/responder/pages/ResponderAssignmentsPage";
import ResponderProfilePage from "@/components/responder/pages/ResponderProfilePage";
import ProfilePage from "@/components/ProfilePage";
import { useGetMyAssignedIncidents } from "@/hooks/useAccidents";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import type { IncidentReport } from "@/types/incident";

type ResponderPage = "dashboard" | "assignments" | "profile";

const ResponderDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<ResponderPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("responder-theme");
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
    localStorage.setItem("responder-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const { data: accidents, refetch: refetchAccidents } =
    useGetMyAssignedIncidents();
  const accidentsArray = Array.isArray(accidents)
    ? accidents
    : accidents?.data || [];
  const incidents: IncidentReport[] = accidentsArray.map(
    mapBackendAccidentToIncident,
  );

  // Enable real-time polling for incidents
  useRealtimeUpdates({
    queryKeys: [["accidents", "my-assigned"]],
    interval: 1500, // Sync with hook polling (1000ms) but offset slightly
    enabled: !!user,
  });

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
        return (
          <ResponderDashboardPage incidents={incidents} userName={user.name} />
        );
      case "assignments":
        return (
          <ResponderAssignmentsPage
            incidents={incidents}
            onRefreshAssignments={refetchAccidents}
          />
        );
      case "profile":
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex bg-white dark:bg-slate-950 overflow-hidden">
      <ResponderSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={user.name}
      />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ResponderTopNav
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

export default ResponderDashboard;
