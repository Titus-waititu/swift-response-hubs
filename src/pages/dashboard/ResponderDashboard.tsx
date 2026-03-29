import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import ResponderSidebar from "@/components/responder/ResponderSidebar";
import ResponderTopNav from "@/components/responder/ResponderTopNav";
import ResponderDashboardPage from "@/components/responder/pages/ResponderDashboardPage";
import ResponderAssignmentsPage from "@/components/responder/pages/ResponderAssignmentsPage";
import ResponderProfilePage from "@/components/responder/pages/ResponderProfilePage";
import { useGetAccidents } from "@/hooks/useAccidents";
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

  const { data: accidents, refetch: refetchAccidents } = useGetAccidents();
  const accidentsArray = Array.isArray(accidents)
    ? accidents
    : accidents?.data || [];
  const incidents: IncidentReport[] = accidentsArray.map(
    mapBackendAccidentToIncident,
  );

  // Enable real-time polling for incidents
  useRealtimeUpdates({
    queryKeys: [["accidents"]],
    interval: 5000,
    enabled: !!user,
  });

  const handleLogout = () => {
    logout();
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
        return <ResponderAssignmentsPage incidents={incidents} />;
      case "profile":
        return <ResponderProfilePage user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      <ResponderSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={user.name}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResponderTopNav
          userName={user.name}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
          criticalIncidentCount={
            incidents.filter(
              (i) => i.severity_level === "Critical" && i.status !== "Closed",
            ).length
          }
        />
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default ResponderDashboard;
