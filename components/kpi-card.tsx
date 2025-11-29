"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatValue } from "@/lib/kpi-calculator";
import { dashboardConfig } from "@/config/dashboard.config";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: number;
  format?: "currency" | "percentage" | "number" | "decimal";
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "success" | "warning" | "danger" | "neutral";
  description?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  format = "number",
  icon,
  trend,
  status,
  description,
  className,
}: KPICardProps) {
  // Cores baseadas no status
  const statusColors = {
    success: dashboardConfig.theme.success,
    warning: dashboardConfig.theme.warning,
    danger: dashboardConfig.theme.danger,
    neutral: dashboardConfig.theme.neutral,
  };

  const statusBgColors = {
    success: `${dashboardConfig.theme.success}15`,
    warning: `${dashboardConfig.theme.warning}15`,
    danger: `${dashboardConfig.theme.danger}15`,
    neutral: `${dashboardConfig.theme.neutral}10`,
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        className
      )}
      style={{
        borderLeftWidth: status ? "4px" : undefined,
        borderLeftColor: status ? statusColors[status] : undefined,
        backgroundColor: status ? statusBgColors[status] : undefined,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div
            className="rounded-full p-2"
            style={{
              backgroundColor: `${dashboardConfig.theme.primary}15`,
              color: dashboardConfig.theme.primary,
            }}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value, format)}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-sm font-medium flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              {trend.value.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs anterior</span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-500 mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Variante compacta do KPI Card
interface KPICardCompactProps {
  title: string;
  value: number;
  format?: "currency" | "percentage" | "number" | "decimal";
  icon?: React.ReactNode;
  color?: string;
}

export function KPICardCompact({
  title,
  value,
  format = "number",
  icon,
  color,
}: KPICardCompactProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg border"
      style={{
        borderColor: color || dashboardConfig.theme.neutral,
        backgroundColor: color ? `${color}10` : undefined,
      }}
    >
      <div className="flex items-center space-x-3">
        {icon && (
          <div
            className="rounded-full p-2"
            style={{
              backgroundColor: color
                ? `${color}20`
                : `${dashboardConfig.theme.primary}15`,
              color: color || dashboardConfig.theme.primary,
            }}
          >
            {icon}
          </div>
        )}
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <span className="text-lg font-bold text-gray-900">
        {formatValue(value, format)}
      </span>
    </div>
  );
}

// KPI com sparkline/mini grafico
interface KPICardWithSparklineProps extends KPICardProps {
  sparklineData?: number[];
}

export function KPICardWithSparkline({
  title,
  value,
  format = "number",
  icon,
  trend,
  sparklineData,
  className,
}: KPICardWithSparklineProps) {
  // Normalizar dados para altura do sparkline
  const maxValue = sparklineData ? Math.max(...sparklineData) : 0;
  const minValue = sparklineData ? Math.min(...sparklineData) : 0;
  const range = maxValue - minValue || 1;

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div
            className="rounded-full p-2"
            style={{
              backgroundColor: `${dashboardConfig.theme.primary}15`,
              color: dashboardConfig.theme.primary,
            }}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(value, format)}
            </div>
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value.toFixed(1)}%
              </span>
            )}
          </div>

          {/* Mini Sparkline */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="flex items-end space-x-0.5 h-10">
              {sparklineData.slice(-12).map((val, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-t"
                  style={{
                    height: `${((val - minValue) / range) * 100}%`,
                    minHeight: "4px",
                    backgroundColor:
                      i === sparklineData.length - 1
                        ? dashboardConfig.theme.primary
                        : `${dashboardConfig.theme.primary}40`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Grid de KPIs
interface KPIGridProps {
  kpis: {
    title: string;
    value: number;
    format?: "currency" | "percentage" | "number" | "decimal";
    icon?: React.ReactNode;
    trend?: { value: number; isPositive: boolean };
    status?: "success" | "warning" | "danger" | "neutral";
  }[];
  columns?: 2 | 3 | 4;
}

export function KPIGrid({ kpis, columns = 4 }: KPIGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns])}>
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
}
