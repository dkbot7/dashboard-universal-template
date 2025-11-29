"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/kpi-card";
import { useDataFromPath, sumField, avgField, countField } from "@/lib/data-loader";
import { calcularROAS, calcularCAC, calcularTaxaConversao, calcularKPICompleto } from "@/lib/kpi-calculator";
import { generateInsight, gerarInsightMeta } from "@/lib/insights-generator";
import { dashboardConfig } from "@/config/dashboard.config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Percent,
} from "lucide-react";

// Mapa de icones para KPIs
const iconMap: Record<string, React.ReactNode> = {
  revenue: <DollarSign className="h-4 w-4" />,
  profit: <TrendingUp className="h-4 w-4" />,
  roas: <Target className="h-4 w-4" />,
  cac: <Users className="h-4 w-4" />,
  conversionRate: <Percent className="h-4 w-4" />,
  default: <BarChart3 className="h-4 w-4" />,
};

export default function OverviewPage() {
  const { data, loading, error } = useDataFromPath("/data/data.csv", "csv");
  const [kpiValues, setKpiValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data.length > 0) {
      // Calcular valores dos KPIs a partir dos dados
      // Estes campos devem corresponder aos seus dados CSV
      const revenue = sumField(data, "Receita") || sumField(data, "revenue") || sumField(data, "valor");
      const cost = sumField(data, "Custo") || sumField(data, "cost") || sumField(data, "custo");
      const adsCost = sumField(data, "Custo Ads") || sumField(data, "ads_cost") || cost * 0.3;
      const salesCost = sumField(data, "Custo Vendas") || sumField(data, "sales_cost") || cost * 0.2;
      const customers = countField(data) || 100;
      const conversions = sumField(data, "Conversoes") || sumField(data, "conversions") || customers;
      const leads = sumField(data, "Leads") || sumField(data, "leads") || customers * 5;

      setKpiValues({
        revenue,
        profit: revenue - cost,
        roas: calcularROAS(revenue, adsCost),
        cac: calcularCAC(adsCost, salesCost, customers),
        conversionRate: calcularTaxaConversao(conversions, leads),
        customers,
        leads,
        adsCost,
      });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: dashboardConfig.theme.primary }}
          />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              Coloque seus dados em <code>/public/data/data.csv</code> para
              visualizar os KPIs.
            </p>
            <p className="text-center text-sm text-gray-400 mt-2">
              Erro: {error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Buscar meta de receita
  const revenueGoal = dashboardConfig.goals.find(
    (g) => g.id === "revenueGoal"
  );
  const progressoMeta = revenueGoal
    ? (kpiValues.revenue / revenueGoal.target) * 100
    : 0;

  // Gerar insights
  const roasInsight = generateInsight("roas", kpiValues.roas);
  const conversionInsight = generateInsight(
    "conversionRate",
    kpiValues.conversionRate
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Visao Geral</h1>
        <p className="text-lg text-gray-600 mt-2">
          Desempenho consolidado e principais indicadores
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Receita Total"
          value={kpiValues.revenue || 0}
          format="currency"
          icon={iconMap.revenue}
        />
        <KPICard
          title="Lucro Liquido"
          value={kpiValues.profit || 0}
          format="currency"
          icon={iconMap.profit}
        />
        <KPICard
          title="ROAS"
          value={(kpiValues.roas || 0) * 100}
          format="percentage"
          icon={iconMap.roas}
        />
        <KPICard
          title="CAC"
          value={kpiValues.cac || 0}
          format="currency"
          icon={iconMap.cac}
        />
      </div>

      {/* KPIs Secundarios */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Taxa de Conversao"
          value={kpiValues.conversionRate || 0}
          format="percentage"
          icon={iconMap.conversionRate}
        />
        <KPICard
          title="Clientes"
          value={kpiValues.customers || 0}
          format="number"
          icon={iconMap.cac}
        />
        <KPICard
          title="Leads"
          value={kpiValues.leads || 0}
          format="number"
          icon={iconMap.default}
        />
      </div>

      {/* Progresso da Meta */}
      {revenueGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Meta:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(revenueGoal.target)}
                </span>
                <span
                  className="font-bold"
                  style={{ color: dashboardConfig.theme.primary }}
                >
                  {progressoMeta.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full transition-all"
                  style={{
                    width: `${Math.min(progressoMeta, 100)}%`,
                    backgroundColor: dashboardConfig.theme.primary,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {gerarInsightMeta(kpiValues.revenue || 0, revenueGoal.target)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {roasInsight && (
        <Card
          className="border-l-4"
          style={{
            borderLeftColor:
              roasInsight.severity === "success"
                ? dashboardConfig.theme.success
                : roasInsight.severity === "warning"
                  ? dashboardConfig.theme.warning
                  : dashboardConfig.theme.danger,
          }}
        >
          <CardHeader>
            <CardTitle className="text-lg">
              {roasInsight.icon} Insight de ROAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{roasInsight.message}</p>
          </CardContent>
        </Card>
      )}

      {conversionInsight && (
        <Card
          className="border-l-4"
          style={{
            borderLeftColor:
              conversionInsight.severity === "success"
                ? dashboardConfig.theme.success
                : conversionInsight.severity === "warning"
                  ? dashboardConfig.theme.warning
                  : dashboardConfig.theme.danger,
          }}
        >
          <CardHeader>
            <CardTitle className="text-lg">
              {conversionInsight.icon} Insight de Conversao
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{conversionInsight.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 text-center">
            Dados carregados: {data.length} registros | Ultima atualizacao:{" "}
            {new Date().toLocaleString("pt-BR")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
