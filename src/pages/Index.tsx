import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Zap,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Navigation } from "@/components/premium/Navigation";
import { Footer } from "@/components/premium/Footer";
import {
  Section,
  SectionHeader,
  FeatureCard,
  Step,
  Hero,
} from "@/components/premium/Sections";
import { Button } from "@/components/ui/button";

export default function PremiumLandingPage() {
  const navigate = useNavigate();

  const handleReportAccident = () => {
    navigate("/login");
  };

  const handleLearnMore = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero
        title="Emergency Response, Simplified"
        subtitle="Report accidents instantly. Get help faster. Experience intelligent emergency dispatch powered by real-time AI analysis."
        primaryCTA={{
          label: "Report an Accident",
          onClick: handleReportAccident,
        }}
        secondaryCTA={{
          label: "Learn More",
          onClick: handleLearnMore,
        }}
      />

      {/* Features Section */}
      <Section id="features" className="bg-white dark:bg-blue-950">
        <SectionHeader
          title="Designed for Speed and Clarity"
          subtitle="Four core capabilities that transform emergency response"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<AlertCircle size={32} />}
            title="AI Analysis"
            description="Intelligent real-time assessment of accident severity, location, and required resources."
          />
          <FeatureCard
            icon={<Zap size={32} />}
            title="Auto Dispatch"
            description="Automated emergency service coordination ensuring fastest response times."
          />
          <FeatureCard
            icon={<Clock size={32} />}
            title="Real-Time Updates"
            description="Live incident tracking and status updates for all involved parties."
          />
          <FeatureCard
            icon={<Shield size={32} />}
            title="Secure Reporting"
            description="End-to-end encryption and privacy protection for all incident data."
          />
        </div>
      </Section>

      {/* How It Works Section */}
      <Section id="how-it-works">
        <SectionHeader
          title="How It Works"
          subtitle="Four simple steps from accident to resolution"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Steps */}
          <div className="space-y-8">
            <Step
              number={1}
              title="Report"
              description="Users submit accident details through an intuitive interface—location, vehicle info, injuries, and photos."
            />
            <Step
              number={2}
              title="AI Analysis"
              description="Our system analyzes the report, assesses severity, predicts resource needs, and identifies optimal response routes."
            />
            <Step
              number={3}
              title="Dispatch"
              description="Emergency services are automatically coordinated and dispatched based on real-time availability and proximity."
            />
            <Step
              number={4}
              title="Response"
              description="First responders arrive faster with complete information, while users get live updates on every step."
            />
          </div>

          {/* Visual placeholder */}
          <div className="bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900 dark:to-teal-900 rounded-lg h-96 md:h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-blue-700 dark:text-blue-200">
                Process Visualization
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Benefits Section */}
      <Section className="bg-blue-950 dark:bg-slate-950 text-white">
        <SectionHeader
          title="Why Emergency Services Trust SARS"
          subtitle="Proven results delivering better outcomes"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              stat: "45%",
              label: "Faster Response Times",
            },
            {
              stat: "92%",
              label: "User Satisfaction",
            },
            {
              stat: "10,000+",
              label: "Lives Improved",
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-teal-400 mb-3">
                {item.stat}
              </div>
              <p className="text-blue-100 dark:text-slate-300 text-lg">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Value Propositions */}
      <Section className="bg-white dark:bg-blue-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* For Users */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-blue-950 dark:text-blue-50">
              For Accident Victims
            </h3>
            <ul className="space-y-4">
              {[
                "Report instantly from your phone",
                "Real-time help tracking",
                "Automatic location detection",
                "Safe data storage",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={20}
                    className="text-teal-700 dark:text-teal-400 flex-shrink-0 mt-1"
                  />
                  <span className="text-blue-700 dark:text-blue-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* For Emergency Services */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-blue-950 dark:text-blue-50">
              For Emergency Services
            </h3>
            <ul className="space-y-4">
              {[
                "Intelligent incident assessment",
                "Optimized resource allocation",
                "Complete incident coordination",
                "Data-driven decision making",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <CheckCircle2
                    size={20}
                    className="text-teal-700 dark:text-teal-400 flex-shrink-0 mt-1"
                  />
                  <span className="text-blue-700 dark:text-blue-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section className="bg-gradient-to-r from-teal-700 to-blue-700 dark:from-teal-800 dark:to-blue-900 text-white py-20 md:py-32">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Report an Accident?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Get help in seconds. Sign up now or report immediately as a guest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleReportAccident}
              className="px-8 py-3 md:py-4 bg-white text-teal-700 hover:bg-blue-50 font-semibold text-lg"
            >
              Get Started <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 md:py-4 border-white text-white hover:bg-white/10 font-semibold text-lg"
            >
              View Demo
            </Button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
