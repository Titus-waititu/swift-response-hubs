import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProtectedNavigation } from "@/hooks/useProtectedNavigation";

export default function HeroSection() {
  const { navigateToReport, navigateToDispatcher } = useProtectedNavigation();
  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute left-[-8rem] top-14 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-5rem] top-28 h-72 w-72 rounded-full bg-info/10 blur-3xl" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 max-w-fit">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <span className="font-mono text-xs tracking-widest text-primary uppercase">
                  Smart Accident Reporting System
                </span>
              </div>

              <h1 className="max-w-2xl text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-tight">
                Every second counts in an{" "}
                <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent">
                  emergency
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Report accidents instantly, review them in dispatch, and track
                resolution from scene to closure in one operational workspace
                built for urgency.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Live accident queue",
                "Real-time dispatch",
                "Backend status sync",
              ].map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center rounded-full border border-border/80 bg-card/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={navigateToReport}
              >
                <AlertTriangle className="h-4 w-4" />
                Report Accident
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={navigateToDispatcher}
              >
                Open Dispatcher
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-primary/20 via-info/10 to-accent/5 blur-lg" />
            <div className="relative overflow-hidden rounded-lg border border-border/80 shadow-2xl">
              {/* Image Container with Overlay */}
              <div className="relative overflow-hidden bg-black/40">
                <img
                  src="https://images.unsplash.com/photo-1575987446487-56eba08666cf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Emergency response in action"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Stats Overlay Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="grid grid-cols-3 gap-4 text-white">
                    <div>
                      <div className="text-2xl font-black/90">24/7</div>
                      <div className="text-xs text-white/70">Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black">100+</div>
                      <div className="text-xs text-white/70">Teams</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black">&lt;2min</div>
                      <div className="text-xs text-white/70">Avg Alert</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent Corner */}
              <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
