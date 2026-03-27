import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
  MapPin,
  AlertCircle,
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
import { toast } from "sonner";

const OFFICER_SESSION_KEY = "swift-response-hub/officer-session/v1";

interface OfficerSession {
  userId: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
}

export default function OfficerDashboardPage() {
  const navigate = useNavigate();
  const { incidents } = useIncidentStore();
  const [session, setSession] = useState<OfficerSession | null>(null);

  useEffect(() => {
    const sessionData = window.localStorage.getItem(OFFICER_SESSION_KEY);
    if (!sessionData) {
      navigate("/login");
      return;
    }

    const parsedSession: OfficerSession = JSON.parse(sessionData);
    setSession(parsedSession);
  }, [navigate]);

  const handleLogout = () => {
    window.localStorage.removeItem(OFFICER_SESSION_KEY);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!session) return null;

  const stats = {
    total: incidents.length,
    submitted: incidents.filter((i) => i.status === "Submitted").length,
    underReview: incidents.filter((i) => i.status === "Under Review").length,
    resolved: incidents.filter((i) => i.status === "Resolved").length,
    critical: incidents.filter((i) => i.severity_level === "Critical").length,
  };

  const statusColors: Record<string, string> = {
    Submitted: "text-primary bg-primary/10 border-primary/30",
    "Under Review": "text-warning bg-warning/10 border-warning/30",
    Resolved: "text-success bg-success/10 border-success/30",
    Closed: "text-muted-foreground bg-secondary/50 border-border/70",
  };

  const navItems = [
    { label: "All Reports", path: "/officer-dashboard", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        brandTo="/officer-dashboard"
        brandLabel="Officer Dashboard"
        navItems={navItems}
        userBadge={session.name.charAt(0).toUpperCase()}
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-warning/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-info/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm mb-4">
                <Shield className="h-4 w-4 text-warning" />
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-warning">
                  Officer Access
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
                Officer Dashboard
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

          {/* Key Metrics */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Total Incidents
                  </p>
                  <p className="text-3xl font-black text-foreground">
                    {stats.total}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80 border-critical/30 bg-critical/5">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-3xl font-black text-primary">
                    {stats.critical}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-3xl font-black text-primary">
                    {stats.submitted}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-3xl font-black text-warning">
                    {stats.underReview}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/80">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-black text-success">
                    {stats.resolved}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-border/80 bg-card/80">
                <CardHeader>
                  <CardTitle>All Accident Reports</CardTitle>
                  <CardDescription>
                    View and manage all accident reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {incidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertCircle className="mb-3 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No reports available
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {incidents.map((report) => (
                        <div
                          key={report.report_id}
                          className="rounded-lg border border-border/70 bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">
                                Report #{report.report_id}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {report.reporter_name}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium whitespace-nowrap ${
                                statusColors[report.status] ||
                                "text-foreground bg-secondary/50 border-border/70"
                              }`}
                            >
                              {report.status}
                            </span>
                          </div>

                          <p className="text-sm text-foreground mb-2">
                            {report.short_description}
                          </p>

                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              <Card className="border-border/80 bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        Resolution Rate
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {stats.total > 0
                          ? Math.round((stats.resolved / stats.total) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-success to-primary"
                        style={{
                          width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">
                        Priority Cases
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {stats.critical}
                      </p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-warning"
                        style={{
                          width: `${stats.total > 0 ? Math.min((stats.critical / stats.total) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-info" />
                    System Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Role</p>
                    <p className="font-semibold text-foreground capitalize">
                      {session.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs text-muted-foreground truncate">
                      {session.userId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
