import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import {
  AlertTriangle,
  MapPin,
  Camera,
  ChevronRight,
  ChevronLeft,
  User,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppHeader from "@/components/AppHeader";
import { useIncidentStore } from "@/context/IncidentStore";
import {
  createBackendAccidentReport,
  mapBackendAccidentToIncident,
} from "@/lib/backend-api";
import {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
  type IncidentType,
} from "@/types/incident";
import { generateReportId } from "@/lib/incident-utils";
import { toast } from "sonner";
import {
  reportFormSchema,
  type ReportFormValues,
} from "@/lib/validation-schemas";

const stepConfig = [
  {
    title: "Reporter Info",
    eyebrow: "Step 01",
    description:
      "Identify who is reporting so dispatch can call back if more detail is needed.",
    icon: User,
  },
  {
    title: "Accident Details",
    eyebrow: "Step 02",
    description:
      "Describe what happened, set severity, and capture the core accident facts.",
    icon: AlertTriangle,
  },
  {
    title: "Location",
    eyebrow: "Step 03",
    description:
      "Pin down the exact scene so the nearest unit can reach it without delay.",
    icon: MapPin,
  },
  {
    title: "Evidence & Submit",
    eyebrow: "Step 04",
    description:
      "Confirm timing, attach supporting media, and dispatch the report into the live queue.",
    icon: Camera,
  },
] as const;

export default function ReportPage() {
  const navigate = useNavigate();
  const { addIncident } = useIncidentStore();
  const [step, setStep] = useState(0);
  const [locationAttempted, setLocationAttempted] = useState(false);

  const form = useForm<ReportFormValues>({
    defaultValues: {
      reporter_name: "",
      phone_number: "",
      email: "",
      incident_type: "",
      severity_level: "",
      short_description: "",
      number_of_victims: "0",
      vehicles_involved: "0",
      gps_latitude: "",
      gps_longitude: "",
      location_address: "",
      time_of_incident: "",
      photos: [],
    },
    onSubmit: async ({ value }) => {
      const parsed = reportFormSchema.safeParse(value);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const errorMessages = Object.values(errors).flat().filter(Boolean);
        toast.error(
          errorMessages.join("\n") || "Please fix the errors in the form."
        );
        return { success: false, errors };
      }

      try {
        console.log("[REPORT SUBMIT] Submitting report with TanStack Form");

        const accidentData = {
          reporter_name: parsed.data.reporter_name,
          phone_number: parsed.data.phone_number,
          email: parsed.data.email || `reporter-${Date.now()}@swift.local`,
          incident_type: parsed.data.incident_type,
          severity_level: parsed.data.severity_level,
          short_description: parsed.data.short_description,
          number_of_victims: parseInt(parsed.data.number_of_victims),
          vehicles_involved: parseInt(parsed.data.vehicles_involved),
          gps_latitude: parseFloat(parsed.data.gps_latitude),
          gps_longitude: parseFloat(parsed.data.gps_longitude),
          location_address: parsed.data.location_address,
          time_of_incident: parsed.data.time_of_incident,
        };

        try {
          const response = await createBackendAccidentReport(accidentData);
          const incident = mapBackendAccidentToIncident(response);
          addIncident(incident);
          toast.success("Report submitted successfully!");
          navigate(`/incident-status/${incident.report_id}`);
        } catch (backendError) {
          console.warn(
            "[REPORT SUBMIT] Backend error, using fallback:",
            backendError,
          );

          // Fallback: save to local store
          const id = generateReportId();
          const incident = {
            report_id: id,
            status: "Submitted",
            reporter_name: parsed.data.reporter_name,
            phone_number: parsed.data.phone_number,
            email: parsed.data.email || `reporter-${Date.now()}@swift.local`,
            incident_type: parsed.data.incident_type as IncidentType,
            severity_level: parsed.data.severity_level,
            short_description: parsed.data.short_description,
            number_of_victims: parseInt(parsed.data.number_of_victims),
            vehicles_involved: parseInt(parsed.data.vehicles_involved),
            gps_latitude: parseFloat(parsed.data.gps_latitude),
            gps_longitude: parseFloat(parsed.data.gps_longitude),
            location_address: parsed.data.location_address,
            photos: [],
            time_of_incident: parsed.data.time_of_incident,
            time_report_submitted: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          addIncident(incident);
          toast.success("Report submitted locally!");
          navigate(`/incident-status/${incident.report_id}`);
        }
      } catch (err) {
        console.error("[REPORT SUBMIT] Error:", err);
        toast.error("Failed to submit report");
      }
    },
  });

  // Auto-detect location
  const getLocationAuto = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device");
      setLocationAttempted(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setFieldValue("gps_latitude", String(pos.coords.latitude));
        form.setFieldValue("gps_longitude", String(pos.coords.longitude));
        setLocationAttempted(true);
        toast.success("✓ Location automatically captured");
      },
      (error) => {
        setLocationAttempted(true);
        const messages: Record<number, string> = {
          1: "Location permission denied. Please allow access.",
          2: "Position unavailable. Please enter manually.",
          3: "Location request timed out.",
        };
        toast.error(messages[error.code] || "Could not get location");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  };

  useEffect(() => {
    if (step === 2 && !locationAttempted) {
      getLocationAuto();
    }
  }, [step, locationAttempted]);

  const currentStep = stepConfig[step];

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting]}>
    {([isSubmitting]) => (
    <div className="min-h-screen bg-background">
      <AppHeader
        brandTo="/report"
        brandLabel="Accident Report"
        navItems={[
          { label: "Accident Intake", path: "/report", icon: FileText },
        ]}
      />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" />
        <div className="absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          {/* Header */}
          <div className="mb-8 max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
              Report an accident with detail for immediate response
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Move through the intake steps and dispatch your report directly
              into the live queue.
            </p>
          </div>

          {/* Main Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="grid gap-6 lg:grid-cols-[1fr]"
          >
            <Card className="overflow-hidden border-border/80 bg-card/85 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-secondary/85">
                    <currentStep.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase text-primary">
                      {currentStep.eyebrow}
                    </p>
                    <CardTitle className="text-xl">
                      {currentStep.title}
                    </CardTitle>
                    <CardDescription>{currentStep.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pb-8">
                {/* Step 0: Reporter Info */}
                {step === 0 && (
                  <div className="space-y-6">
                    <FormField
                      label="Full Name"
                      fieldName="reporter_name"
                      form={form}
                      type="text"
                      placeholder="John Doe"
                      disabled={isSubmitting}
                    />
                    <FormField
                      label="Phone Number"
                      fieldName="phone_number"
                      form={form}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      disabled={isSubmitting}
                    />
                    <FormField
                      label="Email (Optional)"
                      fieldName="email"
                      form={form}
                      type="email"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Step 1: Accident Details */}
                {step === 1 && (
                  <div className="space-y-6">
                    <SelectField
                      label="Incident Type"
                      fieldName="incident_type"
                      form={form}
                      options={INCIDENT_TYPES}
                      disabled={isSubmitting}
                    />
                    <SelectField
                      label="Severity Level"
                      fieldName="severity_level"
                      form={form}
                      options={SEVERITY_LEVELS}
                      disabled={isSubmitting}
                    />
                    <FormField
                      label="Description"
                      fieldName="short_description"
                      form={form}
                      type="textarea"
                      placeholder="Describe what happened..."
                      disabled={isSubmitting}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        label="Number of Victims"
                        fieldName="number_of_victims"
                        form={form}
                        type="number"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                      <FormField
                        label="Vehicles Involved"
                        fieldName="vehicles_involved"
                        form={form}
                        type="number"
                        placeholder="0"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                  <div className="space-y-6">
                    <FormField
                      label="Location Address"
                      fieldName="location_address"
                      form={form}
                      type="text"
                      placeholder="123 Main St, City, State"
                      disabled={isSubmitting}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        label="Latitude"
                        fieldName="gps_latitude"
                        form={form}
                        type="number"
                        placeholder="-90 to 90"
                        disabled={isSubmitting}
                        step="any"
                      />
                      <FormField
                        label="Longitude"
                        fieldName="gps_longitude"
                        form={form}
                        type="number"
                        placeholder="-180 to 180"
                        disabled={isSubmitting}
                        step="any"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getLocationAuto}
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {locationAttempted
                        ? "Re-detect Location"
                        : "Auto-Detect Location"}
                    </Button>
                  </div>
                )}

                {/* Step 3: Time & Evidence */}
                {step === 3 && (
                  <div className="space-y-6">
                    <FormField
                      label="Time of Incident"
                      fieldName="time_of_incident"
                      form={form}
                      type="datetime-local"
                      disabled={isSubmitting}
                    />
                    <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        Photos can be attached during submission. Maximum 5
                        files, 10MB each.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Navigation */}
              <CardContent className="border-t border-border/50 bg-secondary/30 p-6">
                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => step > 0 && setStep(step - 1)}
                    disabled={step === 0 || isSubmitting}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Step {step + 1} of {stepConfig.length}
                  </div>

                  {step < stepConfig.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      disabled={isSubmitting}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Report
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
    )}
    </form.Subscribe>
  );
}

// Helper Components
function FormField({
  label,
  fieldName,
  form,
  type = "text",
  placeholder,
  disabled,
  step,
}: {
  label: string;
  fieldName: any;
  form: any;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  step?: string;
}) {
  return (
    <form.Field
      name={fieldName}
      validators={{
        onChange: ({ value }: any) => {
          const parsed = reportFormSchema.shape[fieldName as keyof ReportFormValues].safeParse(value);
          return parsed.success ? undefined : parsed.error.issues[0].message;
        }
      }}
    >
      {(field: any) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{label}</Label>
          {type === "textarea" ? (
            <Textarea
              name={field.name}
              placeholder={placeholder}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={disabled}
              className={field.state.meta.errors.length ? "border-red-500 focus:ring-red-500" : ""}
            />
          ) : (
            <Input
              type={type}
              name={field.name}
              placeholder={placeholder}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              disabled={disabled}
              className={field.state.meta.errors.length ? "border-red-500 focus:ring-red-500" : ""}
              step={step}
            />
          )}
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {field.state.meta.errors.join(", ")}
            </p>
          )}
        </div>
      )}
    </form.Field>
  );
}

function SelectField({
  label,
  fieldName,
  form,
  options,
  disabled,
}: {
  label: string;
  fieldName: any;
  form: any;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <form.Field
      name={fieldName}
      validators={{
        onChange: ({ value }: any) => {
          const parsed = reportFormSchema.shape[fieldName as keyof ReportFormValues].safeParse(value);
          return parsed.success ? undefined : parsed.error.issues[0].message;
        }
      }}
    >
      {(field: any) => (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{label}</Label>
          <Select
            value={field.state.value}
            onValueChange={(value) => field.handleChange(value)}
            disabled={disabled}
          >
            <SelectTrigger className={field.state.meta.errors.length ? "border-red-500" : ""}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.state.meta.errors.length > 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {field.state.meta.errors.join(", ")}
            </p>
          )}
        </div>
      )}
    </form.Field>
  );
}
