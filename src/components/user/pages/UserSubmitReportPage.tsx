import { useState, useEffect, useRef } from "react";
import { Upload, AlertCircle, Loader2, ImagePlus, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateAccidentReport } from "@/hooks/useAccidents";
import { useUpdateUser } from "@/hooks/useUsers";
import { useAuthStore } from "@/stores/authStore";
import { classifySeverity, convertAISeverityToEnum } from "@/lib/ai-service";
import { AccidentSeverity } from "@/types/incident";
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [vehicleLicensePlate, setVehicleLicensePlate] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [otherVehiclesCount, setOtherVehiclesCount] = useState(0);
  const [witnessCount, setWitnessCount] = useState(0);
  const [injuriesReported, setInjuriesReported] = useState(false);
  const [injuriesDescription, setInjuriesDescription] = useState("");
  const [airbagDeployed, setAirbagDeployed] = useState(false);
  const [rollover, setRollover] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createReport = useCreateAccidentReport();
  const updateUser = useUpdateUser();
  const { user } = useAuthStore();

  const requestLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
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
    // Attempt to grab geolocation automatically on mount
    requestLocation();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const formData: UserSubmitReportFormValues = {
        phoneNumber,
        description,
        location,
        latitude,
        longitude,
        vehicleLicensePlate,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        otherVehiclesCount,
        witnessCount,
        injuriesReported,
        injuriesDescription,
        airbagDeployed,
        rollover,
        mediaFiles,
      };

      // Validate with Zod
      await userSubmitReportSchema.parseAsync(formData);

      console.log("Submitting accident report:", formData);

      // Use AI to determine severity level based on accident details
      toast.loading("Analyzing accident severity...");
      const severityAnalysis = await classifySeverity({
        description,
        reportedInjuries: injuriesReported
          ? [injuriesDescription || "Injuries reported"]
          : [],
        vehicleCount: otherVehiclesCount + 1, // +1 for primary vehicle
        hasAirbagDeployed: airbagDeployed,
        hasRollover: rollover,
        location,
      });

      const determinedSeverity = convertAISeverityToEnum(severityAnalysis);

      console.log(
        `AI Analysis: ${severityAnalysis.classification} (${severityAnalysis.severity}) -> ${determinedSeverity}`,
        severityAnalysis,
      );

      // Create FormData payload matching backend API contract
      const requestBody = new FormData();
      requestBody.append("description", description);
      requestBody.append("location", location);
      requestBody.append("latitude", String(parseFloat(latitude || "0")));
      requestBody.append("longitude", String(parseFloat(longitude || "0")));
      // userId is optional
      if (user?.id) {
        requestBody.append("userId", user.id);
      }

      console.log("🚨 FormData being sent to API:", {
        description,
        location,
        latitude: parseFloat(latitude || "0"),
        longitude: parseFloat(longitude || "0"),
        userId: user?.id,
      });
      console.log("📊 Frontend AI determined severity:", determinedSeverity);

      // Submit the accident report using fetch directly (bypass axios header issues with FormData)
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://smartresponse-api.onrender.com/api/v1";
      const response = await fetch(`${apiBaseUrl}/accidents/report`, {
        method: "POST",
        body: requestBody,
        headers: {
          // Don't set Content-Type - let browser auto-detect as multipart/form-data
          Authorization: `Bearer ${useAuthStore.getState().accessToken || ""}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();

      // Update user's phone number if provided and user is authenticated
      if (phoneNumber && user?.id) {
        await updateUser.mutateAsync({
          id: user.id,
          data: { phoneNumber },
        });
      }

      if (onSubmit) {
        onSubmit(formData);
      }
      toast.dismiss();
      toast.success(
        `Report submitted successfully! Severity: ${determinedSeverity}. ${severityAnalysis.justification}`,
      );

      // Reset form
      setPhoneNumber("");
      setDescription("");
      setLocation("");
      setVehicleLicensePlate("");
      setVehicleMake("");
      setVehicleModel("");
      setVehicleYear("");
      setOtherVehiclesCount(0);
      setWitnessCount(0);
      setInjuriesReported(false);
      setInjuriesDescription("");
      setAirbagDeployed(false);
      setRollover(false);
      setMediaFiles([]);
      setMediaPreviews([]);
    } catch (error: any) {
      toast.dismiss();
      if (error.errors && Array.isArray(error.errors)) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const fieldName = err.path.join(".");
          errors[fieldName] = err.message;
        });
        setFieldErrors(errors);
      } else {
        console.error(error);
        toast.error("Failed to submit report.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...mediaFiles, ...newFiles];
      setMediaFiles(updatedFiles);

      // Create previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index]);

    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);

    const updatedPreviews = [...mediaPreviews];
    updatedPreviews.splice(index, 1);
    setMediaPreviews(updatedPreviews);
  };

  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                Phone Number
              </Label>
              <Input
                placeholder="+1 (555) 123-4567"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
                className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                  fieldErrors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {fieldErrors.phoneNumber && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {fieldErrors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                What happened? *
              </Label>
              <Textarea
                placeholder="Describe the incident in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 h-32 ${
                  fieldErrors.description
                    ? "border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {fieldErrors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {fieldErrors.description}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isSubmitting}
                  className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                    fieldErrors.location
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {fieldErrors.location && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {fieldErrors.location}
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
              ) : latitude && longitude ? (
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
                value={vehicleLicensePlate}
                onChange={(e) => setVehicleLicensePlate(e.target.value)}
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
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
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
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
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
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
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
                  value={otherVehiclesCount}
                  onChange={(e) =>
                    setOtherVehiclesCount(parseInt(e.target.value) || 0)
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
                  value={witnessCount}
                  onChange={(e) =>
                    setWitnessCount(parseInt(e.target.value) || 0)
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
                  checked={injuriesReported}
                  onCheckedChange={(checked) =>
                    setInjuriesReported(checked as boolean)
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

              {injuriesReported && (
                <div>
                  <Label className="text-slate-700 dark:text-slate-300 mb-2 block">
                    Describe injuries *
                  </Label>
                  <Textarea
                    placeholder="Describe any injuries..."
                    value={injuriesDescription}
                    onChange={(e) => setInjuriesDescription(e.target.value)}
                    disabled={isSubmitting}
                    className={`bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 ${
                      fieldErrors.injuriesDescription
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {fieldErrors.injuriesDescription && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {fieldErrors.injuriesDescription}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="airbag"
                  checked={airbagDeployed}
                  onCheckedChange={(checked) =>
                    setAirbagDeployed(checked as boolean)
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
                  checked={rollover}
                  onCheckedChange={(checked) => setRollover(checked as boolean)}
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
                {mediaFiles?.length || 0} file(s) selected
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
  );
}
