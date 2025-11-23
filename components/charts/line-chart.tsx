"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface LineChartProps {
  data: any[]
  xKey: string
  lines: {
    key: string
    color: string
    name: string
  }[]
  height?: number
  xAxisLabel?: string
  yAxisLabel?: string
  formatYAxis?: (value: any) => string
  formatTooltip?: (value: any) => string
}

export function LineChart({
  data,
  xKey,
  lines,
  height = 300,
  xAxisLabel,
  yAxisLabel,
  formatYAxis,
  formatTooltip,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
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
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
          formatter={formatTooltip}
        />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            name={line.name}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
