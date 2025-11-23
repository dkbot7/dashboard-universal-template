// Geração de insights automáticos e frases analíticas com base nos KPIs do BR Bank
// Portado de utils/insights_generator.py

export function gerarInsightConversaoAtual(taxaConversaoAtual: number): string {
  if (taxaConversaoAtual > 0.25) {
    return `🚀 Excelente! A taxa de conversão está em ${(taxaConversaoAtual * 100).toFixed(2)}%, superando o esperado.`
  } else if (taxaConversaoAtual > 0.20) {
    return `📈 Conversão razoável (${(taxaConversaoAtual * 100).toFixed(2)}%), mas com espaço para otimização.`
  } else {
    return `⚠️ Alerta: Conversão baixa (${(taxaConversaoAtual * 100).toFixed(2)}%). Reveja abordagem comercial e jornada.`
  }
}

export function gerarInsightRoas(roas: number): string {
  if (roas > 6) {
    return `💰 ROAS excelente (${roas.toFixed(2)}). Campanhas estão com alto retorno sobre investimento!`
  } else if (roas > 3) {
    return `📊 ROAS positivo (${roas.toFixed(2)}). Com potencial para escalar.`
  } else {
    return `🔻 ROAS baixo (${roas.toFixed(2)}). Avalie segmentações, criativos e canais.`
  }
}

interface DadosVendedor {
  nome: string
  conversao: number
  ticket: number
  tempo: number
}

export function gerarInsightVendedor(dados: DadosVendedor): string {
  const { nome, conversao, ticket, tempo } = dados
  const insights: string[] = []

  if (conversao > 0.25) {
    insights.push(`✅ ${nome} tem ótima taxa de conversão (${(conversao * 100).toFixed(2)}%).`)
  } else if (conversao < 0.22) {
    insights.push(`⚠️ ${nome} está abaixo da média (${(conversao * 100).toFixed(2)}%).`)
  }

  if (ticket > 19500) {
    insights.push(`💸 Ticket médio elevado (R$ ${ticket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`)
  }

  if (tempo <= 7) {
    insights.push(`⏱️ Conversão rápida (${tempo} dias).`)
  } else if (tempo > 10) {
    insights.push(`🐢 Conversão lenta (${tempo} dias). Avaliar follow-up.`)
  }

  return insights.join(" ")
}

export function gerarAlertaLeadsAtivos(leadsAtivos: number): string {
  if (leadsAtivos > 1500) {
    return `📌 Existem ${leadsAtivos} leads ativos. Follow-up precisa de reforço imediato.`
  } else if (leadsAtivos > 800) {
    return `🔍 ${leadsAtivos} leads em aberto. Priorizar por probabilidade de conversão.`
  } else {
    return `✅ Leads ativos sob controle (${leadsAtivos} leads).`
  }
}

interface MotivoPerda {
  motivo: string
  quantidade: number
}

export function gerarAlertaMotivosPerdaTop(motivoTop: MotivoPerda): string {
  return `📉 Motivo de perda mais comum: **${motivoTop.motivo}** – ${motivoTop.quantidade} leads.`
}

export function gerarAlertaMeta(meta: number, atual: number): string {
  const restante = meta - atual
  const percentual = (atual / meta) * 100

  if (percentual >= 90) {
    return `🏁 Estamos com ${percentual.toFixed(1)}% da meta atingida! Faltam apenas R$ ${restante.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
  } else if (percentual >= 70) {
    return `🚀 Progresso de ${percentual.toFixed(1)}%. Restam R$ ${restante.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} para a meta de R$ 30M.`
  } else {
    return `📊 Avanço atual: ${percentual.toFixed(1)}%. Ainda faltam R$ ${restante.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} para atingir a meta.`
  }
}

export function gerarInsightTempoConversao(tempoMedio: number): string {
  if (tempoMedio <= 5) {
    return `🚀 Tempo médio de conversão excelente (${tempoMedio.toFixed(1)} dias). Equipe está ágil!`
  } else if (tempoMedio <= 10) {
    return `📈 Tempo médio de conversão razoável (${tempoMedio.toFixed(1)} dias). Há espaço para melhorias.`
  } else {
    return `⚠️ Tempo médio de conversão alto (${tempoMedio.toFixed(1)} dias). Revisar processo de follow-up.`
  }
}
