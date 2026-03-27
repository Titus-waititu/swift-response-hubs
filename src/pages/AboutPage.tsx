import { Link } from "react-router-dom";
import {
  Zap,
  Heart,
  Target,
  Users,
  ArrowRight,
  CheckCircle,
  Globe,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandingPageHeader from "@/components/LandingPageHeader";

const values = [
  {
    title: "Speed",
    description:
      "Every second counts in emergencies. We're built for rapid response and instant communication.",
    icon: Zap,
  },
  {
    title: "Reliability",
    description:
      "Your emergency operations depend on us. We maintain 99.9% uptime and continuous performance.",
    icon: CheckCircle,
  },
  {
    title: "Transparency",
    description:
      "All stakeholders see the same information at the same time. No hidden delays or unclear statuses.",
    icon: Globe,
  },
  {
    title: "Innovation",
    description:
      "We continuously improve and adapt to emergencies of all types and scales.",
    icon: Lightbulb,
  },
];

const timeline = [
  {
    year: "2024",
    title: "SARS Founded",
    description:
      "Started with a mission to revolutionize emergency accident reporting and response coordination.",
  },
  {
    year: "2025",
    title: "Multi-Role Expansion",
    description:
      "Added comprehensive support for dispatchers, responders, and public reporters on a single platform.",
  },
  {
    year: "2026",
    title: "Full Platform Launch",
    description:
      "Launched complete operational dashboard with real-time analytics, status sync, and mobile optimization.",
  },
];

export default function AboutPage() {
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
              About{" "}
              <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                SARS
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We're on a mission to make emergency response faster, clearer, and
              more coordinated through intelligent accident reporting and
              real-time operations management.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Our Mission
            </span>
            <h2 className="mt-4 text-3xl font-bold text-foreground">
              Save Lives Through Smarter Response
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              In emergencies, communication delays cost lives. We built SARS to
              eliminate those delays by creating a unified platform where
              reporters, dispatchers, and responders work together seamlessly.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Our goal is simple: make sure the right people know about
              emergencies immediately, with complete information, so they can
              respond faster and save more lives.
            </p>
          </div>
          <Card className="relative overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/20 via-info/10 to-transparent" />
            <CardContent className="relative p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80 mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Every Second Matters
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Average emergency response time: 7-12 minutes nationwide. SARS
                helps reduce discovery time to under 30 seconds through
                intelligent reporting and instant notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Our Values
            </span>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              What drives everything we do
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="landing-reveal overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
                <CardContent className="relative p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/80">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Journey
          </span>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            How we got here
          </h2>
        </div>

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div
              key={item.year}
              className="landing-reveal flex gap-6 lg:gap-12"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-background mb-6">
                  <span className="font-mono text-sm font-bold text-primary">
                    {item.year}
                  </span>
                </div>
                {index < timeline.length - 1 && (
                  <div className="h-20 w-px bg-gradient-to-b from-primary/50 to-transparent" />
                )}
              </div>
              <div className="pt-2 pb-8">
                <h3 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-12">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Team
            </span>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Built by passionate people
            </h2>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/85 p-10 text-center backdrop-blur-sm">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">
              Emergency Response Experts
            </h3>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Our team includes emergency responders, dispatch coordinators, and
              technology leaders who understand the complexities of real-world
              emergency operations. We build SARS based on real experience, not
              assumptions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="rounded-2xl border border-border/80 bg-card/85 p-10 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-foreground">
            Join us in improving emergency response
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you're reporting, dispatching, or responding, SARS works
            better when everyone participates.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Link to="/login?role=dispatcher">
                Get Started
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
