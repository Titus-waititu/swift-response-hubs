import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopNav from "../../components/admin/AdminTopNav";
import AdminDashboardPage from "../../components/admin/pages/AdminDashboardPage";
import IncidentsManagementPage from "../../components/admin/pages/IncidentsManagementPage";
import UsersManagementPage from "../../components/admin/pages/UsersManagementPage";
import EmergencyServicesPage from "../../components/admin/pages/EmergencyServicesPage";
import AdminSettingsPage from "../../components/admin/pages/AdminSettingsPage";
import ProfilePage from "../../components/ProfilePage";
import { Toaster } from "@/components/ui/toaster";
import { useGetAccidents } from "@/hooks/useAccidents";
import { mapBackendAccidentToIncident } from "@/lib/backend-api";
import type { IncidentReport } from "@/types/incident";

type AdminPage =
  | "dashboard"
  | "incidents"
  | "users"
  | "services"
  | "settings"
  | "profile";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("admin-theme");
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
    localStorage.setItem("admin-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const { data: accidents } = useGetAccidents();
  const accidentsArray = Array.isArray(accidents) ? accidents : accidents || [];
  const incidents: IncidentReport[] = accidentsArray.map(
    mapBackendAccidentToIncident,
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigate = (page: AdminPage) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboardPage />;
      case "incidents":
        return <IncidentsManagementPage />;
      case "users":
        return <UsersManagementPage />;
      case "services":
        return <EmergencyServicesPage />;
      case "settings":
        return <AdminSettingsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <div className="fixed inset-0 flex bg-white dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Navigation */}
        <AdminTopNav
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

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-4 md:p-6 lg:p-8">{renderPage()}</div>
        </main>
      </div>

      <Toaster />
    </div>
  );
};

export default AdminDashboard;
