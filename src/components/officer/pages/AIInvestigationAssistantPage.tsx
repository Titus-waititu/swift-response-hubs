import { OfficerAIToolsPanel } from "@/components/OfficerAIToolsPanel";
import type { IncidentReport } from "@/types/incident";

interface AIInvestigationAssistantProps {
  incident?: IncidentReport;
}

export default function AIInvestigationAssistant({
  incident,
}: AIInvestigationAssistantProps) {
  return (
    <div className="space-y-6 pb-12">
      <OfficerAIToolsPanel />
    </div>
  );
}
