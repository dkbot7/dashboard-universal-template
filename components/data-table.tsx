import { Card, CardContent } from "./ui/card"

interface Column {
  key: string
  label: string
  format?: (value: any) => string
  align?: "left" | "center" | "right"
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  className?: string
}

export function DataTable({ data, columns, className }: DataTableProps) {
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-${column.align || "left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${column.align || "left"}`}
                    >
                      {column.format
                        ? column.format(row[column.key])
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
