import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

// ============================================================================
// METRIC CARD - Premium stat card with proper spacing and hierarchy
// ============================================================================

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    direction: "up" | "down";
    value: string;
    color: "positive" | "negative" | "neutral";
  };
  backgroundColor?: string;
  iconBackgroundColor?: string;
  iconColor?: string;
  valueTextColor?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  backgroundColor = "bg-slate-50 dark:bg-slate-800",
  iconBackgroundColor = "bg-cyan-100 dark:bg-cyan-900/30",
  iconColor = "text-cyan-600 dark:text-cyan-400",
  valueTextColor = "text-slate-900 dark:text-white",
}: MetricCardProps) {
  return (
    <div
      className={`relative z-0 rounded-xl border border-slate-200 dark:border-slate-700 ${backgroundColor} p-6 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all overflow-hidden`}
    >
      <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-cyan-100 dark:from-cyan-900/20 blur-2xl -z-10"></div>
      {/* Top section with icon */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {label}
          </p>
          <p className={`text-3xl font-bold ${valueTextColor} mt-2`}>{value}</p>
        </div>
        {Icon && (
          <div
            className={`h-12 w-12 rounded-lg ${iconBackgroundColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p
            className={`text-xs font-medium ${
              trend.color === "positive"
                ? "text-green-600 dark:text-green-400"
                : trend.color === "negative"
                  ? "text-red-600 dark:text-red-400"
                  : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <span>{trend.direction === "up" ? "↑" : "↓"}</span> {trend.value}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DASHBOARD SECTION - Wrapper for consistent spacing
// ============================================================================

interface DashboardSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DashboardSection({
  title,
  description,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`space-y-4 relative z-0 ${className}`}>
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

// ============================================================================
// EMPTY STATE - For empty/no-data scenarios
// ============================================================================

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 p-12 text-center shadow-sm hover:shadow-md transition-shadow">
      {Icon && (
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 p-3">
            <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 inline-flex items-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// DATA TABLE - Clean, minimal data table
// ============================================================================

interface DataTableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: DataTableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  empty?: {
    title: string;
    description: string;
  };
}

export function DataTable({
  columns,
  data,
  onRowClick,
  empty,
}: DataTableProps) {
  if (data.length === 0 && empty) {
    return <EmptyState title={empty.title} description={empty.description} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white ${col.width || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-slate-200 dark:border-slate-700 transition-colors ${
                onRowClick
                  ? "hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={`${idx}-${col.key}`}
                  className="px-6 py-4 text-sm text-slate-900 dark:text-white"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// PAGE HEADER - Consistent page header with title and description
// ============================================================================

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="w-full sm:w-auto flex-shrink-0">{action}</div>}
    </div>
  );
}

// ============================================================================
// STATS GRID - Grid layout for metric cards with responsive columns
// ============================================================================

interface StatsGridProps {
  children: ReactNode;
  columns?: number;
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
  const colClass =
    {
      2: "sm:grid-cols-2 md:grid-cols-2",
      3: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
      4: "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
      5: "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    }[columns] || "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4";

  return <div className={`grid grid-cols-1 gap-6 ${colClass}`}>{children}</div>;
}

// ============================================================================
// ACTIVITY LIST - Timeline-style list for activities/updates
// ============================================================================

interface ActivityItem {
  id: string;
  timestamp: Date;
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed" | "error";
  icon?: React.ReactNode;
}

interface ActivityListProps {
  items: ActivityItem[];
  empty?: {
    title: string;
    description: string;
  };
}

const statusColors = {
  pending:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  "in-progress":
    "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  completed:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
};

export function ActivityList({ items, empty }: ActivityListProps) {
  if (items.length === 0 && empty) {
    return <EmptyState title={empty.title} description={empty.description} />;
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4 pb-4 relative z-0">
          {/* Timeline line */}
          {index !== items.length - 1 && (
            <div className="absolute left-4 top-10 w-0.5 h-8 bg-slate-200 dark:bg-slate-700"></div>
          )}

          {/* Activity dot and content */}
          <div className="relative z-10 flex-shrink-0">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400`}
            >
              {item.icon || (
                <div className="h-3 w-3 rounded-full bg-current"></div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                )}
              </div>
              {item.status && (
                <span
                  className={`inline-flex text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                    statusColors[item.status]
                  }`}
                >
                  {item.status.replace("-", " ")}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              {item.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// CHART CONTAINER - Wrapper for charts with consistent styling
// ============================================================================

interface ChartContainerProps {
  title?: string;
  description?: string;
  children: ReactNode;
  height?: string;
}

export function ChartContainer({
  title,
  description,
  children,
  height = "h-80",
}: ChartContainerProps) {
  return (
    <div
      className={`relative z-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col ${height === "h-full" ? "h-full" : ""}`}
    >
      <div className="absolute -top-1 -right-1 w-32 h-32 bg-gradient-to-br from-blue-100 dark:from-blue-900/20 blur-3xl -z-10"></div>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={height === "h-full" ? "flex-1 min-h-0" : height}>
        {children}
      </div>
    </div>
  );
}
