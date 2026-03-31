import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IncidentStoreProvider } from "@/context/IncidentStore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GoogleAuthProviderWrapper } from "@/components/GoogleAuthProvider";

// Pages
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import PublicReportAccidentPage from "./pages/PublicReportAccidentPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import OfficerDashboard from "./pages/dashboard/OfficerDashboard";
import ResponderDashboard from "./pages/dashboard/ResponderDashboard";
import DispatcherDashboard from "./pages/dashboard/DispatcherDashboard";

// Legacy Pages (for backward compatibility)
import ReportPage from "./pages/ReportPage";
import ResponderPage from "./pages/ResponderPage";
import IncidentStatusPage from "./pages/IncidentStatusPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserLoginPage from "./pages/UserLoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import OfficerDashboardPage from "./pages/OfficerDashboardPage";
import FeaturesPage from "./pages/FeaturesPage";
import DocumentationPage from "./pages/DocumentationPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./components/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401 Unauthorized
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => (
  <BrowserRouter>
    <GoogleAuthProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <IncidentStoreProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/report-accident" element={<PublicReportAccidentPage />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard/user"
                element={
                  <ProtectedRoute allowedRoles={["USER"]}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/officer"
                element={
                  <ProtectedRoute allowedRoles={["OFFICER"]}>
                    <OfficerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/responder"
                element={
                  <ProtectedRoute allowedRoles={["RESPONDER"]}>
                    <ResponderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/dispatcher"
                element={
                  <ProtectedRoute allowedRoles={["DISPATCHER"]}>
                    <DispatcherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Information Routes */}
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute
                    allowedRoles={[
                      "USER",
                      "ADMIN",
                      "OFFICER",
                      "RESPONDER",
                      "DISPATCHER",
                    ]}
                  >
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Legacy Routes (for backward compatibility) */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/user-login" element={<UserLoginPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route
                path="/incident-status/:reportId"
                element={<IncidentStatusPage />}
              />
              <Route
                path="/dispatcher"
                element={
                  <ProtectedRoute allowedRoles={["DISPATCHER"]}>
                    <DispatcherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/responder" element={<ResponderPage />} />
              <Route path="/user-dashboard" element={<UserDashboardPage />} />
              <Route
                path="/officer-dashboard"
                element={<OfficerDashboardPage />}
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </IncidentStoreProvider>
      </QueryClientProvider>
    </GoogleAuthProviderWrapper>
  </BrowserRouter>
);

export default App;
