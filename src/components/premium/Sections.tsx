import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
}

/**
 * Premium section wrapper with standardized spacing
 * Used throughout landing page for consistent layout
 */
export const Section = ({
  children,
  className = "",
  id,
  fullWidth = false,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={`${fullWidth ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"} py-20 md:py-32 ${className}`}
    >
      {children}
    </section>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

/**
 * Standardized section header with title and optional subtitle
 */
export const SectionHeader = ({
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) => {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-16 md:mb-20 ${alignClass}`}>
      <h2
        className={`text-4xl md:text-5xl font-bold mb-4 text-blue-950 dark:text-blue-50`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-teal-700 dark:text-teal-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  image?: string;
}

/**
 * Premium feature card with icon, title, and description
 */
export const FeatureCard = ({
  icon,
  title,
  description,
  image,
}: FeatureCardProps) => {
  return (
    <div className="bg-white dark:bg-blue-950 rounded-lg p-8 md:p-12 hover:shadow-xl transition-shadow duration-300 border border-blue-100 dark:border-blue-900">
      {/* Icon */}
      <div className="mb-6 inline-flex p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div className="text-teal-700 dark:text-teal-300">{icon}</div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold mb-4 text-blue-950 dark:text-blue-50">
        {title}
      </h3>

      {/* Description */}
      <p className="text-base text-blue-700 dark:text-blue-200 leading-relaxed mb-6">
        {description}
      </p>

      {/* Image placeholder if provided */}
      {image && (
        <div className="mt-6 h-40 bg-blue-100 dark:bg-blue-900 rounded-lg overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
}

/**
 * Step indicator for "How It Works" section
 */
export const Step = ({ number, title, description }: StepProps) => {
  return (
    <div className="flex gap-6">
      {/* Step Number */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-700 dark:bg-teal-600 text-white font-bold text-xl">
          {number}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow pt-2">
        <h3 className="text-xl font-semibold mb-2 text-blue-950 dark:text-blue-50">
          {title}
        </h3>
        <p className="text-blue-700 dark:text-blue-200 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
  };
  backgroundImage?: string;
  backgroundGradient?: string;
}

/**
 * Premium hero section
 */
export const Hero = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  backgroundGradient = "from-blue-50 via-blue-50 to-blue-100 dark:from-blue-950 dark:via-blue-950 dark:to-blue-900",
}: HeroProps) => {
  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center pt-20 md:pt-32 pb-20 overflow-hidden ${
        backgroundImage ? "" : `bg-gradient-to-b ${backgroundGradient}`
      }`}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Overlay for readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-950 dark:text-blue-50 leading-tight">
          {title}
        </h1>

        <p className="text-lg md:text-2xl text-teal-700 dark:text-teal-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={primaryCTA.onClick}
            className="px-8 py-3 md:py-4 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            {primaryCTA.label}
          </button>

          {secondaryCTA && (
            <button
              onClick={secondaryCTA.onClick}
              className="px-8 py-3 md:py-4 border-2 border-teal-700 dark:border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-semibold rounded-lg transition-colors duration-200"
            >
              {secondaryCTA.label}
            </button>
          )}
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-teal-700 dark:text-teal-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};
