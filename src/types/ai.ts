/**
 * AI-related types and interfaces for the Smart Accident Report System
 */

export interface AIExtractTextRequest {
  imageUrl: string;
//   mediaType:
//     | "license_plate"
//     | "drivers_license"
//     | "id_card"
//     | "passport"
//     | "insurance_card"
//     | "general";
//   language?: string;
}

export interface AIExtractTextResponse {
  success: boolean;
  extractedData: {
    licensePlate?: string;
    driverId?: string;
    name?: string;
    dateOfBirth?: string;
    address?: string;
    insuranceCompany?: string;
    policyNumber?: string;
    rawText: string;
    confidence: number; // 0-100
  };
  error?: string;
}

export interface AISeverityClassificationRequest {
  description: string;
  reportedInjuries?: string[];
  vehicleCount?: number;
  hasAirbagDeployed?: boolean;
  hasRollover?: boolean;
  hasEntrapment?: boolean;
  extractedOCRData?: Record<string, unknown>;
  location?: string;
  time?: string;
}

export interface AISeverityClassificationResponse {
  success: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dispatchRecommendation: string[]; // e.g., ["ambulance", "fire", "police"]
  justification: string;
  confidenceScore: number; // 0-100
  estimatedResponseTime?: number; // minutes
  requiredEquipment?: string[];
  error?: string;
}

export interface AIAccidentAnalysisRequest {
  accidentDescription: string;
  locationData?: {
    latitude: number;
    longitude: number;
    address: string;
    intersection?: string;
  };
  vehicleData?: Array<{
    make: string;
    model: string;
    year?: number;
    licensePlate?: string;
    damage?: string;
  }>;
  mediaUrls?: string[];
  witnesses?: number;
  reportedSeverity?: string;
}

export interface AIAccidentAnalysisResponse {
  success: boolean;
  analysis: {
    likelyRootCause: string;
    estimatedDamageLevel: "minimal" | "moderate" | "severe";
    safetyRisks: string[];
    environmentalFactors: string[];
    recommendedActions: string[];
  };
  similarPastIncidents?: Array<{
    incidentId: string;
    date: string;
    location: string;
    outcome: string;
    similarity: number; // 0-100
  }>;
  error?: string;
}

export interface AIReportGenerationRequest {
  accidentId: string;
  userInitialReport: string;
  officerNotes?: string;
  vehicleData?: Record<string, unknown>;
  locationData?: Record<string, unknown>;
  mediaUrls?: string[];
  extractedOCRData?: Record<string, unknown>;
  reportTemplate?: "police" | "insurance" | "general";
  includePhotos?: boolean;
}

export interface AIReportGenerationResponse {
  success: boolean;
  reportMarkdown: string;
  reportHTML?: string;
  sections: {
    overview: string;
    partiesInvolved: string;
    vehiclesInvolved: string;
    environmentalConditions: string;
    preliminaryAssessment: string;
    recommendations: string;
  };
  generationTimeMs: number;
  error?: string;
}

export interface AIInsightsRequest {
  accidentId: string;
  includeHistoricalContext?: boolean;
  includePredictiveAnalysis?: boolean;
}

export interface AIInsightsResponse {
  success: boolean;
  insights: {
    predictedSeverity: string;
    requiredServices: string[];
    locationRiskScore: number; // 0-100
    similarIncidentCount: number;
    recommendedStrategy: string;
    historicalContext?: string;
    estimatedResolutionTime?: number; // hours
  };
  riskFactors?: string[];
  recommendations?: string[];
  error?: string;
}

export interface AIHealthCheckResponse {
  status: "healthy" | "degraded" | "unavailable";
  services: {
    ocr: boolean;
    classification: boolean;
    analysis: boolean;
    reportGeneration: boolean;
    insights: boolean;
  };
  lastChecked: string;
}
