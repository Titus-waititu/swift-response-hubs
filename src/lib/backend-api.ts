import type {
  IncidentReport,
  IncidentStatus,
  IncidentType,
  SeverityLevel,
} from "@/types/incident";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "https://smartresponse-api.onrender.com/api/v1";

type BackendUserRole = "admin" | "user" | "officer" | "emergency_responder";
type BackendAccidentSeverity = "minor" | "moderate" | "severe" | "fatal";
type BackendAccidentStatus =
  | "reported"
  | "under_investigation"
  | "resolved"
  | "closed";

interface BackendUser {
  id: string;
  fullName: string;
  email: string;
  role: BackendUserRole;
  isActive: boolean;
  phoneNumber?: string;
}

interface BackendAuthResponse {
  success: boolean;
  message: string;
  user?: BackendUser;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

interface BackendCreateUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: BackendUserRole;
}

interface BackendAccident {
  id: string;
  reportNumber: string;
  description: string;
  severity: BackendAccidentSeverity;
  status: BackendAccidentStatus;
  latitude: number;
  longitude: number;
  locationAddress: string;
  accidentDate: string;
  weatherConditions?: string;
  roadConditions?: string;
  numberOfVehicles?: number;
  numberOfInjuries?: number;
  numberOfFatalities?: number;
  reportedById: string;
  assignedOfficerId?: string;
  reportedBy?: BackendUser;
  assignedOfficer?: BackendUser;
  createdAt: string;
  updatedAt: string;
}

interface BackendCreateAccidentResult {
  accident: BackendAccident;
}

function getHeaders(token?: string) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : ((payload as { message?: string | string[] }).message ??
          "Request failed");

    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return payload as T;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function generatePrototypePassword(role: BackendUserRole) {
  return `Swift-${role}-Password123!`;
}

function mapSeverityFromBackend(
  severity: BackendAccidentSeverity,
): SeverityLevel {
  switch (severity) {
    case "fatal":
      return "Critical";
    case "severe":
      return "High";
    case "moderate":
      return "Medium";
    case "minor":
    default:
      return "Low";
  }
}

function mapSeverityToBackend(
  severity: SeverityLevel,
): BackendAccidentSeverity {
  switch (severity) {
    case "Critical":
      return "fatal";
    case "High":
      return "severe";
    case "Medium":
      return "moderate";
    case "Low":
    default:
      return "minor";
  }
}

function mapStatusFromBackend(status: BackendAccidentStatus): IncidentStatus {
  switch (status) {
    case "under_investigation":
      return "under_investigation";
    case "resolved":
      return "resolved";
    case "closed":
      return "closed";
    case "reported":
    default:
      return "reported";
  }
}

export function mapStatusToBackend(
  status: IncidentStatus,
): BackendAccidentStatus {
  switch (status) {
    case "resolved":
      return "resolved";
    case "closed":
      return "closed";
    case "under_investigation":
      return "under_investigation";
    case "in_progress":
      return "under_investigation"; // No in_progress in backend, map to under_investigation
    case "reported":
    default:
      return "reported";
  }
}

function inferIncidentType(description: string): IncidentType {
  const normalized = description.toLowerCase();

  if (normalized.includes("motorcycle")) {
    return "Motorcycle Accident";
  }
  if (normalized.includes("pedestrian")) {
    return "Pedestrian Hit";
  }
  if (normalized.includes("fire")) {
    return "Fire Accident";
  }
  if (normalized.includes("medical")) {
    return "Medical Emergency";
  }
  if (normalized.includes("collapse")) {
    return "Building Collapse";
  }
  if (normalized.includes("industrial") || normalized.includes("workplace")) {
    return "Industrial or Workplace Accident";
  }
  if (
    normalized.includes("road") ||
    normalized.includes("traffic") ||
    normalized.includes("vehicle")
  ) {
    return "Road Traffic Accident";
  }

  return "Other";
}

export function mapBackendAccidentToIncident(
  accident: BackendAccident,
): IncidentReport {
  return {
    report_id: accident.reportNumber,
    backend_accident_id: accident.id,
    backend_report_number: accident.reportNumber,
    status: mapStatusFromBackend(accident.status),
    reporter_name: accident.reportedBy?.fullName || "Backend Reporter",
    phone_number: accident.reportedBy?.phoneNumber || "Not provided",
    email: accident.reportedBy?.email,
    incident_type: inferIncidentType(accident.description),
    severity_level: mapSeverityFromBackend(accident.severity),
    short_description: accident.description,
    number_of_victims: accident.numberOfInjuries,
    vehicles_involved: accident.numberOfVehicles,
    gps_latitude: Number(accident.latitude),
    gps_longitude: Number(accident.longitude),
    location_address: accident.locationAddress,
    photos: [],
    time_of_incident: accident.accidentDate,
    time_report_submitted: accident.createdAt,
    created_at: accident.createdAt,
    updated_at: accident.updatedAt,
    resolved_time:
      accident.status === "resolved" || accident.status === "closed"
        ? accident.updatedAt
        : undefined,
    reportedById: accident.reportedById,
  };
}

async function createBasicBackendAccident(input: {
  description: string;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationAddress: string;
  accidentDate: string;
  reportedById: string;
  token: string;
  numberOfVehicles?: number;
  numberOfInjuries?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/accidents`, {
    method: "POST",
    headers: getHeaders(input.token),
    body: JSON.stringify({
      description: input.description,
      severity: mapSeverityToBackend(input.severity),
      latitude: input.latitude,
      longitude: input.longitude,
      locationAddress: input.locationAddress,
      accidentDate: input.accidentDate,
      reportedById: input.reportedById,
      ...(typeof input.numberOfVehicles === "number"
        ? { numberOfVehicles: input.numberOfVehicles }
        : {}),
      ...(typeof input.numberOfInjuries === "number"
        ? { numberOfInjuries: input.numberOfInjuries }
        : {}),
    }),
  });

  return parseResponse<BackendAccident>(response);
}

async function createUserAccount(payload: {
  fullName: string;
  email: string;
  username: string;
  password: string;
  role: BackendUserRole;
  phoneNumber?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse<BackendCreateUserResponse>(response);
}

export { createUserAccount };

export async function signInToBackend(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  return parseResponse<BackendAuthResponse>(response);
}

export async function ensurePrototypeUserSession(input: {
  email: string;
  password: string;
  fullName: string;
  role: BackendUserRole;
  phoneNumber?: string;
}) {
  try {
    const signInResult = await signInToBackend(input.email, input.password);
    if (signInResult.success && signInResult.user && signInResult.tokens) {
      return signInResult;
    }
  } catch {
    // Expected when the prototype user does not exist yet.
  }

  await createUserAccount({
    fullName: input.fullName,
    email: input.email,
    username: slugify(
      input.fullName || input.email.split("@")[0] || input.role,
    ),
    password: input.password,
    role: input.role,
    phoneNumber: input.phoneNumber,
  });

  const secondSignIn = await signInToBackend(input.email, input.password);
  if (!secondSignIn.success || !secondSignIn.user || !secondSignIn.tokens) {
    throw new Error(secondSignIn.message || "Backend sign-in failed");
  }

  return secondSignIn;
}

export async function createBackendAccidentReport(input: {
  description: string;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationAddress: string;
  accidentDate: string;
  reporterName: string;
  reporterEmail?: string;
  phoneNumber?: string;
  numberOfVehicles?: number;
  numberOfInjuries?: number;
}) {
  const reporterEmail =
    input.reporterEmail?.trim().toLowerCase() ||
    `${slugify(input.reporterName || "reporter")}-${Date.now()}@swift.local`;
  const reporterPassword = generatePrototypePassword("user");

  const userSession = await ensurePrototypeUserSession({
    email: reporterEmail,
    password: reporterPassword,
    fullName: input.reporterName || "Public Reporter",
    role: "user",
    phoneNumber: input.phoneNumber,
  });

  const formData = new FormData();
  formData.append("description", input.description);
  formData.append("severity", mapSeverityToBackend(input.severity));
  formData.append("latitude", String(input.latitude));
  formData.append("longitude", String(input.longitude));
  formData.append("locationAddress", input.locationAddress);
  formData.append("accidentDate", input.accidentDate);
  formData.append("reportedById", userSession.user!.id);

  if (typeof input.numberOfVehicles === "number") {
    formData.append("numberOfVehicles", String(input.numberOfVehicles));
  }
  if (typeof input.numberOfInjuries === "number") {
    formData.append("numberOfInjuries", String(input.numberOfInjuries));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/accidents/report`, {
      method: "POST",
      body: formData,
    });

    return await parseResponse<BackendCreateAccidentResult>(response);
  } catch {
    const accident = await createBasicBackendAccident({
      description: input.description,
      severity: input.severity,
      latitude: input.latitude,
      longitude: input.longitude,
      locationAddress: input.locationAddress,
      accidentDate: input.accidentDate,
      reportedById: userSession.user!.id,
      token: userSession.tokens!.accessToken,
      numberOfVehicles: input.numberOfVehicles,
      numberOfInjuries: input.numberOfInjuries,
    });

    return { accident };
  }
}

export async function fetchBackendAccidents(token: string) {
  const response = await fetch(`${API_BASE_URL}/accidents`, {
    headers: getHeaders(token),
  });

  return parseResponse<BackendAccident[]>(response);
}

export async function updateBackendAccidentStatus(input: {
  accidentId: string;
  status: IncidentStatus;
  token: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/accidents/${input.accidentId}/status`,
    {
      method: "PATCH",
      headers: getHeaders(input.token),
      body: JSON.stringify({
        status: mapStatusToBackend(input.status),
      }),
    },
  );

  return parseResponse<BackendAccident>(response);
}

/**
 * Submit a public accident report (for users without accounts)
 * Creates a temporary guest account if needed
 */
export async function submitPublicAccidentReport(input: {
  description: string;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationAddress: string;
  accidentDate: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  numberOfVehicles?: number;
  numberOfInjuries?: number;
}) {
  try {
    // Try to get or create a guest user for this report
    const guestEmail = `public-${Date.now()}@emergency.local`;
    const guestPassword = `Public-${Math.random().toString(36).slice(2, 10)}!`;

    let userId: string;

    try {
      // Try to create a new guest account
      const userResult = await createUserAccount({
        fullName: input.reporterName,
        email: guestEmail,
        username: `public_${Date.now()}`,
        password: guestPassword,
        role: "user",
        phoneNumber: input.reporterPhone,
      });
      userId = userResult.id;
    } catch (userError) {
      // If user creation fails, try with a common public user
      console.warn(
        "Failed to create guest user, attempting fallback:",
        userError,
      );
      userId = "public-user";
    }

    // Now submit the accident report
    const response = await fetch(`${API_BASE_URL}/accidents`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        description: `${input.description}\n\nReporter: ${input.reporterName}\nEmail: ${input.reporterEmail}\nPhone: ${input.reporterPhone}`,
        severity: mapSeverityToBackend(input.severity),
        latitude: Number(input.latitude),
        longitude: Number(input.longitude),
        locationAddress: input.locationAddress,
        accidentDate: input.accidentDate,
        reportedById: userId,
        ...(typeof input.numberOfVehicles === "number"
          ? { numberOfVehicles: input.numberOfVehicles }
          : {}),
        ...(typeof input.numberOfInjuries === "number"
          ? { numberOfInjuries: input.numberOfInjuries }
          : {}),
      }),
    });

    return parseResponse<BackendAccident>(response);
  } catch (error) {
    console.error("Error submitting public accident report:", error);
    throw error;
  }
}

/**
 * Initiates Google OAuth flow by redirecting to backend
 * The backend handles OAuth exchange and redirects back with tokens
 */
export const loginWithGoogle = () => {
  // Redirect to backend Google OAuth endpoint
  // Backend will handle the OAuth flow and redirect to /auth/google/callback
  window.location.href = `${API_BASE_URL}/auth/google`;
};
