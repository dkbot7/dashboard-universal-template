// 📁 lib/data-loader.ts
// Funções para carregar dados CSV

import Papa from 'papaparse';

// Tipo genérico para dados CSV
export interface CSVRow {
  [key: string]: string | number | null;
}

// Interface para dados do CRM
export interface CRMLead {
  [key: string]: string | number | null;
  ID_Lead: number;
  "STATUS DO LEAD": string;
  "Vendedor que atendeu": string;
  "Receita Gerada": number;
  "Tempo até Conversão (Dias)": number;
}

// Interface para dados consolidados
export interface DadosConsolidados {
  [key: string]: string | number | null;
  Data: string;
  Campanha: string;
  Custo: number;
  Cliques: number;
  Impressões: number;
  Conversões: number;
}

// Interface para cálculos
export interface Calculos {
  [key: string]: string | number | null;
}

// Função para carregar CSV genérico
export async function loadCSV<T extends CSVRow>(
  filename: string
): Promise<T[]> {
  try {
    // Carregar do servidor via fetch
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn(`Warnings parsing ${filename}:`, results.errors);
          }
          resolve(results.data);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
}

// Funções específicas para cada arquivo
export const loadCRM = () => loadCSV<CRMLead>('crm.csv');
export const loadDadosConsolidados = () => loadCSV<DadosConsolidados>('dados_consolidados.csv');
export const loadCalculos = () => loadCSV<Calculos>('calculos.csv');
export const loadGoogleAnalytics = () => loadCSV('google_analytics.csv');
export const loadKPIs = () => loadCSV('kpis_e_metricas_.csv');
export const loadLeadsConvertidos = () => loadCSV('leads_convertidos_trafego_pago_.csv');
