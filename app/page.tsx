import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { dashboardConfig } from "@/config/dashboard.config";
import { COMPANY, NAVIGATION, KPIS } from "@/config/settings";

export default function HomePage() {
  // Agrupar KPIs por categoria
  const kpisByCategory = KPIS.reduce(
    (acc, kpi) => {
      if (!acc[kpi.category]) acc[kpi.category] = [];
      acc[kpi.category].push(kpi);
      return acc;
    },
    {} as Record<string, typeof KPIS>
  );

  // Paginas principais (excluindo Home e Config)
  const mainPages = NAVIGATION.filter(
    (nav) => nav.href !== "/" && nav.href !== "/accessibility"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{COMPANY.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{COMPANY.description}</p>
      </div>

      {/* Card de Boas Vindas */}
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Dashboard</CardTitle>
          <CardDescription>
            Transformando dados em decisoes estrategicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Este dashboard foi desenvolvido para centralizar e visualizar suas
            metricas de negocio de forma clara e acionavel.
          </p>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">
              O que voce pode fazer aqui:
            </h3>
            <ul className="space-y-2 text-gray-700">
              {mainPages.map((page) => {
                const Icon = page.icon;
                return (
                  <li key={page.href} className="flex items-start">
                    <Icon className="mr-3 h-5 w-5 mt-0.5 text-gray-500" />
                    <span>
                      <strong>{page.name}:</strong>{" "}
                      {page.description || "Visualizar metricas"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Disponiveis */}
      <Card>
        <CardHeader>
          <CardTitle>KPIs Monitorados</CardTitle>
          <CardDescription>
            Indicadores configurados para acompanhamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(kpisByCategory).map(([category, kpis]) => (
              <div
                key={category}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <h4 className="font-semibold text-sm uppercase text-gray-500 mb-2">
                  {category}
                </h4>
                <ul className="space-y-1">
                  {kpis.map((kpi) => (
                    <li
                      key={kpi.id}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <span className="mr-2">{kpi.icon || "📊"}</span>
                      <span>{kpi.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metas */}
      {dashboardConfig.goals.length > 0 && (
        <Card
          className="border-2"
          style={{ borderColor: dashboardConfig.theme.primary }}
        >
          <CardHeader>
            <CardTitle style={{ color: dashboardConfig.theme.primary }}>
              Metas Estrategicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboardConfig.goals.map((goal) => (
                <li key={goal.id} className="flex items-center text-gray-700">
                  <span className="mr-2">{goal.icon || "🎯"}</span>
                  <span>
                    <strong>{goal.name}:</strong>{" "}
                    {goal.format === "currency"
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(goal.target)
                      : goal.format === "percentage"
                        ? `${goal.target}%`
                        : goal.target.toLocaleString("pt-BR")}
                    <span className="text-gray-500 text-sm ml-2">
                      ({goal.period})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Dica */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          <strong>Dica:</strong> Utilize o menu lateral para navegar pelas
          diferentes secoes do dashboard
        </p>
      </div>
    </div>
  );
}
