import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Radio,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageHeader from "@/components/LandingPageHeader";
import HeroSection from "@/components/HeroSection";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";

const portals = [
  {
    title: "Report an Accident",
    description:
      "Submit an accident or emergency report quickly with location, photos, and severity details.",
    icon: FileText,
    path: "/report",
    eyebrow: "Public Intake",
    accent: "from-primary/35 via-primary/10 to-transparent",
    iconColor: "text-primary",
  },
  {
    title: "Dispatcher Dashboard",
    description:
      "Manage live accidents, review reports, and monitor operations in real time.",
    icon: Radio,
    path: "/login?role=dispatcher",
    eyebrow: "Operations",
    accent: "from-warning/35 via-warning/10 to-transparent",
    iconColor: "text-warning",
  },
  {
    title: "Responder Portal",
    description:
      "View live accidents from the field workspace and track completed responses.",
    icon: Shield,
    path: "/login?role=responder",
    eyebrow: "Field Unit",
    accent: "from-info/35 via-info/10 to-transparent",
    iconColor: "text-info",
  },
];

const statusStages = [
  {
    title: "Submitted",
    description:
      "A public accident report is captured with scene details and routed into the queue.",
    icon: FileText,
    accent: "from-primary/30 via-primary/10 to-transparent",
    iconColor: "text-primary",
  },
  {
    title: "Under Review",
    description:
      "Dispatch examines the accident report, checks location quality, and confirms urgency.",
    icon: AlertTriangle,
    accent: "from-warning/30 via-warning/10 to-transparent",
    iconColor: "text-warning",
  },
  {
    title: "Resolved",
    description:
      "The accident response is stabilized and the case is marked resolved.",
    icon: CheckCircle,
    accent: "from-success/30 via-success/10 to-transparent",
    iconColor: "text-success",
  },
  {
    title: "Closed",
    description:
      "The accident record is finalized and closed in the backend lifecycle.",
    icon: Zap,
    accent: "from-muted/60 via-muted/20 to-transparent",
    iconColor: "text-muted-foreground",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useProtectedNavigation();

  const handlePortalClick = (portal: (typeof portals)[0]) => {
    // Public report page - no auth required
    if (portal.title === "Report an Accident") {
      navigate("/report");
      return;
    }

    // Dispatcher/Responder portals - require authentication
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // If authenticated dispatcher, go to dispatcher dashboard
    if (portal.title === "Dispatcher Dashboard" && user?.role === "OFFICER") {
      navigate("/dashboard/officer");
      return;
    }

    // If authenticated responder, go to responder dashboard
    if (portal.title === "Responder Portal" && user?.role === "RESPONDER") {
      navigate("/dashboard/responder");
      return;
    }

    // Otherwise redirect to login
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingPageHeader />

      <HeroSection />

      {/* Portals Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Portals
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Choose your workspace
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {portals.map((portal, index) => (
            <button
              key={portal.path}
              onClick={() => handlePortalClick(portal)}
              className="group landing-reveal text-left"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <Card className="relative h-full overflow-hidden border-border/80 bg-card/85 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(0,0,0,0.35)] cursor-pointer">
                <div
                  className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${portal.accent}`}
                />
                <CardContent className="relative flex h-full flex-col gap-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="inline-flex rounded-full border border-border/70 bg-secondary/70 px-3 py-1 font-mono text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
                        {portal.eyebrow}
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                        <portal.icon
                          className={`h-6 w-6 ${portal.iconColor}`}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.26em] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {portal.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {portal.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                    <span className="text-sm font-medium text-primary">
                      Open Portal
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/60 transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      {/* Lifecycle Section */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Lifecycle
          </span>
          <h2 className="mt-2 mb-10 text-3xl font-bold text-foreground">
            Accident status flow
          </h2>

          <div className="space-y-5 lg:hidden">
            {statusStages.map((stage, index) => (
              <div key={stage.title} className="relative pl-8">
                {index < statusStages.length - 1 && (
                  <div className="absolute left-[0.68rem] top-12 h-[calc(100%+0.9rem)] w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />
                )}
                <div className="absolute left-0 top-5 flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-background shadow-[0_0_0_4px_rgba(12,18,28,1)]">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary flow-dot" />
                </div>
                <Card className="relative overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
                  <div
                    className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${stage.accent}`}
                  />
                  <CardContent className="relative p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                        <stage.icon className={`h-5 w-5 ${stage.iconColor}`} />
                      </div>
                      <span className="font-mono text-[11px] tracking-[0.24em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {stage.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="relative hidden lg:block">
            <div className="pointer-events-none absolute left-0 right-0 top-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statusStages.map((stage, index) => (
                <Card
                  key={stage.title}
                  className="group landing-reveal relative overflow-hidden border-border/80 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${stage.accent}`}
                  />
                  {index < statusStages.length - 1 && (
                    <div className="pointer-events-none absolute right-[-0.65rem] top-10 z-10 hidden xl:block">
                      <div className="flex items-center gap-2">
                        <div className="h-px w-7 bg-border" />
                        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-background/95">
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="relative flex h-full flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80 shadow-inner">
                        <stage.icon className={`h-5 w-5 ${stage.iconColor}`} />
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-mono text-[11px] tracking-[0.24em] uppercase">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="h-2.5 w-2.5 rounded-full bg-primary/70 flow-dot" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {stage.title}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {stage.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="inline-flex rounded-full border border-border/70 bg-secondary/70 px-3 py-1 font-mono text-[11px] tracking-wider text-muted-foreground">
                        {index === statusStages.length - 1
                          ? "Final State"
                          : "Next in Queue"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs text-muted-foreground">
            SARS — Smart Accident Reporting System © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
