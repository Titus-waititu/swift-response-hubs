import { Link } from "react-router-dom";
import {
  Radio,
  AlertTriangle,
  Zap,
  BarChart3,
  MapPin,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageHeader from "@/components/LandingPageHeader";

const features = [
  {
    title: "Real-Time Incident Queue",
    description:
      "Live accident reports flow in instantly with full location, photos, and severity details. Review and prioritize with complete transparency.",
    icon: Radio,
    color: "text-primary",
  },
  {
    title: "Rapid Triage & Dispatch",
    description:
      "Dispatchers examine incidents with robust detail review. Confirm urgency, validate information, and route to responders efficiently.",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    title: "Field Visibility",
    description:
      "Responders see live assignments, track location data, and manage responses from the scene. Complete incident lifecycle visibility.",
    icon: MapPin,
    color: "text-info",
  },
  {
    title: "Response Metrics",
    description:
      "Track closure times, response rates, and operational efficiency. Data-driven insights to improve emergency response performance.",
    icon: BarChart3,
    color: "text-success",
  },
  {
    title: "Smart Status Sync",
    description:
      "Automatic backend synchronization keeps all systems in perfect alignment. No manual interventions needed—pure operational flow.",
    icon: Zap,
    color: "text-accent",
  },
  {
    title: "Multi-Role Workspace",
    description:
      "Unified platform for public reporters, dispatchers, and responders. One system, three perspectives, complete coordination.",
    icon: Users,
    color: "text-info",
  },
];

const benefits = [
  {
    number: "01",
    title: "Faster Response Times",
    description:
      "Reduce time-to-dispatch from minutes to seconds with streamlined incident intake and prioritization.",
  },
  {
    number: "02",
    title: "Better Coordination",
    description:
      "All stakeholders see the same incident data in real time, eliminating communication delays and errors.",
  },
  {
    number: "03",
    title: "Data-Driven Operations",
    description:
      "Built-in analytics help you understand response patterns and continuously improve your emergency operations.",
  },
  {
    number: "04",
    title: "Public Trust",
    description:
      "Professional, transparent reporting system instills confidence in your emergency response capabilities.",
  },
];

export default function FeaturesPage() {
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
              Features Built for{" "}
              <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                Emergency Response
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              SARS gives you the tools to report accidents instantly, review
              them efficiently, and coordinate responses across your entire
              organization.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Core Capabilities
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Everything you need in one platform
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="landing-reveal relative overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
              <CardContent className="relative p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Benefits
            </span>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Why teams choose SARS
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.number}
                className="landing-reveal flex gap-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/80">
                  <span className="font-mono text-lg font-bold text-primary">
                    {benefit.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-2xl border border-border/80 bg-card/85 p-10 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to streamline your emergency response?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started with SARS today and see the difference real-time
            coordination makes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/report">
                Report an Accident
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
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
