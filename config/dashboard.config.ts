// =============================================================================
// DASHBOARD UNIVERSAL TEMPLATE - ARQUIVO DE CONFIGURACAO PRINCIPAL
// =============================================================================
// Este arquivo centraliza TODAS as configuracoes do dashboard.
// Edite apenas este arquivo para personalizar seu dashboard.
// =============================================================================

import {
  LayoutDashboard,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Settings,
  ShoppingCart,
  Briefcase,
  Heart,
  Zap,
  Globe,
  type LucideIcon,
} from "lucide-react";

// =============================================================================
// TIPOS
// =============================================================================

export interface DashboardConfig {
  // Informacoes basicas
  name: string;
  shortName: string;
  description: string;
  logo?: string;
  favicon?: string;

  // Tema e cores
  theme: ThemeConfig;

  // Navegacao
  navigation: NavigationItem[];

  // KPIs e Metricas
  kpis: KPIConfig[];

  // Metas
  goals: GoalConfig[];

  // Fontes de dados
  dataSources: DataSourceConfig[];

  // Insights automaticos
  insights: InsightConfig[];

  // Configuracoes de localizacao
  locale: LocaleConfig;

  // Perfis de usuario
  userProfiles: string[];

  // Rodape
  footer: FooterConfig;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  neutral: string;
  background: string;
  foreground: string;
  sidebar: {
    background: string;
    text: string;
    activeBackground: string;
    activeText: string;
    hoverBackground: string;
  };
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
}

export interface KPIConfig {
  id: string;
  name: string;
  description: string;
  format: "currency" | "percentage" | "number" | "decimal";
  icon?: string;
  category: string;
  formula?: string;
  goodDirection: "up" | "down" | "neutral";
  thresholds?: {
    good: number;
    warning: number;
    danger: number;
  };
}

export interface GoalConfig {
  id: string;
  name: string;
  target: number;
  format: "currency" | "percentage" | "number";
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  icon?: string;
}

export interface DataSourceConfig {
  id: string;
  name: string;
  type: "csv" | "json" | "api";
  path: string;
  refreshInterval?: number; // em segundos
}

export interface InsightConfig {
  id: string;
  kpiId: string;
  type: "threshold" | "trend" | "comparison";
  conditions: {
    operator: ">" | "<" | ">=" | "<=" | "==" | "between";
    value: number | [number, number];
    message: string;
    severity: "success" | "warning" | "danger" | "info";
    icon?: string;
  }[];
}

export interface LocaleConfig {
  language: string;
  currency: string;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
  };
}

export interface FooterConfig {
  company: string;
  year: number;
  team?: string;
  version?: string;
}

// =============================================================================
// CONFIGURACAO PADRAO DO TEMPLATE
// =============================================================================

export const defaultConfig: DashboardConfig = {
  // -------------------------------------------------------------------------
  // INFORMACOES BASICAS
  // Personalize com os dados da sua empresa/projeto
  // -------------------------------------------------------------------------
  name: "Dashboard Analytics",
  shortName: "Analytics",
  description: "Dashboard para monitoramento e análise de métricas de negócio",
  logo: "/logo.svg",
  favicon: "/favicon.ico",

  // -------------------------------------------------------------------------
  // TEMA E CORES
  // Personalize as cores do seu dashboard
  // -------------------------------------------------------------------------
  theme: {
    primary: "#3B82F6",      // Azul principal
    secondary: "#6366F1",    // Indigo
    success: "#10B981",      // Verde
    danger: "#EF4444",       // Vermelho
    warning: "#F59E0B",      // Amarelo
    info: "#06B6D4",         // Ciano
    neutral: "#6B7280",      // Cinza
    background: "#F9FAFB",   // Fundo claro
    foreground: "#111827",   // Texto escuro
    sidebar: {
      background: "#1F2937",
      text: "#9CA3AF",
      activeBackground: "#374151",
      activeText: "#FFFFFF",
      hoverBackground: "#374151",
    },
  },

  // -------------------------------------------------------------------------
  // NAVEGACAO
  // Configure as paginas do seu dashboard
  // -------------------------------------------------------------------------
  navigation: [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
      description: "Página inicial",
    },
    {
      name: "Visão Geral",
      href: "/overview",
      icon: BarChart3,
      description: "KPIs principais e resumo executivo",
    },
    {
      name: "Aquisição",
      href: "/acquisition",
      icon: TrendingUp,
      description: "Métricas de aquisição e campanhas",
    },
    {
      name: "Retenção",
      href: "/retention",
      icon: Users,
      description: "Análise de retenção e churn",
    },
    {
      name: "Monetização",
      href: "/monetization",
      icon: DollarSign,
      description: "Receita e análise financeira",
    },
    {
      name: "Projeções",
      href: "/projections",
      icon: Target,
      description: "Projeções e simulações",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: Zap,
      description: "Análise detalhada de dados",
    },
    {
      name: "Configurações",
      href: "/accessibility",
      icon: Settings,
      description: "Acessibilidade e preferências",
    },
  ],

  // -------------------------------------------------------------------------
  // KPIs - INDICADORES CHAVE DE PERFORMANCE
  // Configure os KPIs que deseja monitorar
  // -------------------------------------------------------------------------
  kpis: [
    {
      id: "revenue",
      name: "Receita Total",
      description: "Receita total no período",
      format: "currency",
      icon: "💰",
      category: "financial",
      goodDirection: "up",
      thresholds: {
        good: 1000000,
        warning: 500000,
        danger: 100000,
      },
    },
    {
      id: "profit",
      name: "Lucro Líquido",
      description: "Lucro após custos",
      format: "currency",
      icon: "📈",
      category: "financial",
      goodDirection: "up",
    },
    {
      id: "roas",
      name: "ROAS",
      description: "Retorno sobre investimento em ads",
      format: "decimal",
      icon: "🎯",
      category: "marketing",
      formula: "receita / custoAds",
      goodDirection: "up",
      thresholds: {
        good: 3,
        warning: 2,
        danger: 1,
      },
    },
    {
      id: "cac",
      name: "CAC",
      description: "Custo de aquisição de cliente",
      format: "currency",
      icon: "👥",
      category: "marketing",
      formula: "(custoAds + custoVendas) / clientesAdquiridos",
      goodDirection: "down",
    },
    {
      id: "conversionRate",
      name: "Taxa de Conversão",
      description: "Percentual de conversão",
      format: "percentage",
      icon: "🔄",
      category: "sales",
      goodDirection: "up",
      thresholds: {
        good: 25,
        warning: 15,
        danger: 5,
      },
    },
    {
      id: "ltv",
      name: "LTV",
      description: "Valor do cliente no tempo",
      format: "currency",
      icon: "💎",
      category: "sales",
      goodDirection: "up",
    },
    {
      id: "churnRate",
      name: "Churn Rate",
      description: "Taxa de cancelamento",
      format: "percentage",
      icon: "📉",
      category: "retention",
      goodDirection: "down",
      thresholds: {
        good: 2,
        warning: 5,
        danger: 10,
      },
    },
    {
      id: "nps",
      name: "NPS",
      description: "Net Promoter Score",
      format: "number",
      icon: "⭐",
      category: "satisfaction",
      goodDirection: "up",
      thresholds: {
        good: 50,
        warning: 30,
        danger: 0,
      },
    },
  ],

  // -------------------------------------------------------------------------
  // METAS
  // Configure suas metas de negocio
  // -------------------------------------------------------------------------
  goals: [
    {
      id: "revenueGoal",
      name: "Meta de Receita",
      target: 30000000,
      format: "currency",
      period: "yearly",
      icon: "🎯",
    },
    {
      id: "customersGoal",
      name: "Meta de Clientes",
      target: 1000,
      format: "number",
      period: "monthly",
      icon: "👥",
    },
    {
      id: "conversionGoal",
      name: "Meta de Conversão",
      target: 25,
      format: "percentage",
      period: "monthly",
      icon: "📈",
    },
  ],

  // -------------------------------------------------------------------------
  // FONTES DE DADOS
  // Configure onde seus dados estao armazenados
  // -------------------------------------------------------------------------
  dataSources: [
    {
      id: "main",
      name: "Dados Principais",
      type: "csv",
      path: "/data/data.csv",
    },
    {
      id: "kpis",
      name: "KPIs Calculados",
      type: "csv",
      path: "/data/kpis.csv",
    },
    {
      id: "analytics",
      name: "Analytics",
      type: "csv",
      path: "/data/analytics.csv",
    },
  ],

  // -------------------------------------------------------------------------
  // INSIGHTS AUTOMATICOS
  // Configure regras para geracao de insights
  // -------------------------------------------------------------------------
  insights: [
    {
      id: "roasInsight",
      kpiId: "roas",
      type: "threshold",
      conditions: [
        {
          operator: ">",
          value: 6,
          message: "ROAS excelente! Campanhas com alto retorno.",
          severity: "success",
          icon: "🚀",
        },
        {
          operator: "between",
          value: [3, 6],
          message: "ROAS positivo com potencial para escalar.",
          severity: "info",
          icon: "📊",
        },
        {
          operator: "<",
          value: 3,
          message: "ROAS baixo. Revise segmentações e criativos.",
          severity: "warning",
          icon: "⚠️",
        },
      ],
    },
    {
      id: "conversionInsight",
      kpiId: "conversionRate",
      type: "threshold",
      conditions: [
        {
          operator: ">",
          value: 25,
          message: "Taxa de conversão excelente!",
          severity: "success",
          icon: "✅",
        },
        {
          operator: "<",
          value: 15,
          message: "Conversão abaixo do esperado. Revise o funil.",
          severity: "warning",
          icon: "⚠️",
        },
      ],
    },
  ],

  // -------------------------------------------------------------------------
  // LOCALIZACAO
  // Configure idioma e formato de numeros
  // -------------------------------------------------------------------------
  locale: {
    language: "pt-BR",
    currency: "BRL",
    dateFormat: "DD/MM/YYYY",
    numberFormat: {
      decimal: ",",
      thousand: ".",
    },
  },

  // -------------------------------------------------------------------------
  // PERFIS DE USUARIO
  // Liste os perfis que podem acessar o dashboard
  // -------------------------------------------------------------------------
  userProfiles: [
    "Executivo",
    "Marketing",
    "Vendas",
    "Produto",
    "Financeiro",
  ],

  // -------------------------------------------------------------------------
  // RODAPE
  // Informacoes do rodape
  // -------------------------------------------------------------------------
  footer: {
    company: "Sua Empresa",
    year: new Date().getFullYear(),
    team: "Analytics Team",
    version: "1.0.0",
  },
};

// =============================================================================
// PRESETS DE CONFIGURACAO PARA DIFERENTES INDUSTRIAS
// =============================================================================

export const presets = {
  // Preset para E-commerce
  ecommerce: {
    name: "E-commerce Dashboard",
    kpis: [
      { id: "gmv", name: "GMV", format: "currency" as const, icon: "🛒" },
      { id: "orders", name: "Pedidos", format: "number" as const, icon: "📦" },
      { id: "aov", name: "Ticket Médio", format: "currency" as const, icon: "💳" },
      { id: "cartAbandonment", name: "Abandono de Carrinho", format: "percentage" as const, icon: "🛒" },
    ],
    navigation: [
      { name: "Vendas", href: "/sales", icon: ShoppingCart },
      { name: "Produtos", href: "/products", icon: Briefcase },
    ],
  },

  // Preset para SaaS
  saas: {
    name: "SaaS Dashboard",
    kpis: [
      { id: "mrr", name: "MRR", format: "currency" as const, icon: "💵" },
      { id: "arr", name: "ARR", format: "currency" as const, icon: "📅" },
      { id: "churn", name: "Churn", format: "percentage" as const, icon: "📉" },
      { id: "ltv", name: "LTV", format: "currency" as const, icon: "💎" },
      { id: "cac", name: "CAC", format: "currency" as const, icon: "👥" },
    ],
    navigation: [
      { name: "Assinaturas", href: "/subscriptions", icon: Users },
      { name: "Receita", href: "/revenue", icon: DollarSign },
    ],
  },

  // Preset para Healthcare
  healthcare: {
    name: "Healthcare Dashboard",
    kpis: [
      { id: "patients", name: "Pacientes", format: "number" as const, icon: "🏥" },
      { id: "appointments", name: "Consultas", format: "number" as const, icon: "📋" },
      { id: "satisfaction", name: "Satisfação", format: "percentage" as const, icon: "😊" },
    ],
    navigation: [
      { name: "Pacientes", href: "/patients", icon: Heart },
      { name: "Agenda", href: "/schedule", icon: BarChart3 },
    ],
  },

  // Preset para Marketing Agency
  marketing: {
    name: "Marketing Dashboard",
    kpis: [
      { id: "leads", name: "Leads", format: "number" as const, icon: "🎯" },
      { id: "cpl", name: "CPL", format: "currency" as const, icon: "💰" },
      { id: "roas", name: "ROAS", format: "decimal" as const, icon: "📈" },
      { id: "ctr", name: "CTR", format: "percentage" as const, icon: "🖱️" },
    ],
    navigation: [
      { name: "Campanhas", href: "/campaigns", icon: TrendingUp },
      { name: "Performance", href: "/performance", icon: Zap },
    ],
  },

  // Preset para Fintech/Banking
  fintech: {
    name: "Fintech Dashboard",
    kpis: [
      { id: "tpv", name: "TPV", format: "currency" as const, icon: "💳" },
      { id: "transactions", name: "Transações", format: "number" as const, icon: "🔄" },
      { id: "revenue", name: "Receita", format: "currency" as const, icon: "💰" },
      { id: "defaultRate", name: "Taxa de Inadimplência", format: "percentage" as const, icon: "⚠️" },
    ],
    navigation: [
      { name: "Transações", href: "/transactions", icon: DollarSign },
      { name: "Clientes", href: "/customers", icon: Users },
    ],
  },
};

// =============================================================================
// FUNCOES AUXILIARES
// =============================================================================

/**
 * Mescla configuracao personalizada com a configuracao padrao
 */
export function mergeConfig(customConfig: Partial<DashboardConfig>): DashboardConfig {
  return {
    ...defaultConfig,
    ...customConfig,
    theme: {
      ...defaultConfig.theme,
      ...customConfig.theme,
      sidebar: {
        ...defaultConfig.theme.sidebar,
        ...customConfig.theme?.sidebar,
      },
    },
    locale: {
      ...defaultConfig.locale,
      ...customConfig.locale,
      numberFormat: {
        ...defaultConfig.locale.numberFormat,
        ...customConfig.locale?.numberFormat,
      },
    },
    footer: {
      ...defaultConfig.footer,
      ...customConfig.footer,
    },
  };
}

/**
 * Aplica um preset de industria
 */
export function applyPreset(
  presetName: keyof typeof presets,
  customConfig?: Partial<DashboardConfig>
): DashboardConfig {
  const preset = presets[presetName];
  return mergeConfig({
    name: preset.name,
    kpis: [...defaultConfig.kpis, ...preset.kpis.map(k => ({
      ...k,
      description: k.name,
      category: "custom",
      goodDirection: "up" as const,
    }))],
    navigation: [...defaultConfig.navigation, ...preset.navigation.map(n => ({
      ...n,
      description: n.name,
    }))],
    ...customConfig,
  });
}

// =============================================================================
// EXPORTACAO DA CONFIGURACAO ATIVA
// =============================================================================

// Para usar um preset, descomente a linha correspondente:
// export const dashboardConfig = applyPreset('ecommerce');
// export const dashboardConfig = applyPreset('saas');
// export const dashboardConfig = applyPreset('healthcare');
// export const dashboardConfig = applyPreset('marketing');
// export const dashboardConfig = applyPreset('fintech');

// Configuracao padrao (edite conforme necessario):
export const dashboardConfig = defaultConfig;
