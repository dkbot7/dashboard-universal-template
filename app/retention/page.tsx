"use client"

import { useEffect, useState } from "react"
import { loadCRM, loadCalculos, CRMLead, Calculos } from "@/lib/data-loader"
import { calcularTaxaConversao } from "@/lib/kpi-calculator"
import { gerarInsightTempoConversao, gerarAlertaLeadsAtivos } from "@/lib/insights-generator"
import { KPICard } from "@/components/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { PieChart } from "@/components/charts/pie-chart"
import { BarChart } from "@/components/charts/bar-chart"

export default function RetentionPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [crmData, setCrmData] = useState<CRMLead[]>([])
  const [calculos, setCalculos] = useState<Calculos[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [crm, calc] = await Promise.all([
        loadCRM(),
        loadCalculos()
      ])
      setCrmData(crm)
      setCalculos(calc)
      setIsLoading(false)
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados reais...</p>
        </div>
      </div>
    )
  }

  // Filtrar leads válidos
  const leadsValidos = crmData.filter(
    (lead) => lead.ID_Lead && lead["STATUS DO LEAD"]
  )

  // Métricas Globais do Funil
  const resumoGeral = calculos.filter((row) => row.Bloco === "Resumo Geral")
  const visitantes = Number(
    resumoGeral.find((row) => row.Métrica === "Visitantes no site")?.Valor || 0
  )
  const leadsTotal = Number(
    resumoGeral.find((row) => row.Métrica === "Leads Captados via Tráfego Pago")
      ?.Valor || leadsValidos.length
  )

  // Contagem por status
  const statusCounts = leadsValidos.reduce(
    (acc, lead) => {
      const status = lead["STATUS DO LEAD"]
      if (status === "Convertido") {
        acc.convertidos++
      } else if (status === "Perdido") {
        acc.perdidos++
      } else if (status === "Em Atendimento" || status === "Não Contatado") {
        acc.ativos++
      }
      acc.total++
      return acc
    },
    { convertidos: 0, perdidos: 0, ativos: 0, total: 0 }
  )

  // Calcular taxas
  const taxaVisLead = calcularTaxaConversao(leadsTotal, visitantes)
  const taxaLeadCliente = calcularTaxaConversao(
    statusCounts.convertidos,
    statusCounts.total
  )

  // Tempo médio de conversão (apenas leads convertidos)
  const leadsConvertidos = leadsValidos.filter(
    (lead) => lead["STATUS DO LEAD"] === "Convertido" && lead["Tempo até Conversão (Dias)"] >= 0
  )
  const tempoMedio =
    leadsConvertidos.length > 0
      ? leadsConvertidos.reduce(
          (sum, lead) => sum + (Number(lead["Tempo até Conversão (Dias)"]) || 0),
          0
        ) / leadsConvertidos.length
      : 0

  // Insights automáticos
  const insightTempo = gerarInsightTempoConversao(tempoMedio)
  const alertaLeadsAtivos = gerarAlertaLeadsAtivos(statusCounts.ativos)

  // Análise de Motivos de Perda
  const leadsPerdidos = leadsValidos.filter(
    (lead) => lead["STATUS DO LEAD"] === "Perdido" && lead["Motivo da Perda"]
  )

  const motivosPerda = leadsPerdidos.reduce(
    (acc, lead) => {
      const motivo = String(lead["Motivo da Perda"] || "Não especificado")
      if (!acc[motivo]) {
        acc[motivo] = 0
      }
      acc[motivo]++
      return acc
    },
    {} as Record<string, number>
  )

  const motivosPerdaArray = Object.entries(motivosPerda)
    .map(([motivo, quantidade]) => ({
      motivo,
      quantidade,
      percentual: (quantidade / leadsPerdidos.length) * 100,
    }))
    .sort((a, b) => b.quantidade - a.quantidade)

  // Dados para gráfico de pizza - distribuição de status
  const dadosPizza = [
    { name: "Convertidos", value: statusCounts.convertidos },
    { name: "Perdidos", value: statusCounts.perdidos },
    { name: "Ativos", value: statusCounts.ativos },
  ]

  // Dados para gráfico de barras - top motivos de perda
  const top5Motivos = motivosPerdaArray.slice(0, 5).map((item) => ({
    motivo: item.motivo.substring(0, 20) + (item.motivo.length > 20 ? "..." : ""),
    quantidade: item.quantidade,
  }))

  // Performance por Vendedor
  const vendedoresMap = new Map<
    string,
    {
      total: number
      convertidos: number
      perdidos: number
      ativos: number
      tempoMedio: number
      conversoes: number[]
    }
  >()

  leadsValidos.forEach((lead) => {
    const vendedor = String(lead["Vendedor que atendeu"] || "Não atribuído")
    if (!vendedoresMap.has(vendedor)) {
      vendedoresMap.set(vendedor, {
        total: 0,
        convertidos: 0,
        perdidos: 0,
        ativos: 0,
        tempoMedio: 0,
        conversoes: [],
      })
    }
    const vendedorData = vendedoresMap.get(vendedor)!
    vendedorData.total++

    const status = lead["STATUS DO LEAD"]
    if (status === "Convertido") {
      vendedorData.convertidos++
      const tempo = Number(lead["Tempo até Conversão (Dias)"])
      if (tempo >= 0) {
        vendedorData.conversoes.push(tempo)
      }
    } else if (status === "Perdido") {
      vendedorData.perdidos++
    } else {
      vendedorData.ativos++
    }
  })

  const vendedoresData = Array.from(vendedoresMap.entries())
    .map(([vendedor, data]) => {
      const tempoMedio =
        data.conversoes.length > 0
          ? data.conversoes.reduce((sum, t) => sum + t, 0) / data.conversoes.length
          : 0
      return {
        vendedor,
        total: data.total,
        convertidos: data.convertidos,
        perdidos: data.perdidos,
        ativos: data.ativos,
        taxaConversao: calcularTaxaConversao(data.convertidos, data.total),
        tempoMedio,
      }
    })
    .sort((a, b) => b.taxaConversao - a.taxaConversao)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">🔁 Retenção de Leads</h1>
        <p className="text-lg text-gray-600 mt-2">
          Análise da jornada do lead, tempo médio de conversão e principais motivos de perda
        </p>
      </div>

      {/* KPIs do Funil */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Conversão Visitante → Lead"
          value={taxaVisLead}
          format="percentage"
          icon="📥"
        />
        <KPICard
          title="Conversão Lead → Cliente"
          value={taxaLeadCliente}
          format="percentage"
          icon="🎯"
        />
        <KPICard
          title="Tempo médio de conversão"
          value={tempoMedio}
          format="number"
          icon="⏱️"
        />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>💡 Insight: Tempo de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{insightTempo}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📌 Alerta: Leads Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{alertaLeadsAtivos}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={dadosPizza}
              dataKey="value"
              nameKey="name"
              colors={["#00B050", "#D80027", "#FFA800"]}
              height={300}
              formatTooltip={(value) => `${Number(value).toLocaleString("pt-BR")} leads`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Motivos de Perda</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={top5Motivos}
              xKey="motivo"
              bars={[
                {
                  key: "quantidade",
                  color: "#D80027",
                  name: "Leads Perdidos",
                },
              ]}
              height={300}
              layout="vertical"
              formatYAxis={(value) => value.toLocaleString("pt-BR")}
              formatTooltip={(value) => `${value} leads`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Motivos de Perda */}
      <Card>
        <CardHeader>
          <CardTitle>💔 Motivos de Perda Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Análise dos principais motivos pelos quais leads não foram convertidos.
          </p>
          <DataTable
            data={motivosPerdaArray}
            columns={[
              { key: "motivo", label: "Motivo", align: "left" },
              {
                key: "quantidade",
                label: "Quantidade",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "percentual",
                label: "Percentual",
                align: "right",
                format: (value) => `${value.toFixed(2)}%`,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Tabela de Performance por Vendedor */}
      <Card>
        <CardHeader>
          <CardTitle>👥 Performance por Vendedor</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={vendedoresData}
            columns={[
              { key: "vendedor", label: "Vendedor", align: "left" },
              {
                key: "total",
                label: "Total Leads",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "convertidos",
                label: "Convertidos",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "perdidos",
                label: "Perdidos",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "ativos",
                label: "Ativos",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "taxaConversao",
                label: "Taxa Conversão",
                align: "right",
                format: (value) => `${value.toFixed(2)}%`,
              },
              {
                key: "tempoMedio",
                label: "Tempo Médio",
                align: "right",
                format: (value) => `${value.toFixed(1)} dias`,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center">
        ✅ Use esses dados para refinar abordagens e identificar oportunidades de melhoria.
      </p>
      <p className="text-sm text-gray-500 text-center">
        Fonte: dados do CRM e cálculos (dados reais do BR Bank)
      </p>
    </div>
  )
}
