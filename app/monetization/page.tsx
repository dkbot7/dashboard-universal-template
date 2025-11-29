"use client"

import { useEffect, useState } from "react"
import { loadCRM, loadKPIs, CRMLead, DataRow } from "@/lib/data-loader"
import { calcularTicketMedio, calcularLTV } from "@/lib/kpi-calculator"
import { gerarAlertaMeta } from "@/lib/insights-generator"
import { KPICard } from "@/components/kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { BarChart } from "@/components/charts/bar-chart"
import { META_RECEITA } from "@/config/settings"

export default function MonetizationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [crmData, setCrmData] = useState<CRMLead[]>([])
  const [kpisData, setKpisData] = useState<DataRow[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [crm, kpis] = await Promise.all([
        loadCRM(),
        loadKPIs()
      ])
      setCrmData(crm)
      setKpisData(kpis)
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

  // Filtrar apenas leads convertidos
  const leadsConvertidos = crmData.filter(
    (lead) =>
      lead["STATUS DO LEAD"] === "Convertido" && Number(lead["Receita Gerada"]) > 0
  )

  // Calcular KPIs Gerais
  const receitaTotal = leadsConvertidos.reduce(
    (sum, lead) => sum + Number(lead["Receita Gerada"] || 0),
    0
  )
  const totalClientes = leadsConvertidos.length
  const ticketMedio = calcularTicketMedio(receitaTotal, totalClientes)
  const ltv = calcularLTV(ticketMedio)

  // Buscar meta de receita dos KPIs (ou usar padrão)
  const metaReceita = Number(
    kpisData.find((kpi) => kpi.KPI === "Meta de Receita")?.Valor ||
    META_RECEITA
  )

  // Gerar alerta de meta
  const alertaMeta = gerarAlertaMeta(metaReceita, receitaTotal)

  // Cálculo de progresso da meta
  const percentualMeta = (receitaTotal / metaReceita) * 100
  const receitaFaltante = metaReceita - receitaTotal

  // Performance por Vendedor
  const vendedoresMap = new Map<
    string,
    {
      receita: number
      leadsConvertidos: number
      ticketMedio: number
    }
  >()

  leadsConvertidos.forEach((lead) => {
    const vendedor = String(lead["Vendedor que atendeu"] || "Não atribuído")
    if (!vendedoresMap.has(vendedor)) {
      vendedoresMap.set(vendedor, {
        receita: 0,
        leadsConvertidos: 0,
        ticketMedio: 0,
      })
    }
    const vendedorData = vendedoresMap.get(vendedor)!
    vendedorData.receita += Number(lead["Receita Gerada"] || 0)
    vendedorData.leadsConvertidos++
  })

  // Converter para array e calcular ticket médio por vendedor
  const vendedoresData = Array.from(vendedoresMap.entries())
    .map(([vendedor, data]) => ({
      vendedor,
      receita: data.receita,
      leadsConvertidos: data.leadsConvertidos,
      ticketMedio: calcularTicketMedio(data.receita, data.leadsConvertidos),
      ltv: calcularLTV(
        calcularTicketMedio(data.receita, data.leadsConvertidos)
      ),
    }))
    .sort((a, b) => b.receita - a.receita)

  // Top 10 vendedores para o gráfico
  const top10Vendedores = vendedoresData.slice(0, 10).map((v) => ({
    vendedor: v.vendedor,
    receita: v.receita,
  }))

  // Distribuição de Receita por Faixa de Ticket
  const faixasTicket = [
    { min: 0, max: 10000, label: "Até R$ 10k" },
    { min: 10000, max: 15000, label: "R$ 10k - R$ 15k" },
    { min: 15000, max: 20000, label: "R$ 15k - R$ 20k" },
    { min: 20000, max: 25000, label: "R$ 20k - R$ 25k" },
    { min: 25000, max: Infinity, label: "Acima de R$ 25k" },
  ]

  const distribuicaoFaixas = faixasTicket.map((faixa) => {
    const leadsNaFaixa = leadsConvertidos.filter(
      (lead) => {
        const receita = Number(lead["Receita Gerada"])
        return receita >= faixa.min && receita < faixa.max
      }
    )
    return {
      faixa: faixa.label,
      quantidade: leadsNaFaixa.length,
      receita: leadsNaFaixa.reduce(
        (sum, lead) => sum + Number(lead["Receita Gerada"] || 0),
        0
      ),
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          💰 Monetização
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Avalie o desempenho financeiro, ticket médio por cliente e ranking dos
          vendedores
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Receita Total"
          value={receitaTotal}
          format="currency"
          icon="💵"
        />
        <KPICard
          title="Ticket Médio"
          value={ticketMedio}
          format="currency"
          icon="🎟️"
        />
        <KPICard
          title="LTV Estimado"
          value={ltv}
          format="currency"
          icon="📈"
        />
      </div>

      {/* Meta de Receita */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Meta de Receita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">{alertaMeta}</p>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progresso: {percentualMeta.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-600">
                  Meta: R${" "}
                  {metaReceita.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(percentualMeta, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Faltam R${" "}
                {receitaFaltante.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                para atingir a meta
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📊 Top 10 Vendedores por Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={top10Vendedores}
              xKey="vendedor"
              bars={[
                {
                  key: "receita",
                  color: "#00B050",
                  name: "Receita",
                },
              ]}
              height={350}
              layout="vertical"
              formatYAxis={(value) =>
                `R$ ${Number(value).toLocaleString("pt-BR", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}`
              }
              formatTooltip={(value) =>
                `R$ ${Number(value).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💸 Distribuição por Faixa de Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={distribuicaoFaixas}
              xKey="faixa"
              bars={[
                {
                  key: "quantidade",
                  color: "#0043A4",
                  name: "Clientes",
                },
              ]}
              height={350}
              formatYAxis={(value) => value.toLocaleString("pt-BR")}
              formatTooltip={(value) => `${value} clientes`}
            />
          </CardContent>
        </Card>
      </div>

      {/* Ranking Completo de Vendedores */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Ranking de Vendedores (Receita)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={vendedoresData}
            columns={[
              { key: "vendedor", label: "Vendedor", align: "left" },
              {
                key: "receita",
                label: "Receita Total",
                align: "right",
                format: (value) =>
                  `R$ ${value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
              {
                key: "leadsConvertidos",
                label: "Leads Convertidos",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "ticketMedio",
                label: "Ticket Médio",
                align: "right",
                format: (value) =>
                  `R$ ${value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
              {
                key: "ltv",
                label: "LTV Estimado",
                align: "right",
                format: (value) =>
                  `R$ ${value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Distribuição de Receita por Faixa */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Análise Detalhada por Faixa de Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={distribuicaoFaixas}
            columns={[
              { key: "faixa", label: "Faixa de Ticket", align: "left" },
              {
                key: "quantidade",
                label: "Quantidade de Clientes",
                align: "right",
                format: (value) => value.toLocaleString("pt-BR"),
              },
              {
                key: "receita",
                label: "Receita Total",
                align: "right",
                format: (value) =>
                  `R$ ${value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center">
        Fonte: dados do CRM e dicionário de KPIs (dados reais do BR Bank)
      </p>
    </div>
  )
}
