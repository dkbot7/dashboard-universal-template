// =============================================================================
// SETTINGS.TS - CONFIGURACOES DERIVADAS DO DASHBOARD CONFIG
// =============================================================================
// Este arquivo exporta configuracoes derivadas para compatibilidade
// e facilidade de uso em componentes.
// =============================================================================

import { dashboardConfig } from "./dashboard.config";

// Re-export da configuracao principal
export { dashboardConfig } from "./dashboard.config";

// Perfis de usuario
export const USER_PROFILES = dashboardConfig.userProfiles;
export type UserProfile = (typeof USER_PROFILES)[number];

// Paleta de cores derivada do tema
export const COLOR_PALETTE = {
  primary: dashboardConfig.theme.primary,
  secondary: dashboardConfig.theme.secondary,
  success: dashboardConfig.theme.success,
  danger: dashboardConfig.theme.danger,
  warning: dashboardConfig.theme.warning,
  info: dashboardConfig.theme.info,
  neutral: dashboardConfig.theme.neutral,
  background: dashboardConfig.theme.background,
  foreground: dashboardConfig.theme.foreground,
  // Cores para graficos (array de 10 cores)
  chart: [
    dashboardConfig.theme.primary,
    dashboardConfig.theme.secondary,
    dashboardConfig.theme.success,
    dashboardConfig.theme.warning,
    dashboardConfig.theme.info,
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#84CC16", // Lime
  ],
} as const;

// Metas derivadas da configuracao
export const METAS = dashboardConfig.goals.reduce((acc, goal) => {
  acc[goal.id] = goal.target;
  return acc;
}, {} as Record<string, number>);

// Meta de receita (atalho para compatibilidade)
export const META_RECEITA = dashboardConfig.goals.find(
  (g) => g.id === "revenueGoal"
)?.target ?? 0;

// Configuracoes de localizacao
export const LOCALE = dashboardConfig.locale;

// Informacoes da empresa
export const COMPANY = {
  name: dashboardConfig.name,
  shortName: dashboardConfig.shortName,
  description: dashboardConfig.description,
  footer: dashboardConfig.footer,
};

// Navegacao
export const NAVIGATION = dashboardConfig.navigation;

// KPIs configurados
export const KPIS = dashboardConfig.kpis;

// Fontes de dados
export const DATA_SOURCES = dashboardConfig.dataSources;

// Tema do sidebar
export const SIDEBAR_THEME = dashboardConfig.theme.sidebar;

// =============================================================================
// FUNCOES UTILITARIAS DE FORMATACAO
// =============================================================================

/**
 * Formata um valor de acordo com o formato especificado
 */
export function formatValue(
  value: number,
  format: "currency" | "percentage" | "number" | "decimal"
): string {
  const { currency, language, numberFormat } = LOCALE;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat(language, {
        style: "currency",
        currency: currency,
      }).format(value);

    case "percentage":
      return `${value.toLocaleString(language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;

    case "decimal":
      return value.toLocaleString(language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    case "number":
    default:
      return value.toLocaleString(language);
  }
}

/**
 * Formata uma data de acordo com a configuracao de locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(LOCALE.language);
}

/**
 * Retorna a cor baseada no valor e thresholds do KPI
 */
export function getKPIColor(
  kpiId: string,
  value: number
): "success" | "warning" | "danger" | "neutral" {
  const kpi = KPIS.find((k) => k.id === kpiId);
  if (!kpi?.thresholds) return "neutral";

  const { good, warning, danger } = kpi.thresholds;
  const isUp = kpi.goodDirection === "up";

  if (isUp) {
    if (value >= good) return "success";
    if (value >= warning) return "warning";
    return "danger";
  } else {
    if (value <= good) return "success";
    if (value <= warning) return "warning";
    return "danger";
  }
}

/**
 * Retorna a cor hex baseada no status
 */
export function getStatusColor(
  status: "success" | "warning" | "danger" | "info" | "neutral"
): string {
  return COLOR_PALETTE[status] || COLOR_PALETTE.neutral;
}
