"use client"

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  colors: string[]
  height?: number
  showLabel?: boolean
  formatTooltip?: (value: any) => string
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function PieChart({
  data,
  dataKey,
  nameKey,
  colors,
  height = 300,
  showLabel = true,
  formatTooltip,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabel ? renderCustomizedLabel : false}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
          }}
          formatter={formatTooltip}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
