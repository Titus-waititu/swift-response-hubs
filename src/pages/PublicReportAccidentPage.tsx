import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { client } from "@/lib/api";
import Navigation from "@/components/premium/Navigation";
import Footer from "@/components/premium/Footer";
import { useTheme } from "@/hooks/useTheme";

interface ReportFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  description: string;
  type: string;
}

export default function PublicReportAccidentPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [geoLocation, setGeoLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const { isDark } = useTheme();

  // Request geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setGeoError(null);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setGeoError("Unable to access your location. Please enter it manually.");
          setGeoLocation(null);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    }
  }, []);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      location: "",
      description: "",
      type: "accident",
    } as ReportFormValues,
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        // Validate geolocation
        if (!geoLocation) {
          toast.error("Unable to determine your location. Please check your browser permissions.");
          setIsSubmitting(false);
          return;
        }

        // Map form values to backend expectations
        const response = await client.post("/accidents", {
          description: `${value.description}\n\nReporter: ${value.fullName}\nEmail: ${value.email}\nPhone: ${value.phoneNumber}`,
          severity: "moderate",
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
          locationAddress: value.location,
          accidentDate: new Date().toISOString(),
          reportedById: "public-user", // Temporary ID for public reports
          numberOfVehicles: 1,
        });

        if (response.status === 201 || response.status === 200) {
          setIsSuccess(true);
          toast.success("Accident report submitted successfully!");

          // Redirect after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to submit report. Please try again.";
        toast.error(message);
        console.error("Report submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isSuccess) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 px-4 py-12 pt-24">
          <Card className="w-full max-w-md border-success/30 bg-success/5 dark:bg-success/10">
            <CardContent className="pt-12 pb-8">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Report Submitted!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Thank you for reporting the incident. Emergency responders
                    have been notified and will be dispatched to your location
                    shortly.
                  </p>
                </div>
                <p className="text-sm font-medium text-success">
                  We may contact you at the phone number or email you provided
                  for updates.
                </p>
                <p className="text-xs text-muted-foreground/70 pt-4">
                  Redirecting to home page...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-12 pt-24">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-700 dark:bg-red-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-white" size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground dark:text-white mb-2">
              Report an Accident
            </h1>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              In case of emergency, provide your details and incident
              information below. Responders will be dispatched immediately to
              assist.
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                All information will be shared with emergency responders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form.Subscribe>
                {({ isSubmitting: formSubmitting }) => (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.handleSubmit();
                    }}
                    className="space-y-6"
                  >
                    {/* Your Contact Information Section */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <h3 className="font-semibold text-sm mb-4 text-foreground">
                        Your Contact Information
                      </h3>
                      <div className="space-y-4">
                        {/* Full Name */}
                        <form.Field
                          name="fullName"
                          validators={{
                            onChange: ({ value }) =>
                              !value || value.trim().length < 2
                                ? "Name is required"
                                : undefined,
                          }}
                        >
                          {(field) => (
                            <div className="space-y-2">
                              <Label
                                htmlFor="fullName"
                                className="text-sm font-medium flex items-center gap-2"
                              >
                                <User className="h-4 w-4" />
                                Full Name *
                              </Label>
                              <Input
                                id="fullName"
                                name={field.name}
                                placeholder="John Doe"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={isSubmitting || formSubmitting}
                                className={`h-10 ${
                                  field.state.meta.errors.length
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {field.state.meta.errors.join(", ")}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>

                        {/* Email */}
                        <form.Field
                          name="email"
                          validators={{
                            onChange: ({ value }) => {
                              if (!value) return "Email is required";
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              return emailRegex.test(value)
                                ? undefined
                                : "Invalid email address";
                            },
                          }}
                        >
                          {(field) => (
                            <div className="space-y-2">
                              <Label
                                htmlFor="email"
                                className="text-sm font-medium flex items-center gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                Email *
                              </Label>
                              <Input
                                id="email"
                                name={field.name}
                                type="email"
                                placeholder="you@example.com"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={isSubmitting || formSubmitting}
                                className={`h-10 ${
                                  field.state.meta.errors.length
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {field.state.meta.errors.join(", ")}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>

                        {/* Phone Number */}
                        <form.Field
                          name="phoneNumber"
                          validators={{
                            onChange: ({ value }) =>
                              !value || value.trim().length < 7
                                ? "Valid phone number is required"
                                : undefined,
                          }}
                        >
                          {(field) => (
                            <div className="space-y-2">
                              <Label
                                htmlFor="phoneNumber"
                                className="text-sm font-medium flex items-center gap-2"
                              >
                                <Phone className="h-4 w-4" />
                                Phone Number *
                              </Label>
                              <Input
                                id="phoneNumber"
                                name={field.name}
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={isSubmitting || formSubmitting}
                                className={`h-10 ${
                                  field.state.meta.errors.length
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {field.state.meta.errors.join(", ")}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </div>

                    {/* Incident Information Section */}
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800/50">
                      <h3 className="font-semibold text-sm mb-4 text-foreground">
                        Incident Information
                      </h3>
                      <div className="space-y-4">
                        {/* Location */}
                        <form.Field
                          name="location"
                          validators={{
                            onChange: ({ value }) =>
                              !value || value.trim().length < 3
                                ? "Location is required"
                                : undefined,
                          }}
                        >
                          {(field) => (
                            <div className="space-y-2">
                              <Label
                                htmlFor="location"
                                className="text-sm font-medium flex items-center gap-2"
                              >
                                <MapPin className="h-4 w-4" />
                                Incident Location *
                                {geoLocation && (
                                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded">
                                    📍 Location detected
                                  </span>
                                )}
                              </Label>
                              <Input
                                id="location"
                                name={field.name}
                                placeholder="Street address or landmark"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={isSubmitting || formSubmitting}
                                className={`h-10 ${
                                  field.state.meta.errors.length
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              {geoError && (
                                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                  ⚠️ {geoError}
                                </p>
                              )}
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {field.state.meta.errors.join(", ")}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>

                        {/* Description */}
                        <form.Field
                          name="description"
                          validators={{
                            onChange: ({ value }) =>
                              !value || value.trim().length < 10
                                ? "Please provide at least 10 characters describing the incident"
                                : undefined,
                          }}
                        >
                          {(field) => (
                            <div className="space-y-2">
                              <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                              >
                                Description of Incident *
                              </Label>
                              <Textarea
                                id="description"
                                name={field.name}
                                placeholder="Describe what happened, number of people involved, injuries, etc."
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={isSubmitting || formSubmitting}
                                rows={5}
                                className={`resize-none ${
                                  field.state.meta.errors.length
                                    ? "border-red-500"
                                    : ""
                                }`}
                              />
                              <p className="text-xs text-muted-foreground">
                                {field.state.value.length}/500 characters
                              </p>
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  {field.state.meta.errors.join(", ")}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>
                      </div>
                    </div>

                    {/* Alert Info */}
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        In life-threatening emergencies, call emergency services
                        (911 in the US) immediately. This form supplements
                        emergency calls.
                      </AlertDescription>
                    </Alert>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 text-white h-10"
                        disabled={isSubmitting || formSubmitting}
                      >
                        {isSubmitting || formSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Report"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/")}
                        disabled={isSubmitting || formSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </form.Subscribe>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Card className="border-primary/20 bg-primary/5 dark:bg-primary/10">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-2">
                  Why provide your details?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Emergency responders need your contact information to follow
                  up, provide updates, and reach you if needed.
                </p>
              </CardContent>
            </Card>
            <Card className="border-info/20 bg-info/5 dark:bg-info/10">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-sm mb-2">
                  What happens next?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your report is immediately dispatched to the nearest
                  responders. They will arrive with sirens and lights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
