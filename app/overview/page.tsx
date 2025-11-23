"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { KPICard } from "@/components/kpi-card"
import { loadCalculos, Calculos } from "@/lib/data-loader"
import { calcularROAS, calcularCAC } from "@/lib/kpi-calculator"
import { METAS } from "@/config/settings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, Target } from "lucide-react"

export default function OverviewPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [calculos, setCalculos] = useState<Calculos[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const data = await loadCalculos()
      setCalculos(data)
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

  // Calcular KPIs
  const receitaTotal = calculos.reduce((sum, row) => sum + Number(row.Receita || 0), 0)
  const custoTotalVendas = calculos.reduce((sum, row) => sum + Number(row["Custo Total Vendas"] || 0), 0)
  const clientesAdquiridos = calculos.reduce((sum, row) => sum + Number(row["Clientes Adquiridos"] || 0), 0)
  const custoTotalAds = calculos.reduce((sum, row) => sum + Number(row["Custo Ads"] || 0), 0)

  const lucroLiquido = calculos.reduce((sum, row) => sum + Number(row["Lucro Líquido"] || 0), 0)
  const roas = calcularROAS(receitaTotal, custoTotalAds) * 100
  const cac = calcularCAC(custoTotalAds, custoTotalVendas, clientesAdquiridos)

  // Calcular progresso da meta
  const progressoMeta = (receitaTotal / METAS.receitaAnual) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">📊 Visão Executiva</h1>
        <p className="text-lg text-gray-600 mt-2">
          Desempenho financeiro e de aquisição consolidado
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita Total"
          value={receitaTotal}
          format="currency"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Lucro Líquido"
          value={lucroLiquido}
          format="currency"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KPICard
          title="ROAS"
          value={roas}
          format="percentage"
          icon={<Target className="h-4 w-4" />}
        />
        <KPICard
          title="CAC"
          value={cac}
          format="currency"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Meta de Receita */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Progresso da Meta Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Meta: R$ 30 milhões</span>
              <span className="font-bold text-blue-600">{progressoMeta.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressoMeta, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {progressoMeta >= 100
                ? "🎉 Meta atingida! Parabéns!"
                : `Faltam R$ ${((METAS.receitaAnual - receitaTotal) / 1000000).toFixed(2)} milhões para atingir a meta`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className={roas >= METAS.roasMinimo ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
        <CardHeader>
          <CardTitle className={roas >= METAS.roasMinimo ? "text-green-900" : "text-yellow-900"}>
            💡 Insight de ROAS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={roas >= METAS.roasMinimo ? "text-green-800" : "text-yellow-800"}>
            {roas >= METAS.roasMinimo
              ? `✅ Excelente! O ROAS de ${roas.toFixed(0)}% está acima da meta de ${METAS.roasMinimo}%. Continue investindo nos canais mais rentáveis.`
              : `⚠️ Atenção: O ROAS de ${roas.toFixed(0)}% está abaixo da meta de ${METAS.roasMinimo}%. Revise as campanhas de menor performance.`
            }
          </p>
        </CardContent>
      </Card>

      <Card className={cac <= METAS.cacMaximo ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
        <CardHeader>
          <CardTitle className={cac <= METAS.cacMaximo ? "text-green-900" : "text-yellow-900"}>
            💡 Insight de CAC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cac <= METAS.cacMaximo ? "text-green-800" : "text-yellow-800"}>
            {cac <= METAS.cacMaximo
              ? `✅ Ótimo! O CAC de R$ ${cac.toFixed(2)} está dentro da meta (≤ R$ ${METAS.cacMaximo}). A aquisição está eficiente.`
              : `⚠️ Atenção: O CAC de R$ ${cac.toFixed(2)} está acima da meta (R$ ${METAS.cacMaximo}). Otimize as campanhas para reduzir custos.`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
