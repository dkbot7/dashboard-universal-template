// =============================================================================
// INSIGHTS-GENERATOR.TS - GERADOR UNIVERSAL DE INSIGHTS
// =============================================================================
// Gera insights automaticos baseados em configuracao e dados
// =============================================================================

import { dashboardConfig } from "@/config/dashboard.config";
import type { InsightConfig } from "@/config/dashboard.config";
import { KPIS } from "@/config/settings";

// =============================================================================
// TIPOS
// =============================================================================

export interface Insight {
  id: string;
  kpiId: string;
  message: string;
  severity: "success" | "warning" | "danger" | "info";
  icon?: string;
  value?: number;
  threshold?: number;
}

export interface InsightRule {
  condition: (value: number, ...args: number[]) => boolean;
  message: string | ((value: number, ...args: number[]) => string);
  severity: "success" | "warning" | "danger" | "info";
  icon?: string;
}

// =============================================================================
// GERADOR DE INSIGHTS BASEADO EM CONFIGURACAO
// =============================================================================

/**
 * Gera insights para um KPI baseado na configuracao
 */
export function generateInsight(kpiId: string, value: number): Insight | null {
  const insightConfig = dashboardConfig.insights.find(
    (i) => i.kpiId === kpiId
  );

  if (!insightConfig) return null;

  for (const condition of insightConfig.conditions) {
    let matches = false;

    switch (condition.operator) {
      case ">":
        matches = value > (condition.value as number);
        break;
      case "<":
        matches = value < (condition.value as number);
        break;
      case ">=":
        matches = value >= (condition.value as number);
        break;
      case "<=":
        matches = value <= (condition.value as number);
        break;
      case "==":
        matches = value === (condition.value as number);
        break;
      case "between":
        const [min, max] = condition.value as [number, number];
        matches = value >= min && value <= max;
        break;
    }

    if (matches) {
      return {
        id: insightConfig.id,
        kpiId: insightConfig.kpiId,
        message: condition.message,
        severity: condition.severity,
        icon: condition.icon,
        value,
      };
    }
  }

  return null;
}

/**
 * Gera todos os insights para um conjunto de KPIs
 */
export function generateAllInsights(
  kpiValues: Record<string, number>
): Insight[] {
  const insights: Insight[] = [];

  Object.entries(kpiValues).forEach(([kpiId, value]) => {
    const insight = generateInsight(kpiId, value);
    if (insight) {
      insights.push(insight);
    }
  });

  return insights;
}

// =============================================================================
// INSIGHTS PREDEFINIDOS (FUNCOES ESPECIALIZADAS)
// =============================================================================

/**
 * Insight para Taxa de Conversao
 */
export function gerarInsightConversao(taxaConversao: number): string {
  if (taxaConversao > 25) {
    return `🚀 Excelente! Taxa de conversão de ${taxaConversao.toFixed(2)}% está acima do esperado.`;
  } else if (taxaConversao > 15) {
    return `📈 Taxa de conversão razoável (${taxaConversao.toFixed(2)}%), com espaço para otimização.`;
  } else if (taxaConversao > 5) {
    return `⚠️ Taxa de conversão abaixo do ideal (${taxaConversao.toFixed(2)}%). Revise o funil.`;
  } else {
    return `🔴 Taxa de conversão crítica (${taxaConversao.toFixed(2)}%). Ação urgente necessária.`;
  }
}

/**
 * Insight para ROAS
 */
export function gerarInsightRoas(roas: number): string {
  if (roas > 6) {
    return `💰 ROAS excelente (${roas.toFixed(2)}x). Campanhas com alto retorno!`;
  } else if (roas > 3) {
    return `📊 ROAS positivo (${roas.toFixed(2)}x). Potencial para escalar.`;
  } else if (roas > 1) {
    return `⚠️ ROAS baixo (${roas.toFixed(2)}x). Avalie segmentações e criativos.`;
  } else {
    return `🔴 ROAS negativo (${roas.toFixed(2)}x). Campanhas estão dando prejuízo.`;
  }
}

/**
 * Insight para CAC
 */
export function gerarInsightCAC(cac: number, ltvMedio: number): string {
  const razaoLtvCac = ltvMedio / cac;

  if (razaoLtvCac > 5) {
    return `✅ CAC saudável (R$ ${cac.toFixed(2)}). Razão LTV/CAC de ${razaoLtvCac.toFixed(1)}x é excelente.`;
  } else if (razaoLtvCac > 3) {
    return `📈 CAC adequado (R$ ${cac.toFixed(2)}). Razão LTV/CAC de ${razaoLtvCac.toFixed(1)}x é boa.`;
  } else if (razaoLtvCac > 1) {
    return `⚠️ CAC alto (R$ ${cac.toFixed(2)}). Razão LTV/CAC de ${razaoLtvCac.toFixed(1)}x precisa melhorar.`;
  } else {
    return `🔴 CAC muito alto (R$ ${cac.toFixed(2)}). Razão LTV/CAC de ${razaoLtvCac.toFixed(1)}x é insustentável.`;
  }
}

/**
 * Insight para Churn Rate
 */
export function gerarInsightChurn(churnRate: number): string {
  if (churnRate < 2) {
    return `✅ Churn excelente (${churnRate.toFixed(2)}%). Retenção muito forte.`;
  } else if (churnRate < 5) {
    return `📈 Churn aceitável (${churnRate.toFixed(2)}%). Monitore tendências.`;
  } else if (churnRate < 10) {
    return `⚠️ Churn elevado (${churnRate.toFixed(2)}%). Investigue causas de cancelamento.`;
  } else {
    return `🔴 Churn crítico (${churnRate.toFixed(2)}%). Ação urgente de retenção necessária.`;
  }
}

/**
 * Insight para NPS
 */
export function gerarInsightNPS(nps: number): string {
  if (nps > 70) {
    return `🌟 NPS excepcional (${nps.toFixed(0)}). Clientes são promotores ativos!`;
  } else if (nps > 50) {
    return `✅ NPS excelente (${nps.toFixed(0)}). Boa satisfação do cliente.`;
  } else if (nps > 30) {
    return `📈 NPS bom (${nps.toFixed(0)}). Há espaço para melhorias.`;
  } else if (nps > 0) {
    return `⚠️ NPS neutro (${nps.toFixed(0)}). Satisfação precisa de atenção.`;
  } else {
    return `🔴 NPS negativo (${nps.toFixed(0)}). Clientes insatisfeitos predominam.`;
  }
}

/**
 * Insight para Meta de Receita
 */
export function gerarInsightMeta(atual: number, meta: number): string {
  const percentual = (atual / meta) * 100;
  const restante = meta - atual;
  const formatMoeda = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (percentual >= 100) {
    return `🏆 Meta atingida! ${formatMoeda(atual)} (${percentual.toFixed(1)}% da meta).`;
  } else if (percentual >= 90) {
    return `🏁 Quase lá! ${percentual.toFixed(1)}% da meta. Faltam ${formatMoeda(restante)}.`;
  } else if (percentual >= 70) {
    return `🚀 Bom progresso! ${percentual.toFixed(1)}% da meta. Restam ${formatMoeda(restante)}.`;
  } else if (percentual >= 50) {
    return `📊 Progresso moderado: ${percentual.toFixed(1)}%. Faltam ${formatMoeda(restante)} para a meta.`;
  } else {
    return `⚠️ Atenção: apenas ${percentual.toFixed(1)}% da meta. Acelere as ações!`;
  }
}

/**
 * Insight para Tempo de Conversao
 */
export function gerarInsightTempoConversao(tempoMedio: number): string {
  if (tempoMedio <= 3) {
    return `⚡ Conversão ultrarrápida (${tempoMedio.toFixed(1)} dias). Excelente eficiência!`;
  } else if (tempoMedio <= 7) {
    return `🚀 Conversão rápida (${tempoMedio.toFixed(1)} dias). Equipe está ágil.`;
  } else if (tempoMedio <= 14) {
    return `📈 Tempo de conversão razoável (${tempoMedio.toFixed(1)} dias).`;
  } else if (tempoMedio <= 30) {
    return `⚠️ Conversão lenta (${tempoMedio.toFixed(1)} dias). Otimize o follow-up.`;
  } else {
    return `🔴 Conversão muito lenta (${tempoMedio.toFixed(1)} dias). Revise o processo.`;
  }
}

/**
 * Insight para Vendedor
 */
export function gerarInsightVendedor(dados: {
  nome: string;
  conversao: number;
  ticket: number;
  tempo: number;
}): string {
  const insights: string[] = [];
  const { nome, conversao, ticket, tempo } = dados;

  if (conversao > 25) {
    insights.push(`✅ ${nome}: ótima conversão (${conversao.toFixed(1)}%).`);
  } else if (conversao < 15) {
    insights.push(`⚠️ ${nome}: conversão abaixo da média (${conversao.toFixed(1)}%).`);
  }

  if (ticket > 20000) {
    insights.push(`💎 Ticket alto (R$ ${ticket.toLocaleString("pt-BR")}).`);
  }

  if (tempo <= 5) {
    insights.push(`⚡ Conversão rápida (${tempo} dias).`);
  } else if (tempo > 14) {
    insights.push(`🐢 Conversão lenta (${tempo} dias).`);
  }

  return insights.length > 0 ? insights.join(" ") : `${nome}: performance dentro da média.`;
}

/**
 * Insight para Leads Ativos
 */
export function gerarInsightLeadsAtivos(quantidade: number): string {
  if (quantidade > 1500) {
    return `📌 ${quantidade} leads ativos. Follow-up precisa de reforço imediato!`;
  } else if (quantidade > 800) {
    return `🔍 ${quantidade} leads em aberto. Priorize por probabilidade de conversão.`;
  } else if (quantidade > 300) {
    return `📊 ${quantidade} leads ativos. Volume gerenciável.`;
  } else {
    return `✅ ${quantidade} leads ativos. Sob controle.`;
  }
}

// =============================================================================
// GERADOR DINAMICO DE INSIGHTS
// =============================================================================

/**
 * Regras de insight customizaveis
 */
const insightRules: Record<string, InsightRule[]> = {
  conversion: [
    {
      condition: (v) => v > 25,
      message: (v) => `🚀 Taxa de conversão excelente: ${v.toFixed(2)}%`,
      severity: "success",
      icon: "🚀",
    },
    {
      condition: (v) => v > 15,
      message: (v) => `📈 Taxa de conversão boa: ${v.toFixed(2)}%`,
      severity: "info",
      icon: "📈",
    },
    {
      condition: (v) => v > 5,
      message: (v) => `⚠️ Taxa de conversão baixa: ${v.toFixed(2)}%`,
      severity: "warning",
      icon: "⚠️",
    },
    {
      condition: () => true,
      message: (v) => `🔴 Taxa de conversão crítica: ${v.toFixed(2)}%`,
      severity: "danger",
      icon: "🔴",
    },
  ],
  roas: [
    {
      condition: (v) => v > 6,
      message: (v) => `💰 ROAS excelente: ${v.toFixed(2)}x`,
      severity: "success",
      icon: "💰",
    },
    {
      condition: (v) => v > 3,
      message: (v) => `📊 ROAS positivo: ${v.toFixed(2)}x`,
      severity: "info",
      icon: "📊",
    },
    {
      condition: (v) => v > 1,
      message: (v) => `⚠️ ROAS baixo: ${v.toFixed(2)}x`,
      severity: "warning",
      icon: "⚠️",
    },
    {
      condition: () => true,
      message: (v) => `🔴 ROAS negativo: ${v.toFixed(2)}x`,
      severity: "danger",
      icon: "🔴",
    },
  ],
};

/**
 * Gera insight dinamico baseado em regras
 */
export function generateDynamicInsight(
  type: string,
  value: number,
  ...args: number[]
): Insight | null {
  const rules = insightRules[type];
  if (!rules) return null;

  for (const rule of rules) {
    if (rule.condition(value, ...args)) {
      const message =
        typeof rule.message === "function"
          ? rule.message(value, ...args)
          : rule.message;

      return {
        id: `${type}-insight`,
        kpiId: type,
        message,
        severity: rule.severity,
        icon: rule.icon,
        value,
      };
    }
  }

  return null;
}

/**
 * Registra novas regras de insight
 */
export function registerInsightRules(type: string, rules: InsightRule[]): void {
  insightRules[type] = rules;
}

/**
 * Lista tipos de insight disponiveis
 */
export function listInsightTypes(): string[] {
  return Object.keys(insightRules);
}

// =============================================================================
// COMPARACOES E BENCHMARKS
// =============================================================================

/**
 * Compara valor com benchmark do setor
 */
export function compararComBenchmark(
  valor: number,
  benchmark: number,
  metrica: string,
  maiorMelhor: boolean = true
): string {
  const diferenca = ((valor - benchmark) / benchmark) * 100;
  const comparacao = maiorMelhor
    ? valor > benchmark
      ? "acima"
      : "abaixo"
    : valor < benchmark
      ? "melhor"
      : "pior";

  if (Math.abs(diferenca) < 5) {
    return `📊 ${metrica} está alinhado com o benchmark do setor.`;
  } else if (
    (maiorMelhor && diferenca > 0) ||
    (!maiorMelhor && diferenca < 0)
  ) {
    return `✅ ${metrica} está ${Math.abs(diferenca).toFixed(1)}% ${comparacao} do benchmark. Excelente!`;
  } else {
    return `⚠️ ${metrica} está ${Math.abs(diferenca).toFixed(1)}% ${comparacao} do benchmark. Oportunidade de melhoria.`;
  }
}

/**
 * Gera insight de tendencia
 */
export function gerarInsightTendencia(
  atual: number,
  anterior: number,
  metrica: string
): string {
  if (anterior === 0) return `📊 ${metrica}: ${atual} (sem dados anteriores para comparação).`;

  const variacao = ((atual - anterior) / anterior) * 100;

  if (variacao > 20) {
    return `🚀 ${metrica} cresceu ${variacao.toFixed(1)}% vs período anterior. Excelente tendência!`;
  } else if (variacao > 5) {
    return `📈 ${metrica} subiu ${variacao.toFixed(1)}% vs período anterior. Bom progresso.`;
  } else if (variacao > -5) {
    return `➡️ ${metrica} estável (${variacao > 0 ? "+" : ""}${variacao.toFixed(1)}%) vs período anterior.`;
  } else if (variacao > -20) {
    return `📉 ${metrica} caiu ${Math.abs(variacao).toFixed(1)}% vs período anterior. Monitore.`;
  } else {
    return `🔴 ${metrica} despencou ${Math.abs(variacao).toFixed(1)}% vs período anterior. Ação necessária!`;
  }
}

// =============================================================================
// EXPORTACOES PARA COMPATIBILIDADE
// =============================================================================

export {
  gerarInsightConversao as gerarInsightConversaoAtual,
  gerarInsightMeta as gerarAlertaMeta,
  gerarInsightLeadsAtivos as gerarAlertaLeadsAtivos,
};
