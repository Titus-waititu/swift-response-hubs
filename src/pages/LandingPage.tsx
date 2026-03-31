import { useNavigate } from "react-router-dom";
import {
  FileText,
  Radio,
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  AlertTriangle,
  Zap as SmartIcon,
  MapPin,
  Clock,
  Users,
  ChevronDown,
  Phone,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/premium/Navigation";
import { useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleReportClick = () => {
    navigate("/report-accident");
  };

  const handleLearnClick = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const faqItems = [
    {
      question: "How does AI determine accident severity?",
      answer:
        "Our AI system analyzes multiple data points including damage description, injury reports, location hazards, and historical incident patterns to classify severity in real-time, ensuring critical cases are prioritized immediately.",
    },
    {
      question: "Who receives my accident report?",
      answer:
        "Your report is securely transmitted to your local dispatch center. Only authorized emergency responders, dispatchers, and relevant officers can access your information based on jurisdiction and role.",
    },
    {
      question: "How fast is emergency response?",
      answer:
        "Our AI-powered dispatch system reduces response time by up to 40% compared to manual dispatch. Responders receive assignments in seconds, and locations are verified automatically.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Yes. All data is encrypted end-to-end and stored securely. We comply with HIPAA and local privacy regulations. Your information is only retained as long as legally required.",
    },
    {
      question: "Can I track my report in real-time?",
      answer:
        "Yes. After reporting, you can track the status of your incident, see estimated responder arrival times, and receive updates throughout the response process.",
    },
  ];

  const features = [
    {
      title: "AI Severity Analysis",
      description: "Instantly analyze incident severity to prioritize emergency response",
      icon: Sparkles,
    },
    {
      title: "Automated Dispatch",
      description: "Smart assignment of responders based on location, availability, and expertise",
      icon: Zap,
    },
    {
      title: "Real-Time Tracking",
      description: "Live location tracking and status updates from report to resolution",
      icon: MapPin,
    },
    {
      title: "Secure Reporting",
      description: "End-to-end encryption and HIPAA-compliant data protection",
      icon: Shield,
    },
    {
      title: "Multi-Role Coordination",
      description: "Seamless communication between dispatchers, responders, and officers",
      icon: Users,
    },
  ];

  const roles = [
    {
      title: "Citizens",
      description: "Report accidents instantly without registration during emergencies",
      actions: ["Report accidents", "Track response", "Receive updates"],
      icon: AlertCircle,
      gradient: "from-blue-500/20 to-blue-500/5",
    },
    {
      title: "Dispatchers",
      description: "Manage incidents, assign responders, and coordinate emergency response",
      actions: ["View live incidents", "Assign responders", "Monitor status"],
      icon: Radio,
      gradient: "from-orange-500/20 to-orange-500/5",
    },
    {
      title: "Responders",
      description: "Receive field assignments and update incident status in real-time",
      actions: ["Get assignments", "Navigate to scene", "Submit updates"],
      icon: Shield,
      gradient: "from-green-500/20 to-green-500/5",
    },
    {
      title: "Officers",
      description: "Investigate incidents and generate comprehensive reports",
      actions: ["Review cases", "Document findings", "Generate reports"],
      icon: FileText,
      gradient: "from-purple-500/20 to-purple-500/5",
    },
  ];

  const statuses = [
    {
      title: "Submitted",
      description: "Report received and queued for processing",
      icon: FileText,
      number: "01",
    },
    {
      title: "AI Analysis",
      description: "System analyzes severity and recommends resources",
      icon: Sparkles,
      number: "02",
    },
    {
      title: "Dispatched",
      description: "Responders assigned and notified of incident",
      icon: Radio,
      number: "03",
    },
    {
      title: "En Route",
      description: "Responders traveling to emergency location",
      icon: MapPin,
      number: "04",
    },
    {
      title: "On Scene",
      description: "Responders have arrived at the incident",
      icon: CheckCircle,
      number: "05",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 px-4 overflow-hidden flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl w-full">
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Emergency Response</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Emergency Response,{" "}
                <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Report accidents instantly. AI analyzes severity. Responders arrive faster. Track
                everything in real-time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={handleReportClick}
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertCircle className="h-5 w-5" />
                Report Accident Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLearnClick}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                See How It Works
              </Button>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">40%</div>
                <p className="text-sm text-muted-foreground">Faster Response</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">Always Available</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Encrypted Data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="border-t border-border bg-card/30 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Trusted by
            </p>
            <h2 className="text-3xl font-bold">Emergency Services Nationwide</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Agencies", value: "500+" },
              { label: "Responders", value: "10K+" },
              { label: "Incidents Handled", value: "100K+" },
              { label: "Lives Supported", value: "1M+" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Process
            </p>
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
              From report to resolution in seconds, not minutes
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="grid md:grid-cols-5 gap-6">
              {[
                {
                  step: "01",
                  title: "Report",
                  description: "User reports accident without registration",
                  icon: FileText,
                },
                {
                  step: "02",
                  title: "Analyze",
                  description: "AI determines severity and required resources",
                  icon: Sparkles,
                },
                {
                  step: "03",
                  title: "Dispatch",
                  description: "System automatically assigns best-fit responders",
                  icon: Radio,
                },
                {
                  step: "04",
                  title: "Respond",
                  description: "Emergency personnel mobilize to scene",
                  icon: MapPin,
                },
                {
                  step: "05",
                  title: "Resolve",
                  description: "Incident documented and case closed",
                  icon: CheckCircle,
                },
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="relative z-10 mb-6">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/30 mx-auto">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-mono text-primary">{item.step}</p>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-card/30 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Capabilities
            </p>
            <h2 className="text-4xl font-bold">Powerful Features</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="group hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                  Intelligence
                </p>
                <h2 className="text-4xl font-bold">AI-Powered Insights</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Severity Detection",
                    description: "Instantly classify incident severity from descriptions and photos",
                  },
                  {
                    title: "Smart Dispatch",
                    description:
                      "Optimal responder assignment based on location, skills, and availability",
                  },
                  {
                    title: "Predictive Analysis",
                    description:
                      "Anticipate resource needs and dispatch preventatively when possible",
                  },
                  {
                    title: "Automated Reporting",
                    description: "Generate comprehensive incident reports automatically",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {[
                      { label: "Severity", value: "HIGH", bar: 85 },
                      { label: "Response Time", value: "2:34", bar: 65 },
                      { label: "Confidence", value: "98%", bar: 98 },
                    ].map((metric, i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <span className="text-sm text-primary font-bold">{metric.value}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                            style={{ width: `${metric.bar}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Experience */}
      <section className="border-t border-border bg-card/30 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              For Everyone
            </p>
            <h2 className="text-4xl font-bold">Built for Every Role</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, i) => (
              <Card key={i} className="group hover:border-primary/50 transition-all overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${role.gradient}`} />
                <CardContent className="relative space-y-4 p-6 -mt-12 pt-16">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg">{role.title}</h3>
                    <role.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  <ul className="space-y-2 pt-4">
                    {role.actions.map((action, j) => (
                      <li key={j} className="flex gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Status Timeline */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Status Flow
            </p>
            <h2 className="text-4xl font-bold">Real-Time Status Updates</h2>
          </div>

          <div className="space-y-4">
            {statuses.map((status, i) => (
              <div
                key={i}
                className="relative group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <Card className="relative hover:border-primary/50 transition-all cursor-default">
                  <CardContent className="p-6 flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                        <status.icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-primary">{status.number}</span>
                        <h3 className="font-bold text-lg">{status.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{status.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary/30 flex-shrink-0" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-card/30 py-20 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
              Questions
            </p>
            <h2 className="text-4xl font-bold">Frequently Asked</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between hover:bg-card/50 transition-colors text-left"
                >
                  <h3 className="font-bold">{item.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-muted-foreground border-t border-border">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strong CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10" />
        </div>

        <div className="mx-auto max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Be Prepared. Report Incidents Instantly.
            </h2>
            <p className="text-xl text-muted-foreground">
              No registration needed. No delays. Get emergency help faster with AI-powered dispatch.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={handleReportClick}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertCircle className="h-5 w-5" />
              Report Accident Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Login to Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 px-4 bg-card/50">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <h4 className="font-bold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={handleReportClick} className="hover:text-foreground transition">
                    Report Accident
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLearnClick}
                    className="hover:text-foreground transition"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Features</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Pricing</button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition">About Us</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Blog</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Careers</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Press</button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition">Documentation</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Contact</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Emergency Hotline</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Status</button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-foreground transition">Privacy Policy</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Terms of Service</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Compliance</button>
                </li>
                <li>
                  <button className="hover:text-foreground transition">Security</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} SARS · Smart Accident Reporting System. All rights
                reserved.
              </p>
              <div className="flex gap-4">
                <button className="text-muted-foreground hover:text-foreground transition">
                  Twitter
                </button>
                <button className="text-muted-foreground hover:text-foreground transition">
                  LinkedIn
                </button>
                <button className="text-muted-foreground hover:text-foreground transition">
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
