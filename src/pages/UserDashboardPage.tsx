import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  FileText,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  User,
  Edit2,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import { useIncidentStore } from "@/context/IncidentStore";
import { useGetAccidents } from "@/hooks/useAccidents";
import { toast } from "sonner";
import type { IncidentReport } from "@/types/incident";

const USER_SESSION_KEY = "swift-response-hub/user-session/v1";

interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
}

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { incidents: localIncidents } = useIncidentStore();
  const { data: backendAccidents = [] } = useGetAccidents();
  const [session, setSession] = useState<UserSession | null>(null);
  const [myReports, setMyReports] = useState<typeof localIncidents>([]);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const sessionData = window.localStorage.getItem(USER_SESSION_KEY);
    if (!sessionData) {
      navigate("/login");
      return;
    }

    const parsedSession: UserSession = JSON.parse(sessionData);
    setSession(parsedSession);

    // Prioritize backend data, fallback to local store
    const reports = Array.isArray(backendAccidents)
      ? backendAccidents
      : localIncidents.filter((inc) => inc.email === parsedSession.email);
    setMyReports(reports);
  }, [backendAccidents, localIncidents, navigate]);

  const handleLogout = () => {
    window.localStorage.removeItem(USER_SESSION_KEY);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!session) return null;

  const statusColors: Record<string, string> = {
    Submitted: "text-primary bg-primary/10 border-primary/30",
    "Under Review": "text-warning bg-warning/10 border-warning/30",
    Resolved: "text-success bg-success/10 border-success/30",
    Closed: "text-muted-foreground bg-secondary/50 border-border/70",
  };

  const navItems = [
    { label: "My Reports", path: "/user-dashboard", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        brandTo="/user-dashboard"
        brandLabel="My Dashboard"
        navItems={navItems}
        userBadge={session.name.charAt(0).toUpperCase()}
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-info/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm mb-4">
                <User className="h-4 w-4 text-primary" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                  User Account
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
                Welcome, {session.name}
              </h1>
              <p className="mt-2 text-muted-foreground">{session.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border text-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-3xl font-black text-foreground">
                    {myReports.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-3xl font-black text-primary">
                    {myReports.filter((r) => r.status === "reported").length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-3xl font-black text-warning">
                    {
                      myReports.filter(
                        (r) => r.status === "under_investigation",
                      ).length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-black text-success">
                    {myReports.filter((r) => r.status === "resolved").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Card className="border-border/80 bg-card/80 hover:border-primary/30 transition-colors">
              <CardHeader>
                <AlertTriangle className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Report an Accident</CardTitle>
                <CardDescription>
                  Submit a new accident report to dispatch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate("/report")}
                >
                  Create Report
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardHeader>
                <FileText className="mb-2 h-6 w-6 text-info" />
                <CardTitle>My Reports</CardTitle>
                <CardDescription>
                  View details of your submitted reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-foreground">
                  {myReports.length} total reports
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="border-border/80 bg-card/80">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Your accident reports and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No reports yet
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 text-primary"
                    onClick={() => navigate("/report")}
                  >
                    Create your first report
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myReports.map((report) => (
                    <div
                      key={report.report_id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">
                            Report #{report.report_id}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                              statusColors[report.status] ||
                              "text-foreground bg-secondary/50 border-border/70"
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.short_description}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {report.incident_type}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location_address}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(
                              report.time_report_submitted,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {report.status === "resolved" && (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        )}
                        {report.status === "under_investigation" && (
                          <Clock className="h-5 w-5 text-warning animate-pulse" />
                        )}
                        {report.status === "reported" && (
                          <AlertTriangle className="h-5 w-5 text-primary" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedReport(report);
                            setShowDetailModal(true);
                          }}
                          className="h-8 w-8 p-0"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Detail Modal */}
          {showDetailModal && selectedReport && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle>Report #{selectedReport.report_id}</CardTitle>
                    <CardDescription>
                      Submitted{" "}
                      {new Date(
                        selectedReport.time_report_submitted,
                      ).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDetailModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Reporter
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedReport.reporter_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Phone
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedReport.phone_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Type
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedReport.incident_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Severity
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedReport.severity_level}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Status
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedReport.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Location
                      </p>
                      <p className="text-sm text-foreground">
                        {selectedReport.location_address}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Description
                    </p>
                    <p className="text-sm text-foreground">
                      {selectedReport.short_description}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Injuries
                      </p>
                      <p className="text-foreground">
                        {selectedReport.number_of_victims ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Vehicles
                      </p>
                      <p className="text-foreground">
                        {selectedReport.vehicles_involved ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Coordinates
                      </p>
                      <p className="text-foreground text-xs">
                        {selectedReport.gps_latitude.toFixed(4)},{" "}
                        {selectedReport.gps_longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
