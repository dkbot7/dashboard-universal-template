// =============================================================================
// KPI-CALCULATOR.TS - CALCULADORA UNIVERSAL DE KPIs
// =============================================================================
// Funcoes genericas para calculo de metricas de negocio
// =============================================================================

import { LOCALE, KPIS } from "@/config/settings";
import type { DataRow } from "./data-loader";

// =============================================================================
// TIPOS
// =============================================================================

export interface KPIResult {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  format: "currency" | "percentage" | "number" | "decimal";
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    isPositive: boolean;
  };
  status?: "success" | "warning" | "danger" | "neutral";
}

export interface CalculationContext {
  [key: string]: number | string | DataRow[];
}

// =============================================================================
// FORMULAS PADRAO DE KPIs
// =============================================================================

/**
 * CAC - Custo de Aquisicao de Cliente
 * Formula: (Custo Ads + Custo Vendas) / Clientes Adquiridos
 */
export function calcularCAC(
  custoAds: number,
  custoVendas: number,
  numClientes: number
): number {
  if (numClientes === 0) return 0;
  return (custoAds + custoVendas) / numClientes;
}

/**
 * ROAS - Return on Ad Spend
 * Formula: Receita / Custo com Ads
 */
export function calcularROAS(receita: number, custoAds: number): number {
  if (custoAds === 0) return 0;
  return receita / custoAds;
}

/**
 * CPA - Custo por Aquisicao de Lead
 * Formula: Custo Total / Numero de Leads
 */
export function calcularCPA(custoTotal: number, numLeads: number): number {
  if (numLeads === 0) return 0;
  return custoTotal / numLeads;
}

/**
 * CPC - Custo por Clique
 * Formula: Custo / Cliques
 */
export function calcularCPC(custoTotal: number, numCliques: number): number {
  if (numCliques === 0) return 0;
  return custoTotal / numCliques;
}

/**
 * CTR - Click Through Rate
 * Formula: (Cliques / Impressoes) * 100
 */
export function calcularCTR(cliques: number, impressoes: number): number {
  if (impressoes === 0) return 0;
  return (cliques / impressoes) * 100;
}

/**
 * Taxa de Conversao
 * Formula: (Conversoes / Total) * 100
 */
export function calcularTaxaConversao(
  conversoes: number,
  total: number
): number {
  if (total === 0) return 0;
  return (conversoes / total) * 100;
}

/**
 * Ticket Medio
 * Formula: Receita Total / Numero de Vendas
 */
export function calcularTicketMedio(receita: number, numVendas: number): number {
  if (numVendas === 0) return 0;
  return receita / numVendas;
}

/**
 * LTV - Lifetime Value
 * Formula: Ticket Medio * Frequencia de Compra * Tempo de Vida
 */
export function calcularLTV(
  ticketMedio: number,
  frequenciaCompra: number = 1,
  tempoVidaMeses: number = 12
): number {
  return ticketMedio * frequenciaCompra * tempoVidaMeses;
}

/**
 * Margem de Lucro
 * Formula: ((Receita - Custo) / Receita) * 100
 */
export function calcularMargemLucro(receita: number, custo: number): number {
  if (receita === 0) return 0;
  return ((receita - custo) / receita) * 100;
}

/**
 * ROI - Return on Investment
 * Formula: ((Ganho - Investimento) / Investimento) * 100
 */
export function calcularROI(ganho: number, investimento: number): number {
  if (investimento === 0) return 0;
  return ((ganho - investimento) / investimento) * 100;
}

/**
 * Churn Rate
 * Formula: (Clientes Perdidos / Total Clientes Inicio) * 100
 */
export function calcularChurnRate(
  clientesPerdidos: number,
  totalClientesInicio: number
): number {
  if (totalClientesInicio === 0) return 0;
  return (clientesPerdidos / totalClientesInicio) * 100;
}

/**
 * MRR - Monthly Recurring Revenue
 * Formula: Numero de Clientes * Valor Medio Mensal
 */
export function calcularMRR(numClientes: number, valorMedio: number): number {
  return numClientes * valorMedio;
}

/**
 * ARR - Annual Recurring Revenue
 * Formula: MRR * 12
 */
export function calcularARR(mrr: number): number {
  return mrr * 12;
}

/**
 * NPS - Net Promoter Score
 * Formula: % Promotores - % Detratores
 */
export function calcularNPS(
  promotores: number,
  detratores: number,
  total: number
): number {
  if (total === 0) return 0;
  return ((promotores - detratores) / total) * 100;
}

/**
 * GMV - Gross Merchandise Value
 * Formula: Soma de todas as transacoes
 */
export function calcularGMV(transacoes: number[]): number {
  return transacoes.reduce((sum, val) => sum + val, 0);
}

/**
 * AOV - Average Order Value
 * Formula: GMV / Numero de Pedidos
 */
export function calcularAOV(gmv: number, numPedidos: number): number {
  if (numPedidos === 0) return 0;
  return gmv / numPedidos;
}

// =============================================================================
// CALCULADORA DINAMICA
// =============================================================================

/**
 * Mapa de funcoes de calculo disponiveis
 */
const calculators: Record<string, (...args: number[]) => number> = {
  cac: (custoAds, custoVendas, numClientes) =>
    calcularCAC(custoAds, custoVendas, numClientes),
  roas: (receita, custoAds) => calcularROAS(receita, custoAds),
  cpa: (custo, leads) => calcularCPA(custo, leads),
  cpc: (custo, cliques) => calcularCPC(custo, cliques),
  ctr: (cliques, impressoes) => calcularCTR(cliques, impressoes),
  taxaConversao: (conversoes, total) => calcularTaxaConversao(conversoes, total),
  ticketMedio: (receita, vendas) => calcularTicketMedio(receita, vendas),
  ltv: (ticket, frequencia, tempo) => calcularLTV(ticket, frequencia, tempo),
  margemLucro: (receita, custo) => calcularMargemLucro(receita, custo),
  roi: (ganho, investimento) => calcularROI(ganho, investimento),
  churnRate: (perdidos, inicio) => calcularChurnRate(perdidos, inicio),
  mrr: (clientes, valor) => calcularMRR(clientes, valor),
  arr: (mrr) => calcularARR(mrr),
  aov: (gmv, pedidos) => calcularAOV(gmv, pedidos),
};

/**
 * Calcula um KPI dinamicamente pelo nome
 */
export function calculate(
  kpiName: string,
  ...args: number[]
): number {
  const calculator = calculators[kpiName.toLowerCase()];
  if (!calculator) {
    console.warn(`Calculator for "${kpiName}" not found`);
    return 0;
  }
  return calculator(...args);
}

/**
 * Calcula multiplos KPIs de uma vez
 */
export function calculateMultiple(
  calculations: { kpi: string; args: number[] }[]
): Record<string, number> {
  const results: Record<string, number> = {};
  calculations.forEach(({ kpi, args }) => {
    results[kpi] = calculate(kpi, ...args);
  });
  return results;
}

// =============================================================================
// CALCULO A PARTIR DE DADOS
// =============================================================================

/**
 * Calcula KPIs a partir de um array de dados
 */
export function calculateFromData<T extends DataRow>(
  data: T[],
  config: {
    kpi: string;
    fields: string[];
    aggregation?: "sum" | "avg" | "count";
  }[]
): Record<string, number> {
  const results: Record<string, number> = {};

  config.forEach(({ kpi, fields, aggregation = "sum" }) => {
    const values = fields.map((field) => {
      switch (aggregation) {
        case "sum":
          return data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
        case "avg":
          if (data.length === 0) return 0;
          return (
            data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0) /
            data.length
          );
        case "count":
          return data.filter((row) => row[field] !== null && row[field] !== undefined).length;
        default:
          return 0;
      }
    });

    results[kpi] = calculate(kpi, ...values);
  });

  return results;
}

// =============================================================================
// FORMATACAO
// =============================================================================

/**
 * Formata valor como moeda
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat(LOCALE.language, {
    style: "currency",
    currency: LOCALE.currency,
  }).format(valor);
}

/**
 * Formata valor como porcentagem
 */
export function formatarPorcentagem(
  valor: number,
  casasDecimais: number = 2
): string {
  return `${valor.toLocaleString(LOCALE.language, {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  })}%`;
}

/**
 * Formata valor como numero
 */
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat(LOCALE.language).format(valor);
}

/**
 * Formata valor como decimal
 */
export function formatarDecimal(
  valor: number,
  casasDecimais: number = 2
): string {
  return valor.toLocaleString(LOCALE.language, {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  });
}

/**
 * Formata valor de acordo com o tipo
 */
export function formatValue(
  value: number,
  format: "currency" | "percentage" | "number" | "decimal"
): string {
  switch (format) {
    case "currency":
      return formatarMoeda(value);
    case "percentage":
      return formatarPorcentagem(value);
    case "decimal":
      return formatarDecimal(value);
    case "number":
    default:
      return formatarNumero(value);
  }
}

// =============================================================================
// ANALISE DE TENDENCIA
// =============================================================================

/**
 * Calcula tendencia entre dois valores
 */
export function calcularTendencia(
  atual: number,
  anterior: number,
  goodDirection: "up" | "down" | "neutral" = "up"
): {
  value: number;
  direction: "up" | "down" | "neutral";
  isPositive: boolean;
} {
  if (anterior === 0) {
    return { value: 0, direction: "neutral", isPositive: true };
  }

  const variacao = ((atual - anterior) / anterior) * 100;
  const direction = variacao > 0 ? "up" : variacao < 0 ? "down" : "neutral";

  let isPositive: boolean;
  if (goodDirection === "neutral") {
    isPositive = true;
  } else if (goodDirection === "up") {
    isPositive = variacao >= 0;
  } else {
    isPositive = variacao <= 0;
  }

  return {
    value: Math.abs(variacao),
    direction,
    isPositive,
  };
}

/**
 * Determina status baseado em thresholds
 */
export function determinarStatus(
  valor: number,
  thresholds: { good: number; warning: number; danger: number },
  goodDirection: "up" | "down" = "up"
): "success" | "warning" | "danger" {
  if (goodDirection === "up") {
    if (valor >= thresholds.good) return "success";
    if (valor >= thresholds.warning) return "warning";
    return "danger";
  } else {
    if (valor <= thresholds.good) return "success";
    if (valor <= thresholds.warning) return "warning";
    return "danger";
  }
}

// =============================================================================
// CALCULO COMPLETO DE KPI
// =============================================================================

/**
 * Calcula um KPI completo com formatacao e status
 */
export function calcularKPICompleto(
  kpiId: string,
  valor: number,
  valorAnterior?: number
): KPIResult {
  const kpiConfig = KPIS.find((k) => k.id === kpiId);

  if (!kpiConfig) {
    return {
      id: kpiId,
      name: kpiId,
      value: valor,
      formattedValue: formatarNumero(valor),
      format: "number",
    };
  }

  const result: KPIResult = {
    id: kpiId,
    name: kpiConfig.name,
    value: valor,
    formattedValue: formatValue(valor, kpiConfig.format),
    format: kpiConfig.format,
  };

  // Adicionar tendencia se houver valor anterior
  if (valorAnterior !== undefined) {
    result.trend = calcularTendencia(
      valor,
      valorAnterior,
      kpiConfig.goodDirection
    );
  }

  // Adicionar status se houver thresholds
  if (kpiConfig.thresholds) {
    result.status = determinarStatus(
      valor,
      kpiConfig.thresholds,
      kpiConfig.goodDirection
    );
  }

  return result;
}

/**
 * Calcula multiplos KPIs completos
 */
export function calcularKPIsCompletos(
  kpis: { id: string; valor: number; valorAnterior?: number }[]
): KPIResult[] {
  return kpis.map(({ id, valor, valorAnterior }) =>
    calcularKPICompleto(id, valor, valorAnterior)
  );
}

// =============================================================================
// UTILITARIOS
// =============================================================================

/**
 * Registra uma nova funcao de calculo
 */
export function registerCalculator(
  name: string,
  fn: (...args: number[]) => number
): void {
  calculators[name.toLowerCase()] = fn;
}

/**
 * Lista todas as funcoes de calculo disponiveis
 */
export function listCalculators(): string[] {
  return Object.keys(calculators);
}

/**
 * Verifica se uma funcao de calculo existe
 */
export function hasCalculator(name: string): boolean {
  return name.toLowerCase() in calculators;
}
