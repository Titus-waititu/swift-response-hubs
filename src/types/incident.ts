export type IncidentStatus =
  | "Submitted"
  | "Under Review"
  | "Dispatched"
  | "In Progress"
  | "Accepted"
  | "En Route"
  | "On Scene"
  | "Resolved"
  | "Completed"
  | "Closed";

export type IncidentType =
  | "Road Traffic Accident"
  | "Motorcycle Accident"
  | "Pedestrian Hit"
  | "Fire Accident"
  | "Industrial or Workplace Accident"
  | "Building Collapse"
  | "Medical Emergency"
  | "Other";

export type SeverityLevel = "Critical" | "High" | "Medium" | "Low";

export type UserRole =
  | "Public Reporter"
  | "Responder"
  | "Dispatcher"
  | "Super Admin";

export interface IncidentReport {
  report_id: string;
  backend_accident_id?: string;
  backend_report_number?: string;
  status: IncidentStatus;
  reporter_name: string;
  phone_number: string;
  phone_number_reporter?: string;
  email?: string;
  incident_type: IncidentType;
  severity_level: SeverityLevel;
  short_description: string;
  detailed_description?: string;
  number_of_victims?: number;
  vehicles_involved?: number;
  number_of_vehicles?: number;
  gps_latitude: number;
  gps_longitude: number;
  latitude?: number;
  longitude?: number;
  location_address: string;
  photos: string[];
  image_urls?: string[];
  time_of_incident: string;
  time_report_submitted: string;
  created_at: string;
  updated_at: string;
  resolved_time?: string;
  ai_insights?: string;
  assigned_to?: string;
}

export const INCIDENT_TYPES: IncidentType[] = [
  "Road Traffic Accident",
  "Motorcycle Accident",
  "Pedestrian Hit",
  "Fire Accident",
  "Industrial or Workplace Accident",
  "Building Collapse",
  "Medical Emergency",
  "Other",
];

export const SEVERITY_LEVELS: SeverityLevel[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

export const STATUS_FLOW: IncidentStatus[] = [
  "Submitted",
  "Under Review",
  "Resolved",
  "Closed",
];
