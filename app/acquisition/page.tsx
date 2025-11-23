"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { loadDadosConsolidados, loadCalculos, DadosConsolidados, Calculos } from "@/lib/data-loader"
import {
  calcularCTR,
  calcularCPA,
  calcularROAS,
  calcularTaxaConversao,
} from "@/lib/kpi-calculator"
import { gerarInsightRoas } from "@/lib/insights-generator"
import { KPICard } from "@/components/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"

export default function AcquisitionPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dadosAds, setDadosAds] = useState<DadosConsolidados[]>([])
  const [calculos, setCalculos] = useState<Calculos[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [adsData, calculosData] = await Promise.all([
        loadDadosConsolidados(),
        loadCalculos()
      ])
      setDadosAds(adsData)
      setCalculos(calculosData)
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

  // Calcular KPIs Gerais
  const cliquesTotal = dadosAds.reduce((sum, row) => sum + Number(row.Cliques || 0), 0)
  const impressoesTotal = dadosAds.reduce((sum, row) => sum + Number(row["Impressões do anúncio"] || 0), 0)
  const investimentoTotal = dadosAds.reduce((sum, row) => sum + Number(row.Custo || 0), 0)

  // Buscar leads e receita dos cálculos
  const resumoGeral = calculos.filter(row => row.Bloco === "Resumo Geral")
  const leadsTotal = Number(resumoGeral.find(row => row.Métrica === "Leads Captados via Tráfego Pago")?.Valor || 0)
  const receitaTotal = Number(calculos.find(row => row["Receita Total"])?.["Receita Total"] || 0)

  const ctr = calcularCTR(cliquesTotal, impressoesTotal)
  const cpa = calcularCPA(investimentoTotal, leadsTotal)
  const roas = calcularROAS(receitaTotal, investimentoTotal)
  const taxaConvLead = calcularTaxaConversao(leadsTotal, cliquesTotal)

  // Insight automático de ROAS
  const insightRoas = gerarInsightRoas(roas)

  // Desempenho por Canal
  const canaisMap = new Map<string, {
    impressoes: number
    cliques: number
    custo: number
    conversoes: number
    receita: number
  }>()

  dadosAds.forEach(row => {
    const canal = String(row["CANAL_ORIGEM"] || "Desconhecido")
    if (!canaisMap.has(canal)) {
      canaisMap.set(canal, {
        impressoes: 0,
        cliques: 0,
        custo: 0,
        conversoes: 0,
        receita: 0,
      })
    }
    const canalData = canaisMap.get(canal)!
    canalData.impressoes += Number(row["Impressões do anúncio"]) || 0
    canalData.cliques += Number(row.Cliques) || 0
    canalData.custo += Number(row.Custo) || 0
    canalData.conversoes += Number(row.Conversões) || 0
    canalData.receita += Number(row.Receita) || 0
  })

  // Converter para array e calcular métricas por canal
  const dadosCanais = Array.from(canaisMap.entries()).map(([canal, data]) => {
    const leadsCanal = (data.conversoes > 0) ? data.conversoes : (data.cliques * 0.1) // Estimativa
    return {
      canal,
      impressoes: data.impressoes,
      cliques: data.cliques,
      custo: data.custo,
      leads: leadsCanal,
      receita: data.receita,
      ctr: calcularCTR(data.cliques, data.impressoes),
      cpa: calcularCPA(data.custo, leadsCanal),
      roas: calcularROAS(data.receita, data.custo),
      taxaConv: calcularTaxaConversao(leadsCanal, data.cliques),
    }
  }).sort((a, b) => b.custo - a.custo)

  // Dados para gráfico de pizza - distribuição de investimento
  const dadosPizza = dadosCanais.map(canal => ({
    name: canal.canal,
    value: canal.custo,
  }))

  // Dados para gráfico de barras - cliques por canal
  const dadosBarras = dadosCanais.map(canal => ({
    canal: canal.canal,
    cliques: canal.cliques,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">📈 Aquisição de Leads</h1>
        <p className="text-lg text-gray-600 mt-2">
          Métricas e desempenho por canal de mídia (Google Ads, Meta Ads)
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="CTR (Click-through Rate)"
          value={ctr}
          format="percentage"
          icon="🖱️"
        />
        <KPICard
          title="CPA (Custo por Lead)"
          value={cpa}
          format="currency"
          icon="💰"
        />
        <KPICard
          title="ROAS (Retorno sobre Ads)"
          value={roas}
          format="number"
          icon="📈"
        />
        <KPICard
          title="Conversão Clique → Lead"
          value={taxaConvLead}
          format="percentage"
          icon="🧲"
        />
      </div>

      {/* Investimento Total */}
      <KPICard
        title="Investimento Total"
        value={investimentoTotal}
        format="currency"
        icon="🎯"
      />

      {/* Insight de ROAS */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{insightRoas}</p>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Investimento por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={dadosPizza}
              dataKey="value"
              nameKey="name"
              colors={["#0043A4", "#0061F2", "#00B050", "#FFA800"]}
              height={300}
              formatTooltip={(value) =>
                `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cliques por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={dadosBarras}
              xKey="canal"
              bars={[
                {
                  key: "cliques",
                  color: "#0043A4",
                  name: "Cliques",
                },
              ]}
              height={300}
              formatYAxis={(value) => value.toLocaleString("pt-BR")}
              formatTooltip={(value) => value.toLocaleString("pt-BR")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Desempenho por Canal */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Desempenho por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={dadosCanais}
            columns={[
              { key: "canal", label: "Canal", align: "left" },
              {
                key: "impressoes",
                label: "Impressões",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "cliques",
                label: "Cliques",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "custo",
                label: "Custo",
                align: "right",
                format: (value) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              },
              {
                key: "leads",
                label: "Leads",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR", { maximumFractionDigits: 0 }),
              },
              {
                key: "receita",
                label: "Receita",
                align: "right",
                format: (value) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              },
              {
                key: "ctr",
                label: "CTR",
                align: "right",
                format: (value) => `${value.toFixed(2)}%`,
              },
              {
                key: "cpa",
                label: "CPA",
                align: "right",
                format: (value) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              },
              {
                key: "roas",
                label: "ROAS",
                align: "right",
                format: (value) => value.toFixed(2),
              },
              {
                key: "taxaConv",
                label: "Taxa Conv.",
                align: "right",
                format: (value) => `${value.toFixed(2)}%`,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center">
        Fonte: Dados consolidados das campanhas de Ads e cálculos (dados reais do BR Bank)
      </p>
    </div>
  )
}
