import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatarMoeda, formatarPorcentagem, formatarNumero } from "@/lib/kpi-calculator";

interface KPICardProps {
  title: string;
  value: number;
  format?: "currency" | "percentage" | "number";
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KPICard({
  title,
  value,
  format = "number",
  icon,
  trend
}: KPICardProps) {
  const formatValue = () => {
    switch (format) {
      case "currency":
        return formatarMoeda(value);
      case "percentage":
        return formatarPorcentagem(value);
      case "number":
        return formatarNumero(value);
      default:
        return value.toString();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue()}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}% vs mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}
