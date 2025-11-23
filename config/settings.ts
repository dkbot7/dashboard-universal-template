// ⚙️ settings.ts
// Configurações globais do Dashboard BR Bank

// 👤 Perfis de usuário disponíveis
export const USER_PROFILES = [
  "Executivo",
  "Marketing & Growth",
  "Vendas",
  "Produto"
] as const;

export type UserProfile = typeof USER_PROFILES[number];

// 🎨 Paleta de Cores Oficial
export const COLOR_PALETTE = {
  primary: "#0043A4",        // Azul BR Bank
  secondary: "#0061F2",
  success: "#00B050",        // Verde de performance positiva
  danger: "#D80027",         // Vermelho de alerta/erro
  warning: "#FFA800",        // Amarelo de atenção
  neutral: "#F9F9F9",        // Fundo neutro
  font: "#333333",           // Cor base para textos
  light_gray: "#E0E0E0",
  dark_gray: "#444444",
  background_dark: "#121212",
  background_light: "#FFFFFF"
} as const;

// 📊 Metas do BR Bank
export const METAS = {
  receitaAnual: 30000000, // R$ 30 milhões
  cacMaximo: 5000,
  roasMinimo: 300
} as const;

// Meta de receita (para compatibilidade)
export const META_RECEITA = METAS.receitaAnual;
