import { useState } from "react";
import {
  FileText,
  Image,
  Wand2,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  extractText,
  classifySeverity,
  generateReport,
  analyzeAccident,
} from "@/lib/ai-service";
import type { IncidentReport } from "@/types/incident";

interface AIInvestigationAssistantProps {
  incident: IncidentReport;
}

export default function AIInvestigationAssistant({
  incident,
}: AIInvestigationAssistantProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, unknown>>(
    {},
  );
  const [severity, setSeverity] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleExtractText = async () => {
    setLoading(true);
    try {
      // Mock: extract from license plate image
      const result = await extractText({
        imageUrl: "https://demo.com/image.jpg",
      });
      if (result.success) {
        setExtractedData(result.extractedData);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClassifySeverity = async () => {
    setLoading(true);
    try {
      const result = await classifySeverity({
        description: incident.description || "Incident reported",
        reportedInjuries: ["Unknown"],
        vehicleCount: 2,
      });
      if (result.success) {
        setSeverity(result.severity);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAccident = async () => {
    setLoading(true);
    try {
      const result = await analyzeAccident({
        accidentDescription: incident.description || "Incident reported",
        locationData: incident.location
          ? {
              latitude: 0,
              longitude: 0,
              address: incident.location,
            }
          : undefined,
      });
      if (result.success) {
        setAnalysis(JSON.stringify(result.analysis, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const result = await generateReport({
        accidentId: incident.id,
        userInitialReport: incident.description || "Incident reported",
        reportTemplate: "police",
      });
      if (result.success) {
        setGeneratedReport(result.reportMarkdown);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          AI Investigation Assistant
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Incident ID: {incident.id}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={handleExtractText}
          disabled={loading}
          variant="outline"
          className="justify-start h-auto p-4 flex-col items-start"
        >
          <Image className="h-5 w-5 mb-2" />
          <span className="text-sm font-medium">Extract Text</span>
          <span className="text-xs text-slate-500">OCR from images</span>
        </Button>
        <Button
          onClick={handleClassifySeverity}
          disabled={loading}
          variant="outline"
          className="justify-start h-auto p-4 flex-col items-start"
        >
          <AlertCircle className="h-5 w-5 mb-2" />
          <span className="text-sm font-medium">Classify Severity</span>
          <span className="text-xs text-slate-500">AI assessment</span>
        </Button>
        <Button
          onClick={handleAnalyzeAccident}
          disabled={loading}
          variant="outline"
          className="justify-start h-auto p-4 flex-col items-start"
        >
          <Wand2 className="h-5 w-5 mb-2" />
          <span className="text-sm font-medium">Analyze</span>
          <span className="text-xs text-slate-500">Deep analysis</span>
        </Button>
        <Button
          onClick={handleGenerateReport}
          disabled={loading}
          variant="outline"
          className="justify-start h-auto p-4 flex-col items-start"
        >
          <FileText className="h-5 w-5 mb-2" />
          <span className="text-sm font-medium">Generate Report</span>
          <span className="text-xs text-slate-500">Auto-draft</span>
        </Button>
      </div>

      {/* Results Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
          <TabsTrigger value="severity">Severity</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="report">Generated Report</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Incident Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Type
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-50 mt-1">
                    {incident.incident_type}
                  </p>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Severity
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {incident.severity_level}
                  </Badge>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Status
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {incident.status}
                  </Badge>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-900">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Location
                  </p>
                  <p className="font-medium text-slate-900 dark:text-slate-50 mt-1 text-sm truncate">
                    {incident.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Extracted Data Tab */}
        <TabsContent value="extracted">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                OCR Extracted Data
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Text extracted from images using AI OCR
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              )}
              {Object.keys(extractedData).length > 0 ? (
                <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded text-xs overflow-auto text-slate-900 dark:text-slate-50">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  No extracted data yet. Click "Extract Text" to begin.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Severity Tab */}
        <TabsContent value="severity">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                AI Severity Classification
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Automated severity assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader className="h-4 w-4 animate-spin" />
                  Classifying...
                </div>
              )}
              {severity ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Classified Severity
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-2">
                      {severity}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm font-medium text-green-900 dark:text-green-300">
                      ✓ Classification complete. Review and confirm before
                      updating incident record.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  No classification yet. Click "Classify Severity" to begin.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Comprehensive Analysis
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Deep AI-powered incident analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader className="h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              )}
              {analysis ? (
                <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded text-xs overflow-auto text-slate-900 dark:text-slate-50">
                  {analysis}
                </pre>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  No analysis yet. Click "Analyze" to begin.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Report Tab */}
        <TabsContent value="report">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 dark:text-slate-50">
                    AI-Generated Report
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Auto-draft report (requires officer review & approval)
                  </CardDescription>
                </div>
                {generatedReport && (
                  <Badge
                    variant="outline"
                    className="bg-blue-100 dark:bg-blue-900/30 text-teal-700 dark:text-teal-400"
                  >
                    DRAFT
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating...
                </div>
              )}
              {generatedReport ? (
                <div className="space-y-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded whitespace-pre-wrap text-slate-900 dark:text-slate-50 text-sm font-mono">
                      {generatedReport}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept & Import
                    </Button>
                    <Button
                      variant="outline"
                      className="text-slate-600 dark:text-slate-400"
                    >
                      Edit Before Import
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  No report generated yet. Click "Generate Report" to begin.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">Note:</span> All AI-generated
            content is a draft and requires officer review and approval before
            being finalized. AI outputs are tools to assist investigation, not
            replacements for professional judgment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
