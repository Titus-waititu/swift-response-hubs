import { z } from "zod";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/types/incident";

// ============================================================================
// AUTH FORMS
// ============================================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// REPORT FORMS
// ============================================================================

// Main report form (ReportPage)
export const reportFormSchema = z.object({
  reporter_name: z
    .string()
    .min(1, "Reporter name is required")
    .max(100, "Name must be less than 100 characters"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-+()]{7,}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  incident_type: z.enum(INCIDENT_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select an incident type" }),
  }),
  severity_level: z.enum(SEVERITY_LEVELS as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a severity level" }),
  }),
  short_description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  number_of_victims: z
    .string()
    .min(1, "Number of victims is required")
    .regex(/^\d+$/, "Must be a number")
    .transform(Number)
    .refine((n) => n >= 0, "Number of victims cannot be negative"),
  vehicles_involved: z
    .string()
    .min(1, "Number of vehicles is required")
    .regex(/^\d+$/, "Must be a number")
    .transform(Number)
    .refine((n) => n >= 0, "Number of vehicles cannot be negative"),
  gps_latitude: z
    .string()
    .min(1, "Latitude is required")
    .regex(/^-?\d+\.?\d*$/, "Invalid latitude format")
    .refine((lat) => {
      const n = parseFloat(lat);
      return n >= -90 && n <= 90;
    }, "Latitude must be between -90 and 90"),
  gps_longitude: z
    .string()
    .min(1, "Longitude is required")
    .regex(/^-?\d+\.?\d*$/, "Invalid longitude format")
    .refine((lng) => {
      const n = parseFloat(lng);
      return n >= -180 && n <= 180;
    }, "Longitude must be between -180 and 180"),
  location_address: z
    .string()
    .min(1, "Location address is required")
    .min(5, "Location address must be at least 5 characters")
    .max(500, "Location address must be less than 500 characters"),
  time_of_incident: z.string().min(1, "Time of incident is required"),
  photos: z.array(z.instanceof(File)).optional().default([]),
});

export type ReportFormValues = z.infer<typeof reportFormSchema>;

// User submit accident report form
export const userSubmitReportSchema = z
  .object({
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[\d\s\-+()]+$/.test(val),
        "Invalid phone number format",
      )
      .refine(
        (val) => !val || val.replace(/\D/g, "").length >= 10,
        "Phone number must be at least 10 digits",
      ),
    description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must be less than 2000 characters"),
    location: z
      .string()
      .min(1, "Location is required")
      .min(5, "Location must be at least 5 characters")
      .max(500, "Location must be less than 500 characters"),
    latitude: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const n = parseFloat(val);
        return !isNaN(n) && n >= -90 && n <= 90;
      }, "Invalid latitude"),
    longitude: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const n = parseFloat(val);
        return !isNaN(n) && n >= -180 && n <= 180;
      }, "Invalid longitude"),
    vehicleLicensePlate: z
      .string()
      .optional()
      .default("")
      .refine(
        (val) => !val || val.length >= 2,
        "License plate must be at least 2 characters",
      ),
    vehicleMake: z
      .string()
      .optional()
      .default("")
      .refine(
        (val) => !val || val.length <= 100,
        "Make must be less than 100 characters",
      ),
    vehicleModel: z
      .string()
      .optional()
      .default("")
      .refine(
        (val) => !val || val.length <= 100,
        "Model must be less than 100 characters",
      ),
    vehicleYear: z
      .string()
      .optional()
      .default("")
      .refine((val) => {
        if (!val) return true;
        const year = parseInt(val);
        const currentYear = new Date().getFullYear();
        return !isNaN(year) && year >= 1900 && year <= currentYear + 1;
      }, "Year must be between 1900 and current year"),
    otherVehiclesCount: z
      .number()
      .min(0, "Cannot be negative")
      .max(999, "Number too large")
      .default(0),
    witnessCount: z
      .number()
      .min(0, "Cannot be negative")
      .max(999, "Number too large")
      .default(0),
    injuriesReported: z.boolean().default(false),
    injuriesDescription: z
      .string()
      .optional()
      .default("")
      .refine((val) => {
        // If injuries are reported, description is required
        // This will be handled in refine below
        return true;
      }),
    airbagDeployed: z.boolean().default(false),
    rollover: z.boolean().default(false),
    mediaFiles: z.array(z.instanceof(File)).optional().default([]),
  })
  .refine(
    (data) => {
      // If injuries are reported, description must be provided
      if (
        data.injuriesReported &&
        data.injuriesDescription &&
        typeof data.injuriesDescription === "string" &&
        !data.injuriesDescription.trim()
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Injury description is required when injuries are reported",
      path: ["injuriesDescription"],
    },
  );

export type UserSubmitReportFormValues = z.infer<typeof userSubmitReportSchema>;

// ============================================================================
// DASHBOARD FORMS (for edit/update operations)
// ============================================================================

export const dashboardFilterSchema = z.object({
  status: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  searchQuery: z.string().optional().default(""),
  incidentType: z.string().optional(),
});

export type DashboardFilterValues = z.infer<typeof dashboardFilterSchema>;
