"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Contrast, Palette, Type, Check } from "lucide-react"

export default function AccessibilityPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isColorblindMode, setIsColorblindMode] = useState(false)
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    const savedHighContrast = localStorage.getItem("highContrast") === "true"
    const savedColorblindMode = localStorage.getItem("colorblindMode") === "true"
    const savedFontSize = (localStorage.getItem("fontSize") || "medium") as "small" | "medium" | "large"

    setIsDarkMode(savedDarkMode)
    setIsHighContrast(savedHighContrast)
    setIsColorblindMode(savedColorblindMode)
    setFontSize(savedFontSize)

    applySettings(savedDarkMode, savedHighContrast, savedColorblindMode, savedFontSize)
  }, [])

  const applySettings = (
    dark: boolean,
    highContrast: boolean,
    colorblind: boolean,
    fontSizeValue: "small" | "medium" | "large"
  ) => {
    const root = document.documentElement

    // Dark mode
    if (dark) {
      root.classList.add("dark-mode")
    } else {
      root.classList.remove("dark-mode")
    }

    // High contrast
    if (highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Colorblind mode
    if (colorblind) {
      root.classList.add("colorblind-mode")
    } else {
      root.classList.remove("colorblind-mode")
    }

    // Font size
    root.classList.remove("font-small", "font-medium", "font-large")
    root.classList.add(`font-${fontSizeValue}`)
  }

  const toggleDarkMode = () => {
    const newValue = !isDarkMode
    setIsDarkMode(newValue)
    localStorage.setItem("darkMode", String(newValue))
    applySettings(newValue, isHighContrast, isColorblindMode, fontSize)
  }

  const toggleHighContrast = () => {
    const newValue = !isHighContrast
    setIsHighContrast(newValue)
    localStorage.setItem("highContrast", String(newValue))
    applySettings(isDarkMode, newValue, isColorblindMode, fontSize)
  }

  const toggleColorblindMode = () => {
    const newValue = !isColorblindMode
    setIsColorblindMode(newValue)
    localStorage.setItem("colorblindMode", String(newValue))
    applySettings(isDarkMode, isHighContrast, newValue, fontSize)
  }

  const changeFontSize = (newSize: "small" | "medium" | "large") => {
    setFontSize(newSize)
    localStorage.setItem("fontSize", newSize)
    applySettings(isDarkMode, isHighContrast, isColorblindMode, newSize)
  }

  const resetSettings = () => {
    setIsDarkMode(false)
    setIsHighContrast(false)
    setIsColorblindMode(false)
    setFontSize("medium")

    localStorage.removeItem("darkMode")
    localStorage.removeItem("highContrast")
    localStorage.removeItem("colorblindMode")
    localStorage.removeItem("fontSize")

    applySettings(false, false, false, "medium")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">♿ Acessibilidade</h1>
        <p className="text-lg text-gray-600 mt-2">
          Personalize a interface para melhorar a legibilidade e usabilidade
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dark Mode */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-6 w-6 text-yellow-400" />
                ) : (
                  <Sun className="h-6 w-6 text-yellow-600" />
                )}
                <CardTitle className={isDarkMode ? "text-white" : ""}>Modo Escuro</CardTitle>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Reduz o brilho da tela e inverte as cores para ambientes com pouca luz, diminuindo o
              cansaço visual.
            </p>
            <div className="mt-4 p-3 rounded-md" style={{ backgroundColor: isDarkMode ? "#1f2937" : "#f3f4f6" }}>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Estado: {isDarkMode ? "Ativado" : "Desativado"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* High Contrast */}
        <Card className={isHighContrast ? "border-4 border-black" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Contrast className="h-6 w-6" />
                <CardTitle>Alto Contraste</CardTitle>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isHighContrast ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isHighContrast ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Aumenta o contraste entre texto e fundo para facilitar a leitura, especialmente para
              pessoas com baixa visão.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-12 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Preto</span>
              </div>
              <div className="h-12 bg-white border-2 border-gray-900 rounded flex items-center justify-center">
                <span className="text-black text-xs font-bold">Branco</span>
              </div>
              <div className="h-12 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Azul</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colorblind Safe Mode */}
        <Card className={isColorblindMode ? "bg-blue-50 border-blue-300" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-purple-600" />
                <CardTitle>Modo Daltônico</CardTitle>
              </div>
              <button
                onClick={toggleColorblindMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isColorblindMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isColorblindMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Usa uma paleta de cores segura para pessoas com daltonismo (deuteranopia, protanopia).
              As cores são diferenciadas por tom e saturação.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <div className="h-12 bg-blue-700 rounded flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="h-12 bg-orange-600 rounded flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="h-12 bg-cyan-600 rounded flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="h-12 bg-purple-700 rounded flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Type className="h-6 w-6 text-green-600" />
              <CardTitle>Tamanho da Fonte</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ajuste o tamanho do texto em todo o dashboard para melhorar a legibilidade.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => changeFontSize("small")}
                className={`flex-1 px-4 py-3 rounded-md border-2 transition-all ${
                  fontSize === "small"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="text-sm">Pequeno</span>
              </button>
              <button
                onClick={() => changeFontSize("medium")}
                className={`flex-1 px-4 py-3 rounded-md border-2 transition-all ${
                  fontSize === "medium"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="text-base">Médio</span>
              </button>
              <button
                onClick={() => changeFontSize("large")}
                className={`flex-1 px-4 py-3 rounded-md border-2 transition-all ${
                  fontSize === "large"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="text-lg">Grande</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>👁️ Prévia das Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Exemplo de Título</h3>
              <p className="text-base text-gray-600">
                Este é um parágrafo de exemplo para você visualizar como as configurações de
                acessibilidade afetam a aparência do texto no dashboard.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-600 text-white rounded-lg">
                <p className="font-bold">Sucesso</p>
                <p className="text-sm">Operação concluída</p>
              </div>
              <div className="p-4 bg-green-600 text-white rounded-lg">
                <p className="font-bold">Positivo</p>
                <p className="text-sm">Resultado favorável</p>
              </div>
              <div className="p-4 bg-orange-600 text-white rounded-lg">
                <p className="font-bold">Alerta</p>
                <p className="text-sm">Atenção necessária</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Configurações Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Modo Escuro</span>
              <span className={`text-sm ${isDarkMode ? "text-green-600" : "text-gray-400"}`}>
                {isDarkMode ? "Ativado" : "Desativado"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Alto Contraste</span>
              <span className={`text-sm ${isHighContrast ? "text-green-600" : "text-gray-400"}`}>
                {isHighContrast ? "Ativado" : "Desativado"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium">Modo Daltônico</span>
              <span className={`text-sm ${isColorblindMode ? "text-green-600" : "text-gray-400"}`}>
                {isColorblindMode ? "Ativado" : "Desativado"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Tamanho da Fonte</span>
              <span className="text-sm text-blue-600 font-bold capitalize">{fontSize}</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={resetSettings}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Restaurar Configurações Padrão
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Sobre Acessibilidade</h4>
          <p className="text-sm text-blue-800">
            As configurações de acessibilidade são salvas automaticamente no seu navegador e serão
            aplicadas em todas as páginas do dashboard. Essas configurações ajudam a tornar o
            conteúdo mais legível e utilizável para todos os usuários, independentemente de suas
            necessidades visuais.
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-sm text-gray-500 text-center">
        Configurações persistidas localmente no navegador
      </p>
    </div>
  )
}
