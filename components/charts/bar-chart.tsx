"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface BarChartProps {
  data: any[]
  xKey: string
  bars: {
    key: string
    color: string
    name: string
  }[]
  height?: number
  xAxisLabel?: string
  yAxisLabel?: string
  formatYAxis?: (value: any) => string
  formatTooltip?: (value: any) => string
  layout?: "horizontal" | "vertical"
}

export function BarChart({
  data,
  xKey,
  bars,
  height = 300,
  xAxisLabel,
  yAxisLabel,
  formatYAxis,
  formatTooltip,
  layout = "horizontal",
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        {layout === "horizontal" ? (
          <>
            <XAxis
              dataKey={xKey}
              label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
              stroke="#666"
            />
            <YAxis
              tickFormatter={formatYAxis}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
              stroke="#666"
            />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tickFormatter={formatYAxis}
              label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
              stroke="#666"
            />
            <YAxis
              type="category"
              dataKey={xKey}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
              stroke="#666"
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
          formatter={formatTooltip}
        />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            fill={bar.color}
            name={bar.name}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
