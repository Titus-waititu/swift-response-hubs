/**
 * API Response Types for all backend endpoints
 * Maps to the role-based dashboard functionalities
 */

import type { IncidentReport } from "./incident";

// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAccidents: number;
  resolvedAccidents: number;
  averageResponseTime: number; // minutes
  criticalIncidentsToday: number;
  systemHealth: "healthy" | "degraded" | "critical";
  uptime: number; // percentage
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    ADMIN: number;
    OFFICER: number;
    RESPONDER: number;
    USER: number;
  };
  newUsersThisMonth: number;
}

export interface DispatchStats {
  activeDispatches: number;
  pendingDispatches: number;
  completedDispatchesToday: number;
  averageDispatchTime: number; // minutes
  responseTimeByType: Record<string, number>;
}

export interface ReportStats {
  totalReports: number;
  submittedReports: number;
  underReview: number;
  approvedReports: number;
  rejectedReports: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "USER" | "OFFICER" | "RESPONDER" | "ADMIN";
  phone?: string;
  department?: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface ListUserResponse {
  users: UserProfile[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ActiveDispatch {
  id: string;
  accidentId: string;
  responder: UserProfile;
  status: "pending" | "dispatched" | "en_route" | "on_scene" | "completed";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location: string;
  createdAt: string;
  eta?: number; // minutes
}

export interface EmergencyService {
  id: string;
  name: string;
  type: "ambulance" | "fire" | "police" | "hazmat" | "other";
  location: string;
  phone: string;
  email?: string;
  operationalStatus: "active" | "busy" | "offline";
  averageResponseTime: number; // minutes
  coverage?: {
    latitude: number;
    longitude: number;
    radiusMiles: number;
  };
}

// ============================================================================
// OFFICER DASHBOARD TYPES
// ============================================================================

export interface AssignedAccident extends IncidentReport {
  assignedOfficerId: string;
  investigationNotes?: string;
  evidenceUrls: string[];
  mediaUrls: string[];
  aiExtractedData?: Record<string, unknown>;
  aiSeverityScore?: string;
  aiRecommendations?: string[];
}

export interface VehicleData {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vin?: string;
  owner: string;
  damageAssessment?: string;
  damagePhotos?: string[];
}

export interface MediaItem {
  id: string;
  accidentId: string;
  type: "photo" | "video" | "document";
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
}

export interface AIAnalysisResult {
  type:
    | "ocr"
    | "severity"
    | "accident_analysis"
    | "report_generation"
    | "insights";
  data: Record<string, unknown>;
  confidence?: number;
  timestamp: string;
  performedBy?: string;
}

// ============================================================================
// RESPONDER DASHBOARD TYPES
// ============================================================================

export interface DispatchAssignment {
  id: string;
  accidentId: string;
  responderId: string;
  status: "pending" | "accepted" | "en_route" | "on_scene" | "completed";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  estimatedTime: number; // minutes
  dispatchedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  briefing?: string;
  equipment?: string[];
}

export interface IncidentBriefing {
  accidentId: string;
  severity: string;
  location: string;
  description: string;
  injuriesReported: number;
  hazards: string[];
  requiredEquipment: string[];
  estimatedVictims: number;
  accessInfo?: string;
  specialInstructions?: string;
  aiGeneratedInsights?: string;
}

export interface LocationData {
  id: string;
  accidentId: string;
  address: string;
  latitude: number;
  longitude: number;
  roadType: "highway" | "street" | "parking" | "other";
  weatherConditions?: string;
  trafficConditions?: string;
  accessPoints?: string[];
  hazards?: string[];
}

// ============================================================================
// USER DASHBOARD TYPES
// ============================================================================

export interface UserVehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  registrationExpiry?: string;
}

export interface AccidentReportForm {
  description: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  vehicleInvolved: {
    licensePlate: string;
    make: string;
    model: string;
    year?: number;
  };
  otherVehicles?: Array<{
    licensePlate?: string;
    description: string;
  }>;
  witnesses: number;
  mediaFiles: File[];
  injuries: {
    reported: boolean;
    description?: string;
  };
  airbagDeployed: boolean;
  rollover: boolean;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: "dispatch_update" | "officer_update" | "status_change" | "general";
  title: string;
  message: string;
  relatedAccidentId?: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ============================================================================
// SHARED/COMMON TYPES
// ============================================================================

export interface AnalyticsDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
