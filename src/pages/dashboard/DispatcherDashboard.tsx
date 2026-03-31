import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import DispatcherSidebar from "@/components/dispatcher/DispatcherSidebar";
import DispatcherTopNav from "@/components/dispatcher/DispatcherTopNav";
import DispatcherDashboardPage from "@/components/dispatcher/pages/DispatcherDashboardPage";
import IncidentsQueuePage from "@/components/dispatcher/pages/IncidentsQueuePage";
import RespondersManagementPage from "@/components/dispatcher/pages/RespondersManagementPage";
import EmergencyServicesPage from "@/components/dispatcher/pages/EmergencyServicesPage";
import DispatcherSettingsPage from "@/components/dispatcher/pages/DispatcherSettingsPage";
import ProfilePage from "@/components/ProfilePage";
import { useGetAccidents } from "@/hooks/useAccidents";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import {
  getDispatcherQueueStats,
  getIncidentTypeBreakdown,
  getResponseTimeMetrics,
} from "@/lib/incident-analytics";
import type { IncidentReport } from "@/types/incident";

type DispatcherPage =
  | "dashboard"
  | "queue"
  | "responders"
  | "services"
  | "settings"
  | "profile";

export default function DispatcherDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<DispatcherPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("dispatcher-theme");
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
    localStorage.setItem("dispatcher-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Check if user is authenticated and has dispatcher role
  useEffect(() => {
    if (!user || user.role !== "DISPATCHER") {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: accidents } = useGetAccidents();
  const accidentsArray = Array.isArray(accidents) ? accidents : accidents || [];
  const incidents: IncidentReport[] = accidentsArray.map(
    mapBackendAccidentToIncident,
  );

  const queueStats = getDispatcherQueueStats(incidents);
  const incidentTypeBreakdown = getIncidentTypeBreakdown(incidents);
  const responseMetrics = getResponseTimeMetrics(incidents);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DispatcherDashboardPage
            incidents={incidents}
            queueStats={queueStats}
            incidentTypeBreakdown={incidentTypeBreakdown}
            responseMetrics={responseMetrics}
          />
        );
      case "queue":
        return <IncidentsQueuePage incidents={incidents} />;
      case "responders":
        return <RespondersManagementPage incidents={incidents} />;
      case "services":
        return <EmergencyServicesPage />;
      case "settings":
        return <DispatcherSettingsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return null;
    }
  };

  // Don't render until user is authenticated and has dispatcher role
  if (!user || user.role !== "DISPATCHER") {
    return null;
  }

  return (
    <div className="fixed inset-0 flex bg-white dark:bg-slate-950 overflow-hidden">
      <DispatcherSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={user.name}
      />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <DispatcherTopNav
          user={user}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
          criticalIncidentCount={
            incidents.filter(
              (i) =>
                i.severity_level === "Critical" &&
                i.status !== "resolved" &&
                i.status !== "closed",
            ).length
          }
        />
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
