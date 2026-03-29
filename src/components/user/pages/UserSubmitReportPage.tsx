import { useState, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { Upload, AlertCircle, Loader2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
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
            setLocationError(
              "Location access was denied. Please allow location access in your browser settings to automatically detect your coordinates.",
            );
          } else {
            setLocationError(
              "Failed to get location. Your coordinates could not be automatically detected.",
            );
          }
        },
        { enableHighAccuracy: true },
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

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
      const parsed = userSubmitReportSchema.safeParse(value);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        const errorMessages = Object.values(errors).flat().filter(Boolean);
        toast.error(
          errorMessages.join("\n") || "Please fix the errors in the form.",
        );
        return { success: false, errors };
      }

      try {
        console.log(
          "Submitting accident report with TanStack Form:",
          parsed.data,
        );
        onSubmit?.(parsed.data);
        toast.success("Report submitted successfully!");
      } catch (error) {
        toast.error("Failed to submit report.");
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const currentFiles = form.state.values.mediaFiles || [];
      const updatedFiles = [...currentFiles, ...newFiles];
      form.setFieldValue("mediaFiles", updatedFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    const updatedFiles = [...(form.state.values.mediaFiles || [])];
    updatedFiles.splice(index, 1);
    form.setFieldValue("mediaFiles", updatedFiles);

    const updatedPreviews = [...mediaPreviews];
    updatedPreviews.splice(index, 1);
    setMediaPreviews(updatedPreviews);
  };

  return (
    <form.Subscribe>
      {({ isSubmitting }) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
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
                <form.Field
                  name="description"
                  validators={{
                    onChange: ({ value }) =>
                      userSubmitReportSchema.shape.description.safeParse(value)
                        .success
                        ? undefined
                        : "Description must be at least 10 characters",
                  }}
                >
                  {(field) => (
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                        What happened? *
                      </Label>
                      <Textarea
                        name={field.name}
                        placeholder="Describe the incident in detail..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isSubmitting}
                        className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 h-32 ${
                          field.state.meta.errors.length
                            ? "border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 gap-4">
                  <form.Field
                    name="location"
                    validators={{
                      onChange: ({ value }) =>
                        userSubmitReportSchema.shape.location.safeParse(value)
                          .success
                          ? undefined
                          : "Location address is required",
                    }}
                  >
                    {(field) => (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                          Location Address *
                        </Label>
                        <Input
                          name={field.name}
                          placeholder="Street address"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isSubmitting}
                          className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                            field.state.meta.errors.length
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
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
                  ) : form.state.values.latitude &&
                    form.state.values.longitude ? (
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
                <form.Field name="vehicleLicensePlate">
                  {(field) => (
                    <div>
                      <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                        License Plate
                      </Label>
                      <Input
                        name={field.name}
                        placeholder="ABC-1234"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                      />
                    </div>
                  )}
                </form.Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <form.Field name="vehicleMake">
                    {(field) => (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                          Make
                        </Label>
                        <Input
                          name={field.name}
                          placeholder="Toyota"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isSubmitting}
                          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                        />
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="vehicleModel">
                    {(field) => (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                          Model
                        </Label>
                        <Input
                          name={field.name}
                          placeholder="Camry"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isSubmitting}
                          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                        />
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="vehicleYear" validators={{}}>
                    {(field) => (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                          Year
                        </Label>
                        <Input
                          type="text"
                          name={field.name}
                          placeholder="2022"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isSubmitting}
                          className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                            field.state.meta.errors.length
                              ? "border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
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
                  <form.Field name="otherVehiclesCount">
                    {(field) => (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                          Other Vehicles Involved
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                          disabled={isSubmitting}
                          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                        />
                      </div>
                    )}
                  </form.Field>
                  <form.Field name="witnessCount">
                    {(field) => (
                      <div>
                        <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                          Witnesses Present
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(parseInt(e.target.value) || 0)
                          }
                          disabled={isSubmitting}
                          className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
                        />
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                  <form.Field name="injuriesReported">
                    {(field) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="injuries"
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
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
                    )}
                  </form.Field>

                  <form.Subscribe
                    selector={(state) => [state.values.injuriesReported]}
                  >
                    {([injuriesReported]) =>
                      injuriesReported && (
                        <form.Field
                          name="injuriesDescription"
                          validators={{
                            onChange: ({ value }) =>
                              !value
                                ? "Injury description is required"
                                : undefined,
                          }}
                        >
                          {(field) => (
                            <div>
                              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                                Describe injuries *
                              </Label>
                              <Textarea
                                name={field.name}
                                placeholder="Describe any injuries..."
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                disabled={isSubmitting}
                                className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                                  field.state.meta.errors.length
                                    ? "border-red-500 focus:ring-red-500"
                                    : ""
                                }`}
                              />
                              {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                  {field.state.meta.errors.join(", ")}
                                </p>
                              )}
                            </div>
                          )}
                        </form.Field>
                      )
                    }
                  </form.Subscribe>

                  <form.Field name="airbagDeployed">
                    {(field) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="airbag"
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
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
                    )}
                  </form.Field>

                  <form.Field name="rollover">
                    {(field) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rollover"
                          name={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked === true)
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
                    )}
                  </form.Field>
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
                      <div
                        key={index}
                        className="relative group rounded-md overflow-hidden bg-slate-100 aspect-square"
                      >
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
      )}
    </form.Subscribe>
  );
}
