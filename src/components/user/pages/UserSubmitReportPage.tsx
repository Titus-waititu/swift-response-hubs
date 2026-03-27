import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  userSubmitReportSchema,
  type UserSubmitReportFormValues,
} from "@/lib/validation-schemas";

interface SubmitAccidentReportProps {
  onSubmit?: (data: UserSubmitReportFormValues) => void;
}

export default function SubmitAccidentReportPage({
  onSubmit,
}: SubmitAccidentReportProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const form = useForm<UserSubmitReportFormValues>({
    defaultValues: {
      description: "",
      location: "",
      latitude: "",
      longitude: "",
      vehicleLicensePlate: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: "",
      otherVehiclesCount: 0,
      witnessCount: 0,
      injuriesReported: false,
      injuriesDescription: "",
      airbagDeployed: false,
      rollover: false,
    },
    onSubmit: async ({ value }) => {
      try {
        // Clear previous errors
        setFieldErrors({});

        // Validate with Zod
        await userSubmitReportSchema.parseAsync(value);

        console.log("Submitting accident report with TanStack Form:", value);
        onSubmit?.(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const fieldName = err.path.join(".");
            errors[fieldName] = err.message;
          });
          setFieldErrors(errors);
        }
      }
    },
  });

  const isSubmitting = form.state.isSubmitting;

  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName];
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Submit Accident Report
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Provide detailed information about the incident
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-900 dark:text-blue-300">
              Provide as much detail as possible. All information will be
              reviewed by emergency responders and officers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Incident Description */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Incident Description
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Describe what happened
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                What happened? *
              </Label>
              <Textarea
                placeholder="Describe the incident in detail..."
                value={form.state.values.description}
                onChange={(e) =>
                  form.setFieldValue("description", e.target.value)
                }
                disabled={isSubmitting}
                className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 h-32 ${
                  getFieldError("description")
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {getFieldError("description") && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {String(getFieldError("description"))}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Location Address *
                </Label>
                <Input
                  placeholder="Street address"
                  value={form.state.values.location}
                  onChange={(e) =>
                    form.setFieldValue("location", e.target.value)
                  }
                  disabled={isSubmitting}
                  className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                    getFieldError("location")
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {getFieldError("location") && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {String(getFieldError("location"))}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Coordinates (optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Latitude"
                    type="number"
                    step="any"
                    value={form.state.values.latitude}
                    onChange={(e) =>
                      form.setFieldValue("latitude", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm"
                  />
                  <Input
                    placeholder="Longitude"
                    type="number"
                    step="any"
                    value={form.state.values.longitude}
                    onChange={(e) =>
                      form.setFieldValue("longitude", e.target.value)
                    }
                    disabled={isSubmitting}
                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Your Vehicle Information
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Details about the primary vehicle involved
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                License Plate
              </Label>
              <Input
                placeholder="ABC-1234"
                value={form.state.values.vehicleLicensePlate}
                onChange={(e) =>
                  form.setFieldValue("vehicleLicensePlate", e.target.value)
                }
                disabled={isSubmitting}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Make
                </Label>
                <Input
                  placeholder="Toyota"
                  value={form.state.values.vehicleMake}
                  onChange={(e) =>
                    form.setFieldValue("vehicleMake", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Model
                </Label>
                <Input
                  placeholder="Camry"
                  value={form.state.values.vehicleModel}
                  onChange={(e) =>
                    form.setFieldValue("vehicleModel", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Year
                </Label>
                <Input
                  type="number"
                  placeholder="2022"
                  value={form.state.values.vehicleYear}
                  onChange={(e) =>
                    form.setFieldValue("vehicleYear", e.target.value)
                  }
                  disabled={isSubmitting}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Details */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50">
              Incident Details
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Additional information about the accident
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Other Vehicles Involved
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={form.state.values.otherVehiclesCount}
                  onChange={(e) =>
                    form.setFieldValue(
                      "otherVehiclesCount",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  disabled={isSubmitting}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
              <div>
                <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                  Witnesses Present
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={form.state.values.witnessCount}
                  onChange={(e) =>
                    form.setFieldValue(
                      "witnessCount",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  disabled={isSubmitting}
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="injuries"
                  checked={form.state.values.injuriesReported}
                  onCheckedChange={(checked) =>
                    form.setFieldValue("injuriesReported", checked as boolean)
                  }
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="injuries"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Injuries reported
                </label>
              </div>

              {form.state.values.injuriesReported && (
                <div>
                  <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                    Describe injuries *
                  </Label>
                  <Textarea
                    placeholder="Describe any injuries..."
                    value={form.state.values.injuriesDescription}
                    onChange={(e) =>
                      form.setFieldValue("injuriesDescription", e.target.value)
                    }
                    disabled={isSubmitting}
                    className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                      getFieldError("injuriesDescription")
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {getFieldError("injuriesDescription") && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {String(getFieldError("injuriesDescription"))}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="airbag"
                  checked={form.state.values.airbagDeployed}
                  onCheckedChange={(checked) =>
                    form.setFieldValue("airbagDeployed", checked as boolean)
                  }
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="airbag"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Airbag deployed
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rollover"
                  checked={form.state.values.rollover}
                  onCheckedChange={(checked) =>
                    form.setFieldValue("rollover", checked as boolean)
                  }
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="rollover"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Vehicle rolled over
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Report...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit Accident Report
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
