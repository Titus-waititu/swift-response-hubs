import { useState, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload, AlertCircle, Loader2, ImagePlus, X } from "lucide-react";
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
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setFieldValue("latitude", position.coords.latitude.toString());
          form.setFieldValue("longitude", position.coords.longitude.toString());
          setIsLocating(false);
          setLocationError(null);
        },
        (error) => {
          console.warn("Geolocation failed or was denied:", error);
          setIsLocating(false);
          if (error.code === 1) {
            setLocationError("Location access was denied. Please allow location access in your browser settings to automatically detect your coordinates.");
          } else {
            setLocationError("Failed to get location. Your coordinates could not be automatically detected.");
          }
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    // Attempt to grab geolocation automatically on mount
    requestLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      mediaFiles: [],
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const currentFiles = form.state.values.mediaFiles || [];
      const updatedFiles = [...currentFiles, ...newFiles];
      form.setFieldValue("mediaFiles", updatedFiles);

      // Create previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index]);

    const updatedFiles = [...(form.state.values.mediaFiles || [])];
    updatedFiles.splice(index, 1);
    form.setFieldValue("mediaFiles", updatedFiles);

    const updatedPreviews = [...mediaPreviews];
    updatedPreviews.splice(index, 1);
    setMediaPreviews(updatedPreviews);
  };

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

            <div className="grid grid-cols-1 gap-4">
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
              {/* Coordinates are captured automatically */}
              {locationError ? (
                <div className="text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded border border-yellow-200 dark:border-yellow-800/30 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{locationError}</p>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="h-auto p-0 text-yellow-700 dark:text-yellow-300 font-semibold mt-1"
                      onClick={requestLocation}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : form.state.values.latitude && form.state.values.longitude ? (
                <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800/30 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Location successfully detected automatically
                </div>
              ) : isLocating ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Detecting your location...
                </div>
              ) : null}
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

        {/* Media Attachments */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <ImagePlus className="h-5 w-5" />
              Media Attachments
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Upload photos or videos of the incident scene
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Files
              </Button>
              <span className="text-sm text-slate-500">
                {form.state.values.mediaFiles?.length || 0} file(s) selected
              </span>
            </div>

            {/* Previews */}
            {mediaPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="relative group rounded-md overflow-hidden bg-slate-100 aspect-square">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
