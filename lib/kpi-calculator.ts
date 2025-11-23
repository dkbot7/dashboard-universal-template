// 📈 lib/kpi-calculator.ts
// Funções para cálculo dos KPIs essenciais do Dashboard BR Bank

// CAC – Custo de Aquisição de Cliente
// Fórmula: (Custo Ads + Custo Time de Vendas) / Clientes Adquiridos
export function calcularCAC(
  custoAds: number,
  custoVendas: number,
  numClientes: number
): number {
  if (numClientes === 0) return 0;
  return (custoAds + custoVendas) / numClientes;
}

// ROAS – Return on Ad Spend
// Fórmula: Receita / Custo com Ads
export function calcularROAS(receita: number, custoAds: number): number {
  if (custoAds === 0) return 0;
  return receita / custoAds;
}

// CPA – Custo por Aquisição de Lead
// Fórmula: Custo Total / Nº de Leads Convertidos
export function calcularCPA(
  custoTotal: number,
  numLeadsConvertidos: number
): number {
  if (numLeadsConvertidos === 0) return 0;
  return custoTotal / numLeadsConvertidos;
}

// CPC – Custo por Clique
// Fórmula: Custo / Cliques
export function calcularCPC(custoTotal: number, numCliques: number): number {
  if (numCliques === 0) return 0;
  return custoTotal / numCliques;
}

// CTR – Click Through Rate
// Fórmula: Cliques / Impressões
export function calcularCTR(cliques: number, impressoes: number): number {
  if (impressoes === 0) return 0;
  return cliques / impressoes;
}

// Taxa de Conversão de Leads → Clientes
// Fórmula: Nº de Clientes / Nº de Leads
export function calcularTaxaConversao(
  clientes: number,
  leads: number
): number {
  if (leads === 0) return 0;
  return clientes / leads;
}

// Taxa de Conversão de Visitantes → Leads
// Fórmula: Leads / Visitantes
export function calcularConversaoVisitantesParaLeads(
  leads: number,
  visitantes: number
): number {
  if (visitantes === 0) return 0;
  return leads / visitantes;
}

// Ticket Médio
// Fórmula: Receita Total / Nº de Clientes
export function calcularTicketMedio(
  receitaTotal: number,
  numClientes: number
): number {
  if (numClientes === 0) return 0;
  return receitaTotal / numClientes;
}

// LTV – Lifetime Value
// Fórmula: Receita média estimada por cliente no período de 12 meses
export function calcularLTV(ticketMedio: number, meses: number = 12): number {
  return ticketMedio * (meses / 12);
}

// Formatação de moeda
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Formatação de porcentagem
export function formatarPorcentagem(valor: number, casasDecimais: number = 2): string {
  return `${valor.toFixed(casasDecimais)}%`;
}

// Formatação de número
export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}
