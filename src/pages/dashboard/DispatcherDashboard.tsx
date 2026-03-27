import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DispatcherSidebar from "@/components/dispatcher/DispatcherSidebar";
import DispatcherTopNav from "@/components/dispatcher/DispatcherTopNav";
import DispatcherDashboardPage from "@/components/dispatcher/pages/DispatcherDashboardPage";
import IncidentsQueuePage from "@/components/dispatcher/pages/IncidentsQueuePage";
import DispatcherSettingsPage from "@/components/dispatcher/pages/DispatcherSettingsPage";
import { useGetAccidents } from "@/hooks/useAccidents";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import {
  getDispatcherQueueStats,
  getIncidentTypeBreakdown,
  getResponseTimeMetrics,
} from "@/lib/incident-analytics";
import type { DispatcherSession } from "@/components/dispatcher/DispatcherTypes";
import type { IncidentReport } from "@/types/incident";

type DispatcherPage = "dashboard" | "queue" | "settings";

const DISPATCHER_SESSION_KEY = "swift-response-hub/dispatcher-session/v1";

export default function DispatcherDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<DispatcherPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("dispatcher-theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });
  const [session, setSession] = useState<DispatcherSession | null>(() => {
    try {
      const rawSession = localStorage.getItem(DISPATCHER_SESSION_KEY);
      return rawSession ? JSON.parse(rawSession) : null;
    } catch {
      return null;
    }
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

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  const { data: accidents } = useGetAccidents();
  const accidentsArray = Array.isArray(accidents)
    ? accidents
    : accidents?.data || [];
  const incidents: IncidentReport[] = accidentsArray.map(
    mapBackendAccidentToIncident,
  );

  const queueStats = getDispatcherQueueStats(incidents);
  const incidentTypeBreakdown = getIncidentTypeBreakdown(incidents);
  const responseMetrics = getResponseTimeMetrics(incidents);

  const handleLogout = () => {
    localStorage.removeItem(DISPATCHER_SESSION_KEY);
    setSession(null);
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
      case "settings":
        return <DispatcherSettingsPage />;
      default:
        return null;
    }
  };

  if (!session) return null;

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      <DispatcherSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={session.name}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DispatcherTopNav
          userName={session.name}
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
}
