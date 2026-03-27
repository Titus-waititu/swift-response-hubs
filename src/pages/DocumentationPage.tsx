import { Link } from "react-router-dom";
import {
  FileText,
  BookOpen,
  Code,
  HelpCircle,
  ArrowRight,
  Shield,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageHeader from "@/components/LandingPageHeader";

const docCategories = [
  {
    title: "Getting Started",
    description:
      "Quick onboarding guide for reporters, dispatchers, and responders.",
    icon: BookOpen,
    color: "text-primary",
    sections: [
      "System Overview",
      "Account Setup",
      "First Steps",
      "Navigation Guide",
    ],
  },
  {
    title: "For Reporters",
    description: "Learn how to quickly and accurately report accidents.",
    icon: AlertTriangle,
    color: "text-warning",
    sections: [
      "How to Report",
      "Photos & Details",
      "Location Accuracy",
      "Status Tracking",
    ],
  },
  {
    title: "For Dispatchers",
    description: "Master incident management and operations coordination.",
    icon: Zap,
    color: "text-accent",
    sections: [
      "Dashboard Overview",
      "Incident Review",
      "Status Management",
      "Team Coordination",
    ],
  },
  {
    title: "For Responders",
    description: "Manage field operations and incident response.",
    icon: Shield,
    color: "text-info",
    sections: [
      "Field Dashboard",
      "Active Incidents",
      "Status Updates",
      "Response Tracking",
    ],
  },
  {
    title: "API Documentation",
    description: "Technical reference for system integrations.",
    icon: Code,
    color: "text-success",
    sections: [
      "Authentication",
      "Endpoints",
      "Rate Limiting",
      "Error Handling",
    ],
  },
  {
    title: "FAQ",
    description: "Answers to common questions and troubleshooting.",
    icon: HelpCircle,
    color: "text-muted-foreground",
    sections: [
      "Common Issues",
      "Troubleshooting",
      "Account Help",
      "Features Help",
    ],
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingPageHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute left-[-8rem] top-14 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-5rem] top-28 h-72 w-72 rounded-full bg-info/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
              Documentation &{" "}
              <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                Guides
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Everything you need to know to use SARS effectively, from
              reporting accidents to managing emergency response operations.
            </p>
          </div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Documentation
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Browse documentation by topic
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {docCategories.map((category, index) => (
            <Card
              key={category.title}
              className="landing-reveal group overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
              <CardContent className="relative p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="mt-6 space-y-2">
                  {category.sections.map((section) => (
                    <div
                      key={section}
                      className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                      {section}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Quick Links
            </span>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Popular resources
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="landing-reveal flex items-start gap-4 rounded-lg border border-border/70 bg-card/70 p-6 hover:bg-card transition-colors">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  System Architecture
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Understand how SARS works under the hood and all the
                  components involved.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>

            <div
              className="landing-reveal flex items-start gap-4 rounded-lg border border-border/70 bg-card/70 p-6 hover:bg-card transition-colors"
              style={{ animationDelay: "80ms" }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-info/10">
                <Code className="h-5 w-5 text-info" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">API Reference</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete technical documentation for system integrations and
                  custom apps.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>

            <div
              className="landing-reveal flex items-start gap-4 rounded-lg border border-border/70 bg-card/70 p-6 hover:bg-card transition-colors"
              style={{ animationDelay: "160ms" }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-warning/10">
                <HelpCircle className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Troubleshooting
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solutions to common issues and how to get support when needed.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>

            <div
              className="landing-reveal flex items-start gap-4 rounded-lg border border-border/70 bg-card/70 p-6 hover:bg-card transition-colors"
              style={{ animationDelay: "240ms" }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-success/10">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  Security & Privacy
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  How we protect your data and maintain system security at all
                  times.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-2xl border border-border/80 bg-card/85 p-10 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-foreground">
            Still have questions?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contact our support team or visit the community forum for help.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
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
