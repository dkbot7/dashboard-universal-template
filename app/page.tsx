import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">🏦 Dashboard Tático • BR Bank</h1>
        <p className="text-lg text-gray-600 mt-2">
          Bem-vindo ao centro de inteligência de crescimento
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre este Dashboard</CardTitle>
          <CardDescription>
            Transformando dados em decisões estratégicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Este dashboard foi desenvolvido para transformar <strong>dados em decisões</strong>, com foco na jornada do lead:
            <strong> Aquisição → Retenção → Monetização</strong>.
          </p>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">🚀 O que você pode fazer aqui:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">📊</span>
                <span><strong>Visão Executiva:</strong> Acompanhar resumo dos principais KPIs de Aquisição, Retenção e Monetização</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📈</span>
                <span><strong>Aquisição:</strong> Analisar desempenho de campanhas, CPA, ROAS e taxas de conversão</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🤝</span>
                <span><strong>Retenção:</strong> Monitorar tempo médio de conversão e identificar gargalos no funil</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💰</span>
                <span><strong>Monetização:</strong> Avaliar receita por vendedor, ticket médio e LTV</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔮</span>
                <span><strong>Projeções:</strong> Simular impacto de cenários no faturamento e metas</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔍</span>
                <span><strong>Análise Detalhada:</strong> Explorar dados em profundidade com filtros personalizados</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">🎯 Metas Estratégicas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-900">
            <li>• Atingir <strong>R$ 30 milhões de faturamento</strong></li>
            <li>• Reduzir o <strong>CAC</strong> e aumentar o <strong>ROAS</strong></li>
            <li>• Aumentar a taxa de conversão geral e por vendedor</li>
            <li>• Rastrear e priorizar leads ativos para follow-up</li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          💡 <strong>Dica:</strong> Utilize o menu lateral para navegar pelas diferentes seções do dashboard
        </p>
      </div>
    </div>
  );
}
