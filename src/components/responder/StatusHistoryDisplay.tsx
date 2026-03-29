import { Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusHistoryDisplayProps {
  createdAt: string;
  currentStatus?: string;
  statusSelectedAt?: Date;
  statusIcon?: React.ReactNode;
  statusColor?: string;
  compact?: boolean;
}

export default function StatusHistoryDisplay({
  createdAt,
  currentStatus,
  statusSelectedAt,
  statusIcon,
  statusColor = "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200",
  compact = false,
}: StatusHistoryDisplayProps) {
  if (compact) {
    return (
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Clock className="h-3 w-3" />
          Created: {new Date(createdAt).toLocaleTimeString()}
        </div>
        {currentStatus && currentStatus.trim() ? (
          <div className="flex items-center gap-1">
            <Badge
              variant="secondary"
              className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-0"
            >
              {currentStatus}
            </Badge>
            <span className="text-slate-500 dark:text-slate-400">
              {statusSelectedAt?.toLocaleTimeString()}
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 italic">
            Awaiting response...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-3">
      {/* Timeline */}
      <div className="relative">
        {/* Timeline connector line */}
        {currentStatus && currentStatus.trim() ? (
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-teal-300 dark:from-slate-600 dark:to-teal-600" />
        ) : null}

        {/* Incident Created */}
        <div className="relative flex gap-3 pl-10">
          <div className="absolute left-0 top-1.5 w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="flex-1 pb-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Incident Created
            </p>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5">
              {new Date(createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Current Status */}
        {currentStatus && currentStatus.trim() ? (
          <div className="relative flex gap-3 pl-10 pt-1">
            <div className="absolute left-0 top-1.5 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center border-2 border-teal-400 shadow-lg shadow-teal-500/50">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                Current Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  className={`${statusColor} border-0 px-2 py-0.5 text-xs font-semibold`}
                >
                  {statusIcon && <span className="mr-1">{statusIcon}</span>}
                  {currentStatus}
                </Badge>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {statusSelectedAt?.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex gap-3 pl-10 pt-1">
            <div className="absolute left-0 top-1.5 w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-400 dark:border-slate-500">
              <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Awaiting Response
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 italic">
                No status update submitted yet
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
