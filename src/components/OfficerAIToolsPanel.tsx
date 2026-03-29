import { useState } from "react";
import {
  FileText,
  Sparkles,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AIAssessmentCard } from "@/components/AIAssessmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SeverityLevel } from "@/types/incident";

interface AIToolResult {
  type: "extract" | "classify" | "analyze" | "generate";
  status: "idle" | "loading" | "success" | "error";
  data?: any;
  error?: string;
  timestamp?: Date;
}

/**
 * OfficerAIToolsPanel Component
 * 
 * Workspace for officers to use AI-powered tools:
 * - Extract Text: OCR on images for report data extraction
 * - Classify Severity: Analyze incident description and suggest severity level
 * - Analyze Accident: Full AI analysis of an incident
 * - Generate Report: Auto-generate formatted incident report
 * 
 * Used in OfficerDashboard as a dedicated AI tools workspace
 */
export function OfficerAIToolsPanel() {
  const [activeTab, setActiveTab] = useState<string>("extract");
  const [extractResult, setExtractResult] = useState<AIToolResult>({
    type: "extract",
    status: "idle",
  });
  const [classifyResult, setClassifyResult] = useState<AIToolResult>({
    type: "classify",
    status: "idle",
  });
  const [analyzeResult, setAnalyzeResult] = useState<AIToolResult>({
    type: "analyze",
    status: "idle",
  });
  const [generateResult, setGenerateResult] = useState<AIToolResult>({
    type: "generate",
    status: "idle",
  });

  // Simulate Extract Text (OCR)
  const handleExtractText = async () => {
    setExtractResult({ ...extractResult, status: "loading", type: "extract" });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setExtractResult({
        type: "extract",
        status: "success",
        data: {
          extractedText:
            "Vehicle collision at intersection. Multiple vehicles involved. Injuries reported. Police on scene.",
          confidence: 0.94,
          imageProcessed: true,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      setExtractResult({
        type: "extract",
        status: "error",
        error: String(error),
      });
    }
  };

  // Simulate Classify Severity
  const handleClassifySeverity = async () => {
    setClassifyResult({ ...classifyResult, status: "loading", type: "classify" });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setClassifyResult({
        type: "classify",
        status: "success",
        data: {
          severity: "High" as SeverityLevel,
          confidence: 0.87,
          reasoning: [
            "Multiple vehicles involved",
            "Injuries reported",
            "Police presence required",
          ],
        },
        timestamp: new Date(),
      });
    } catch (error) {
      setClassifyResult({
        type: "classify",
        status: "error",
        error: String(error),
      });
    }
  };

  // Simulate Analyze Accident
  const handleAnalyzeAccident = async () => {
    setAnalyzeResult({ ...analyzeResult, status: "loading", type: "analyze" });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setAnalyzeResult({
        type: "analyze",
        status: "success",
        data: {
          severity: "High" as SeverityLevel,
          summary: "Multi-vehicle collision with reported injuries",
          detectedInjuries: 2,
          recommendations: [
            "Dispatch EMS to scene",
            "Traffic control required",
            "Preliminary investigation",
          ],
          suggestedEquipment: [
            "EMS Kit",
            "Stretchers",
            "Cervical Collars",
            "Trauma Supplies",
          ],
          sceneHazards: [
            "Active traffic area",
            "Potential vehicle fire risk",
          ],
        },
        timestamp: new Date(),
      });
    } catch (error) {
      setAnalyzeResult({
        type: "analyze",
        status: "error",
        error: String(error),
      });
    }
  };

  // Simulate Generate Report
  const handleGenerateReport = async () => {
    setGenerateResult({
      ...generateResult,
      status: "loading",
      type: "generate",
    });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setGenerateResult({
        type: "generate",
        status: "success",
        data: {
          reportId: "RPT-2024-001543",
          generatedReport: `INCIDENT REPORT
          
Date: ${new Date().toLocaleDateString()}
Type: Multi-Vehicle Collision
Severity: HIGH
Location: Main Street & 5th Avenue

Summary:
Multiple vehicles involved in traffic collision. Two individuals reported injured. Emergency services dispatched.

Response Actions:
- EMS dispatch to scene
- Traffic control implemented
- Initial investigation begun

Status: UNDER_REVIEW`,
          canExport: true,
        },
        timestamp: new Date(),
      });
    } catch (error) {
      setGenerateResult({
        type: "generate",
        status: "error",
        error: String(error),
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card/85 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Tools Workspace</CardTitle>
              <CardDescription>
                AI-powered tools for incident analysis, classification, and report generation
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 border border-border/70 bg-secondary/75">
              <TabsTrigger
                value="extract"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-xs sm:text-sm"
              >
                Extract Text
              </TabsTrigger>
              <TabsTrigger
                value="classify"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-xs sm:text-sm"
              >
                Classify
              </TabsTrigger>
              <TabsTrigger
                value="analyze"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-xs sm:text-sm"
              >
                Analyze
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground text-xs sm:text-sm"
              >
                Generate
              </TabsTrigger>
            </TabsList>

            {/* Extract Text Tab */}
            <TabsContent value="extract" className="mt-6 space-y-4">
              <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  Upload image to extract text (OCR)
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports JPG, PNG, PDF (Max 10MB)
                </p>
              </div>

              <Button
                onClick={handleExtractText}
                disabled={extractResult.status === "loading"}
                className="w-full"
              >
                {extractResult.status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting text...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Extract Text from Image
                  </>
                )}
              </Button>

              {extractResult.status === "success" && extractResult.data && (
                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <CardTitle className="text-sm text-green-900 dark:text-green-100">
                        Text Extracted Successfully
                      </CardTitle>
                    </div>
                    <p className="text-xs text-green-800 dark:text-green-200">
                      Confidence: {(extractResult.data.confidence * 100).toFixed(0)}%
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="rounded-md bg-white dark:bg-slate-900 p-3 text-sm text-foreground">
                      {extractResult.data.extractedText}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Extracted Text
                    </Button>
                  </CardContent>
                </Card>
              )}

              {extractResult.status === "error" && (
                <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-6">
                    <p className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      {extractResult.error}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Classify Severity Tab */}
            <TabsContent value="classify" className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Incident Description
                </label>
                <textarea
                  placeholder="Paste incident description here..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={4}
                  defaultValue="Vehicle collision at intersection. Multiple vehicles involved. Injuries reported. Police on scene."
                />
              </div>

              <Button
                onClick={handleClassifySeverity}
                disabled={classifyResult.status === "loading"}
                className="w-full"
              >
                {classifyResult.status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Classify Severity
                  </>
                )}
              </Button>

              {classifyResult.status === "success" && classifyResult.data && (
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <CardTitle className="text-sm text-blue-900 dark:text-blue-100">
                          Severity Classification
                        </CardTitle>
                      </div>
                      <span className="rounded-full bg-blue-600 dark:bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                        {classifyResult.data.severity}
                      </span>
                    </div>
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      Confidence: {(classifyResult.data.confidence * 100).toFixed(0)}%
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-foreground">
                        Reasoning:
                      </p>
                      <ul className="space-y-1">
                        {classifyResult.data.reasoning.map(
                          (reason: string, idx: number) => (
                            <li key={idx} className="text-xs text-muted-foreground">
                              • {reason}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Accept Classification
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analyze Accident Tab */}
            <TabsContent value="analyze" className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Perform comprehensive AI analysis on selected incident
              </p>

              <Button
                onClick={handleAnalyzeAccident}
                disabled={analyzeResult.status === "loading"}
                className="w-full"
              >
                {analyzeResult.status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing accident...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Run Full Analysis
                  </>
                )}
              </Button>

              {analyzeResult.status === "success" && analyzeResult.data && (
                <AIAssessmentCard
                  severity={analyzeResult.data.severity}
                  summary={analyzeResult.data.summary}
                  recommendations={analyzeResult.data.recommendations}
                  detectedInjuries={analyzeResult.data.detectedInjuries}
                  suggestedEquipment={analyzeResult.data.suggestedEquipment}
                  isLoading={false}
                  compact={false}
                />
              )}
            </TabsContent>

            {/* Generate Report Tab */}
            <TabsContent value="generate" className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Auto-generate formatted incident report
              </p>

              <Button
                onClick={handleGenerateReport}
                disabled={generateResult.status === "loading"}
                className="w-full"
              >
                {generateResult.status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating report...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>

              {generateResult.status === "success" && generateResult.data && (
                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <CardTitle className="text-sm text-green-900 dark:text-green-100">
                          Report Generated
                        </CardTitle>
                      </div>
                      <span className="font-mono text-xs text-green-700 dark:text-green-300">
                        {generateResult.data.reportId}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <pre className="rounded-md bg-white dark:bg-slate-900 p-3 text-xs text-foreground overflow-auto max-h-64">
                      {generateResult.data.generatedReport}
                    </pre>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Copy
                      </Button>
                      <Button size="sm" className="flex-1">
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
