# Dashboard Universal Template

Template universal para criacao de dashboards de metricas de negocio com Next.js 15, TypeScript e Tailwind CSS.

## Caracteristicas

- **Configuracao Centralizada**: Um unico arquivo para personalizar todo o dashboard
- **KPIs Dinamicos**: Adicione e configure KPIs sem alterar codigo
- **Multiplas Fontes de Dados**: Suporte a CSV, JSON e APIs REST
- **Insights Automaticos**: Geracao automatica de insights baseados em thresholds
- **Temas Customizaveis**: Cores, fontes e estilos configuraveis
- **Presets de Industria**: Templates prontos para E-commerce, SaaS, Healthcare, Marketing e Fintech
- **Componentes Reutilizaveis**: Cards de KPI, graficos, tabelas e mais
- **Acessibilidade**: Suporte a dark mode, alto contraste e daltonismo

## Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar o Dashboard

Edite o arquivo `config/dashboard.config.ts`:

```typescript
export const dashboardConfig: DashboardConfig = {
  // Informacoes basicas
  name: "Meu Dashboard",
  shortName: "Dashboard",
  description: "Descricao do seu dashboard",

  // Cores do tema
  theme: {
    primary: "#3B82F6",
    secondary: "#6366F1",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    // ...
  },

  // Navegacao
  navigation: [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Visao Geral", href: "/overview", icon: BarChart3 },
    // ...
  ],

  // KPIs
  kpis: [
    {
      id: "revenue",
      name: "Receita Total",
      format: "currency",
      goodDirection: "up",
      thresholds: { good: 1000000, warning: 500000, danger: 100000 },
    },
    // ...
  ],

  // Metas
  goals: [
    { id: "revenueGoal", name: "Meta de Receita", target: 30000000, format: "currency", period: "yearly" },
    // ...
  ],
};
```

### 3. Adicionar Seus Dados

Coloque seus arquivos CSV em `public/data/`:

```
public/
  data/
    data.csv        # Dados principais
    kpis.csv        # KPIs calculados (opcional)
    analytics.csv   # Dados de analytics (opcional)
```

Formato esperado do CSV:

```csv
Data,Receita,Custo,Leads,Conversoes,Canal
2024-01-01,50000,15000,100,25,Google
2024-01-02,45000,12000,90,22,Meta
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura do Projeto

```
br-bank-dashboard/
├── app/                    # Paginas (App Router)
│   ├── page.tsx           # Home
│   ├── overview/          # Visao Geral
│   ├── acquisition/       # Aquisicao
│   ├── retention/         # Retencao
│   ├── monetization/      # Monetizacao
│   ├── projections/       # Projecoes
│   ├── analytics/         # Analytics
│   └── accessibility/     # Configuracoes
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Card, etc)
│   ├── charts/           # Graficos (Bar, Line, Pie)
│   ├── sidebar.tsx       # Menu lateral
│   ├── kpi-card.tsx      # Cards de KPI
│   └── data-table.tsx    # Tabela de dados
├── config/               # Configuracoes
│   ├── dashboard.config.ts  # ARQUIVO PRINCIPAL DE CONFIG
│   └── settings.ts       # Exportacoes auxiliares
├── lib/                  # Utilitarios
│   ├── data-loader.ts    # Carregamento de dados
│   ├── kpi-calculator.ts # Calculos de KPIs
│   ├── insights-generator.ts # Geracao de insights
│   └── utils.ts          # Funcoes auxiliares
└── public/
    └── data/             # Seus arquivos CSV/JSON
```

## Usando Presets de Industria

O template inclui presets prontos para diferentes industrias:

```typescript
import { applyPreset } from "@/config/dashboard.config";

// E-commerce
export const dashboardConfig = applyPreset('ecommerce');

// SaaS
export const dashboardConfig = applyPreset('saas');

// Healthcare
export const dashboardConfig = applyPreset('healthcare');

// Marketing Agency
export const dashboardConfig = applyPreset('marketing');

// Fintech/Banking
export const dashboardConfig = applyPreset('fintech');
```

## Configurando KPIs

### Adicionar Novo KPI

```typescript
kpis: [
  {
    id: "meuKpi",
    name: "Meu KPI",
    description: "Descricao do KPI",
    format: "currency", // currency | percentage | number | decimal
    icon: "💰",
    category: "financial",
    goodDirection: "up", // up | down | neutral
    thresholds: {
      good: 1000,
      warning: 500,
      danger: 100,
    },
  },
]
```

### Formulas de Calculo Disponiveis

```typescript
import {
  calcularCAC,      // Custo de Aquisicao de Cliente
  calcularROAS,     // Return on Ad Spend
  calcularCPA,      // Custo por Lead
  calcularCPC,      // Custo por Clique
  calcularCTR,      // Click Through Rate
  calcularTaxaConversao,
  calcularTicketMedio,
  calcularLTV,      // Lifetime Value
  calcularMargemLucro,
  calcularROI,
  calcularChurnRate,
  calcularMRR,      // Monthly Recurring Revenue
  calcularARR,      // Annual Recurring Revenue
  calcularNPS,      // Net Promoter Score
  calcularAOV,      // Average Order Value
} from "@/lib/kpi-calculator";
```

### Registrar Formula Customizada

```typescript
import { registerCalculator } from "@/lib/kpi-calculator";

registerCalculator("meuCalculo", (a, b, c) => {
  return (a + b) / c;
});
```

## Configurando Insights

### Insights Automaticos

```typescript
insights: [
  {
    id: "roasInsight",
    kpiId: "roas",
    type: "threshold",
    conditions: [
      {
        operator: ">",
        value: 6,
        message: "ROAS excelente! Alto retorno sobre investimento.",
        severity: "success",
        icon: "🚀",
      },
      {
        operator: "<",
        value: 3,
        message: "ROAS baixo. Revise as campanhas.",
        severity: "warning",
        icon: "⚠️",
      },
    ],
  },
]
```

### Funcoes de Insight Disponiveis

```typescript
import {
  gerarInsightConversao,
  gerarInsightRoas,
  gerarInsightCAC,
  gerarInsightChurn,
  gerarInsightNPS,
  gerarInsightMeta,
  gerarInsightTempoConversao,
  gerarInsightVendedor,
  gerarInsightLeadsAtivos,
  gerarInsightTendencia,
  compararComBenchmark,
} from "@/lib/insights-generator";
```

## Carregamento de Dados

### Via Hook (Recomendado)

```typescript
import { useDataFromPath } from "@/lib/data-loader";

function MeuComponente() {
  const { data, loading, error, reload } = useDataFromPath(
    "/data/meus-dados.csv",
    "csv"
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return <Table data={data} />;
}
```

### Via Funcao Async

```typescript
import { loadFromPath, sumField, avgField, groupBy } from "@/lib/data-loader";

async function carregarDados() {
  const result = await loadFromPath("/data/dados.csv", "csv", {
    filters: { canal: "Google" },
    orderBy: "data",
    orderDirection: "desc",
    limit: 100,
  });

  const receita = sumField(result.data, "receita");
  const mediaTicket = avgField(result.data, "valor");
  const porCanal = groupBy(result.data, "canal");
}
```

## Componentes Disponiveis

### KPI Card

```tsx
import { KPICard, KPICardCompact, KPICardWithSparkline, KPIGrid } from "@/components/kpi-card";

// Card padrao
<KPICard
  title="Receita"
  value={150000}
  format="currency"
  icon={<DollarSign />}
  trend={{ value: 12.5, isPositive: true }}
  status="success"
/>

// Card compacto
<KPICardCompact title="Leads" value={350} format="number" />

// Card com sparkline
<KPICardWithSparkline
  title="Vendas"
  value={1250}
  sparklineData={[100, 120, 115, 140, 135, 160]}
/>

// Grid de KPIs
<KPIGrid kpis={[...]} columns={4} />
```

### Graficos

```tsx
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";

<BarChart
  data={dados}
  xKey="mes"
  bars={[{ key: "vendas", color: "#3B82F6", name: "Vendas" }]}
/>

<LineChart
  data={dados}
  xKey="data"
  lines={[{ key: "receita", color: "#10B981", name: "Receita" }]}
/>

<PieChart
  data={dados}
  dataKey="valor"
  nameKey="categoria"
  colors={["#3B82F6", "#10B981", "#F59E0B"]}
/>
```

### Tabela de Dados

```tsx
import { DataTable } from "@/components/data-table";

<DataTable
  data={dados}
  columns={[
    { key: "nome", label: "Nome", align: "left" },
    { key: "valor", label: "Valor", align: "right", format: (v) => `R$ ${v}` },
    { key: "taxa", label: "Taxa", align: "right", format: (v) => `${v}%` },
  ]}
/>
```

## Personalizacao

### Alterar Cores do Tema

```typescript
theme: {
  primary: "#0066CC",      // Cor principal
  secondary: "#6366F1",    // Cor secundaria
  success: "#00B050",      // Sucesso/positivo
  danger: "#D80027",       // Erro/negativo
  warning: "#FFA800",      // Alerta
  info: "#06B6D4",         // Informacao
  background: "#F9FAFB",   // Fundo
  foreground: "#111827",   // Texto
  sidebar: {
    background: "#1F2937",
    text: "#9CA3AF",
    activeBackground: "#374151",
    activeText: "#FFFFFF",
  },
}
```

### Alterar Navegacao

```typescript
navigation: [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Vendas", href: "/sales", icon: ShoppingCart, badge: "Novo" },
  { name: "Clientes", href: "/customers", icon: Users },
]
```

### Alterar Metas

```typescript
goals: [
  { id: "revenue", name: "Receita Anual", target: 50000000, format: "currency", period: "yearly" },
  { id: "customers", name: "Clientes Novos", target: 5000, format: "number", period: "monthly" },
]
```

## Scripts Disponiveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de producao
npm run start    # Iniciar producao
npm run lint     # Verificar codigo
```

## Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estatica
- **Tailwind CSS 4** - Estilos utilitarios
- **Recharts** - Graficos
- **PapaParse** - Parser CSV
- **Lucide React** - Icones

## Licenca

MIT License - Livre para uso comercial e pessoal.

---

Desenvolvido com base no projeto BR Bank Dashboard.
