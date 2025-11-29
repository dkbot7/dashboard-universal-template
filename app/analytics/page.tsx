"use client"

import { useEffect, useState } from "react"
import { loadCRM, CRMLead } from "@/lib/data-loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { LineChart } from "@/components/charts/line-chart"
import { Download, Filter } from "lucide-react"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [crmData, setCrmData] = useState<CRMLead[]>([])

  // Filters
  const [selectedCanal, setSelectedCanal] = useState<string>("Todos")
  const [selectedCampanha, setSelectedCampanha] = useState<string>("Todas")
  const [selectedVendedor, setSelectedVendedor] = useState<string>("Todos")
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos")

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const crm = await loadCRM()
      setCrmData(crm)
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

  // Extract unique values for filters
  const canais = ["Todos", ...new Set(crmData.map(lead => String(lead["Canal de Origem"] || "Não informado")))]
  const campanhas = ["Todas", ...new Set(crmData.map(lead => String(lead["Campanha"] || "Não informada")))]
  const vendedores = ["Todos", ...new Set(crmData.map(lead => String(lead["Vendedor que atendeu"] || "Não atribuído")))]
  const statusList = ["Todos", ...new Set(crmData.map(lead => String(lead["STATUS DO LEAD"])))]

  // Apply filters
  const dadosFiltrados = crmData.filter((lead) => {
    const matchCanal = selectedCanal === "Todos" || String(lead["Canal de Origem"] || "Não informado") === selectedCanal
    const matchCampanha = selectedCampanha === "Todas" || String(lead["Campanha"] || "Não informada") === selectedCampanha
    const matchVendedor = selectedVendedor === "Todos" || String(lead["Vendedor que atendeu"] || "Não atribuído") === selectedVendedor
    const matchStatus = selectedStatus === "Todos" || String(lead["STATUS DO LEAD"]) === selectedStatus

    return matchCanal && matchCampanha && matchVendedor && matchStatus
  })

  // Temporal evolution - group by month
  const leadsPorMes = dadosFiltrados.reduce((acc, lead) => {
    const dataContato = lead["Data do Primeiro Contato"]
    if (!dataContato) return acc

    // Extract month from date (assuming format DD/MM/YYYY)
    const dateStr = String(dataContato)
    const parts = dateStr.split("/")
    if (parts.length === 3) {
      const mes = `${parts[1]}/${parts[2]}` // MM/YYYY
      if (!acc[mes]) {
        acc[mes] = 0
      }
      acc[mes]++
    }
    return acc
  }, {} as Record<string, number>)

  // Convert to array and sort by date
  const dadosTemporais = Object.entries(leadsPorMes)
    .map(([mes, quantidade]) => ({
      mes,
      leads: quantidade,
    }))
    .sort((a, b) => {
      const [mesA, anoA] = a.mes.split("/").map(Number)
      const [mesB, anoB] = b.mes.split("/").map(Number)
      return anoA !== anoB ? anoA - anoB : mesA - mesB
    })

  // Prepare data for detailed table
  const dadosTabela = dadosFiltrados.map((lead) => ({
    id: lead.ID_Lead,
    data: lead["Data do Primeiro Contato"],
    canal: lead["Canal de Origem"] || "Não informado",
    campanha: lead["Campanha"] || "Não informada",
    vendedor: lead["Vendedor que atendeu"] || "Não atribuído",
    status: lead["STATUS DO LEAD"],
    receita: Number(lead["Receita Gerada"] || 0),
    tempoConversao: Number(lead["Tempo até Conversão (Dias)"] || 0),
  }))

  // CSV Export function
  const exportarCSV = () => {
    const headers = [
      "ID Lead",
      "Data Primeiro Contato",
      "Canal de Origem",
      "Campanha",
      "Vendedor",
      "Status",
      "Receita Gerada",
      "Tempo até Conversão (Dias)",
    ]

    const rows = dadosFiltrados.map((lead) => [
      lead.ID_Lead,
      lead["Data do Primeiro Contato"],
      lead["Canal de Origem"] || "Não informado",
      lead["Campanha"] || "Não informada",
      lead["Vendedor que atendeu"] || "Não atribuído",
      lead["STATUS DO LEAD"],
      lead["Receita Gerada"],
      lead["Tempo até Conversão (Dias)"],
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `analytics_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">📊 Analytics</h1>
        <p className="text-lg text-gray-600 mt-2">
          Explore os dados com filtros avançados e visualize a evolução temporal dos leads
        </p>
      </div>

      {/* Filters Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Canal Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de Origem
              </label>
              <select
                value={selectedCanal}
                onChange={(e) => setSelectedCanal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {canais.map((canal) => (
                  <option key={canal} value={canal}>
                    {canal}
                  </option>
                ))}
              </select>
            </div>

            {/* Campanha Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campanha
              </label>
              <select
                value={selectedCampanha}
                onChange={(e) => setSelectedCampanha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {campanhas.map((campanha) => (
                  <option key={campanha} value={campanha}>
                    {campanha}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendedor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendedor
              </label>
              <select
                value={selectedVendedor}
                onChange={(e) => setSelectedVendedor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {vendedores.map((vendedor) => (
                  <option key={vendedor} value={vendedor}>
                    {vendedor}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status do Lead
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusList.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-bold text-blue-600">{dadosFiltrados.length}</span> de{" "}
              <span className="font-bold">{crmData.length}</span> leads
            </p>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Temporal Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Evolução Temporal de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={dadosTemporais}
            xKey="mes"
            lines={[
              {
                key: "leads",
                color: "#0043A4",
                name: "Leads",
              },
            ]}
            height={350}
            formatYAxis={(value) => value.toLocaleString("pt-BR")}
            formatTooltip={(value) => `${value} leads`}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Total de Leads</p>
            <p className="text-3xl font-bold text-blue-600">
              {dadosFiltrados.length.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Convertidos</p>
            <p className="text-3xl font-bold text-green-600">
              {dadosFiltrados.filter((l) => l["STATUS DO LEAD"] === "Convertido").length.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Perdidos</p>
            <p className="text-3xl font-bold text-red-600">
              {dadosFiltrados.filter((l) => l["STATUS DO LEAD"] === "Perdido").length.toLocaleString("pt-BR")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-1">Receita Total</p>
            <p className="text-3xl font-bold text-gray-900">
              R${" "}
              {(
                dadosFiltrados.reduce((sum, l) => sum + Number(l["Receita Gerada"] || 0), 0) / 1000
              ).toFixed(0)}
              k
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Dados Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={dadosTabela}
            columns={[
              { key: "id", label: "ID", align: "left" },
              { key: "data", label: "Data", align: "left" },
              { key: "canal", label: "Canal", align: "left" },
              { key: "campanha", label: "Campanha", align: "left" },
              { key: "vendedor", label: "Vendedor", align: "left" },
              { key: "status", label: "Status", align: "left" },
              {
                key: "receita",
                label: "Receita",
                align: "right",
                format: (value) =>
                  `R$ ${Number(value).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
              {
                key: "tempoConversao",
                label: "Tempo (dias)",
                align: "right",
                format: (value) => (Number(value) >= 0 ? `${value} dias` : "-"),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center">
        Fonte: {crmData.length.toLocaleString("pt-BR")} leads reais do CRM (BR Bank)
      </p>
    </div>
  )
}
