"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { loadCRM, loadCalculos, CRMLead, Calculos } from "@/lib/data-loader"
import { calcularTicketMedio } from "@/lib/kpi-calculator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/charts/line-chart"
import { META_RECEITA } from "@/config/settings"

export default function ProjectionsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [crmData, setCrmData] = useState<CRMLead[]>([])
  const [calculos, setCalculos] = useState<Calculos[]>([])

  // Estados para simuladores
  const [novosVendedores, setNovosVendedores] = useState(5)
  const [aumentoConversao, setAumentoConversao] = useState(5)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [crm, calc] = await Promise.all([
        loadCRM(),
        loadCalculos()
      ])
      setCrmData(crm)
      setCalculos(calc)
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

  // Calcular receita total atual
  const leadsConvertidos = crmData.filter(
    (lead) => lead["STATUS DO LEAD"] === "Convertido" && Number(lead["Receita Gerada"]) > 0
  )
  const receitaAtual = leadsConvertidos.reduce(
    (sum, lead) => sum + Number(lead["Receita Gerada"] || 0),
    0
  )

  // Calcular métricas para projeção
  const totalLeads = crmData.length
  const taxaConversaoAtual = leadsConvertidos.length / totalLeads
  const ticketMedio = calcularTicketMedio(receitaAtual, leadsConvertidos.length)

  // Calcular leads por vendedor (média)
  const vendedoresUnicos = new Set(
    crmData.map(lead => String(lead["Vendedor que atendeu"]))
  ).size
  const leadsMediaPorVendedor = totalLeads / vendedoresUnicos

  // Receita faltante
  const receitaFaltante = META_RECEITA - receitaAtual
  const percentualAtingido = (receitaAtual / META_RECEITA) * 100

  // Projeção mensal simplificada (distribuir receita atual por meses)
  const mesesPassados = 12 // Assumindo período de 12 meses
  const receitaMediaMensal = receitaAtual / mesesPassados

  const dadosProjecao = Array.from({ length: 18 }, (_, i) => {
    const mes = i + 1
    if (i < mesesPassados) {
      // Receita real (com variação simulada para visualização)
      return {
        mes: `Mês ${mes}`,
        receitaReal: (receitaAtual / mesesPassados) * mes,
        meta: (META_RECEITA / 12) * mes,
      }
    } else {
      // Projeção futura
      const mesesFuturos = i - mesesPassados + 1
      return {
        mes: `Mês ${mes}`,
        receitaProjetada: receitaAtual + (receitaMediaMensal * mesesFuturos),
        meta: (META_RECEITA / 12) * mes,
      }
    }
  })

  // SIMULADOR 1: Impacto de novos vendedores
  const novosLeads = leadsMediaPorVendedor * novosVendedores
  const novosClientesEstimados = novosLeads * taxaConversaoAtual
  const receitaAdicionalVendedores = novosClientesEstimados * ticketMedio

  // SIMULADOR 2: Impacto de melhoria na conversão
  const novaConversao = taxaConversaoAtual * (1 + aumentoConversao / 100)
  const clientesAtuais = totalLeads * taxaConversaoAtual
  const clientesNovos = totalLeads * novaConversao
  const deltaClientes = clientesNovos - clientesAtuais
  const receitaAdicionalConversao = deltaClientes * ticketMedio

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">🚀 Projeções e Potencial de Receita</h1>
        <p className="text-lg text-gray-600 mt-2">
          Visualize o caminho até a meta de R$ 30 milhões e simule diferentes cenários de crescimento
        </p>
      </div>

      {/* Status da Meta */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Status Atual vs Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Receita Atual</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {(receitaAtual / 1000000).toFixed(2)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Meta</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {(META_RECEITA / 1000000).toFixed(2)}M
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Faltam</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {(receitaFaltante / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-700 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(percentualAtingido, 100)}%` }}
              />
            </div>
            <p className="text-sm text-center text-gray-600">
              {percentualAtingido.toFixed(1)}% da meta atingida
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Projeção */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Receita Acumulada vs Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={dadosProjecao}
            xKey="mes"
            lines={[
              {
                key: "receitaReal",
                color: "#0043A4",
                name: "Receita Real",
              },
              {
                key: "receitaProjetada",
                color: "#00B050",
                name: "Projeção",
              },
              {
                key: "meta",
                color: "#D80027",
                name: "Meta",
              },
            ]}
            height={400}
            formatYAxis={(value) => `R$ ${(Number(value) / 1000000).toFixed(1)}M`}
            formatTooltip={(value) =>
              `R$ ${Number(value).toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}`
            }
          />
        </CardContent>
      </Card>

      {/* Simuladores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulador 1: Novos Vendedores */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">➕ Simulador: Novos Vendedores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantos vendedores adicionar?
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={novosVendedores}
                onChange={(e) => setNovosVendedores(Number(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0</span>
                <span className="font-bold text-blue-700">{novosVendedores} vendedores</span>
                <span>20</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Impacto Estimado:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Novos leads estimados:</span>
                  <span className="font-bold">{Math.round(novosLeads)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Novos clientes:</span>
                  <span className="font-bold">{Math.round(novosClientesEstimados)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-semibold">Receita adicional:</span>
                  <span className="font-bold text-green-600">
                    R$ {(receitaAdicionalVendedores / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              * Baseado na média de {Math.round(leadsMediaPorVendedor)} leads por vendedor e taxa de conversão de {(taxaConversaoAtual * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        {/* Simulador 2: Melhoria na Conversão */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">📈 Simulador: Melhoria na Conversão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aumentar taxa de conversão em:
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={aumentoConversao}
                onChange={(e) => setAumentoConversao(Number(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0%</span>
                <span className="font-bold text-green-700">+{aumentoConversao}%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">Impacto Estimado:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversão atual:</span>
                  <span className="font-bold">{(taxaConversaoAtual * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nova conversão:</span>
                  <span className="font-bold text-green-700">{(novaConversao * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clientes adicionais:</span>
                  <span className="font-bold">{Math.round(deltaClientes)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-semibold">Receita adicional:</span>
                  <span className="font-bold text-green-600">
                    R$ {(receitaAdicionalConversao / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              * Baseado em {totalLeads} leads totais e ticket médio de R$ {ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Impacto Combinado */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">🎯 Impacto Combinado dos Simuladores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Receita Atual</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {(receitaAtual / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Receita Projetada</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {((receitaAtual + receitaAdicionalVendedores + receitaAdicionalConversao) / 1000000).toFixed(2)}M
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Ganho Total</p>
              <p className="text-2xl font-bold text-green-600">
                +R$ {((receitaAdicionalVendedores + receitaAdicionalConversao) / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
          <div className="mt-4 text-center">
            {(receitaAtual + receitaAdicionalVendedores + receitaAdicionalConversao) >= META_RECEITA ? (
              <p className="text-green-700 font-semibold">
                🎉 Com essas melhorias, a meta de R$ 30M seria atingida!
              </p>
            ) : (
              <p className="text-orange-700 font-semibold">
                ⚠️ Ainda faltariam R$ {((META_RECEITA - receitaAtual - receitaAdicionalVendedores - receitaAdicionalConversao) / 1000000).toFixed(2)}M para atingir a meta
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center">
        Fonte: dados históricos e projeções baseadas em {crmData.length} leads reais (BR Bank)
      </p>
    </div>
  )
}
