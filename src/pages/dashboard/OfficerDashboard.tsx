import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import OfficerSidebar from "@/components/officer/OfficerSidebar";
import OfficerTopNav from "@/components/officer/OfficerTopNav";
import OfficerDashboardPage from "@/components/officer/pages/OfficerDashboardPage";
import AccidentsManagementPage from "@/components/officer/pages/AccidentsManagementPage";
import AIInvestigationAssistantPage from "@/components/officer/pages/AIInvestigationAssistantPage";
import UsersProfilePage from "@/components/officer/pages/UsersProfilePage";
import ProfilePage from "@/components/ProfilePage";
import { useGetAccidents } from "@/hooks/useAccidents";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import {
  getDispatcherQueueStats,
  getIncidentTypeBreakdown,
  getResponseTimeMetrics,
} from "@/lib/incident-analytics";
import type { IncidentReport } from "@/types/incident";

type OfficerPage =
  | "dashboard"
  | "accidents"
  | "ai-assistant"
  | "users"
  | "profile";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<OfficerPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("officer-theme");
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
    localStorage.setItem("officer-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

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
          <OfficerDashboardPage
            incidents={incidents}
            queueStats={queueStats}
            incidentTypeBreakdown={incidentTypeBreakdown}
            responseMetrics={responseMetrics}
            userName={user.name}
          />
        );
      case "accidents":
        return <AccidentsManagementPage incidents={incidents} />;
      case "ai-assistant":
        return (
          <AIInvestigationAssistantPage
            incident={
              incidents[0] || {
                id: "",
                incident_type: "",
                severity_level: "MEDIUM",
                status: "Submitted",
                location: "Demo Location",
                description: "Demo incident",
              }
            }
          />
        );
      case "users":
        return <UsersProfilePage />;
      case "profile":
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex bg-white dark:bg-slate-950 overflow-hidden">
      <OfficerSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        userName={user.name}
      />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <OfficerTopNav
          user={user}
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

export default OfficerDashboard;
