// =============================================================================
// DATA-LOADER.TS - CARREGADOR UNIVERSAL DE DADOS
// =============================================================================
// Suporta CSV, JSON e APIs REST
// =============================================================================

import Papa from "papaparse";
import { DATA_SOURCES } from "@/config/settings";

// =============================================================================
// TIPOS
// =============================================================================

export interface DataRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface LoadOptions {
  /** Filtros a aplicar nos dados */
  filters?: Record<string, unknown>;
  /** Campos a selecionar */
  select?: string[];
  /** Campo para ordenacao */
  orderBy?: string;
  /** Direcao da ordenacao */
  orderDirection?: "asc" | "desc";
  /** Limite de registros */
  limit?: number;
  /** Offset para paginacao */
  offset?: number;
}

export interface DataSourceResult<T = DataRow> {
  data: T[];
  total: number;
  error?: string;
}

// =============================================================================
// FUNCOES DE CARREGAMENTO
// =============================================================================

/**
 * Carrega dados de um arquivo CSV
 */
export async function loadCSV<T extends DataRow>(
  path: string,
  options?: LoadOptions
): Promise<DataSourceResult<T>> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse<T>(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          let data = results.data as T[];

          // Aplicar filtros
          if (options?.filters) {
            data = applyFilters(data, options.filters);
          }

          // Selecionar campos
          if (options?.select) {
            data = selectFields(data, options.select);
          }

          // Ordenar
          if (options?.orderBy) {
            data = sortData(data, options.orderBy, options.orderDirection);
          }

          const total = data.length;

          // Paginacao
          if (options?.offset !== undefined || options?.limit !== undefined) {
            const offset = options.offset || 0;
            const limit = options.limit || data.length;
            data = data.slice(offset, offset + limit);
          }

          resolve({ data, total });
        },
        error: (error: Error) => {
          resolve({ data: [], total: 0, error: error.message });
        },
      });
    });
  } catch (error) {
    console.error(`Error loading CSV ${path}:`, error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Carrega dados de um arquivo JSON
 */
export async function loadJSON<T extends DataRow>(
  path: string,
  options?: LoadOptions
): Promise<DataSourceResult<T>> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }

    const json = await response.json();
    let data: T[] = Array.isArray(json) ? json : json.data || [];

    // Aplicar filtros
    if (options?.filters) {
      data = applyFilters(data, options.filters);
    }

    // Selecionar campos
    if (options?.select) {
      data = selectFields(data, options.select);
    }

    // Ordenar
    if (options?.orderBy) {
      data = sortData(data, options.orderBy, options.orderDirection);
    }

    const total = data.length;

    // Paginacao
    if (options?.offset !== undefined || options?.limit !== undefined) {
      const offset = options.offset || 0;
      const limit = options.limit || data.length;
      data = data.slice(offset, offset + limit);
    }

    return { data, total };
  } catch (error) {
    console.error(`Error loading JSON ${path}:`, error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Carrega dados de uma API REST
 */
export async function loadAPI<T extends DataRow>(
  url: string,
  options?: LoadOptions & {
    method?: "GET" | "POST";
    headers?: Record<string, string>;
    body?: unknown;
  }
): Promise<DataSourceResult<T>> {
  try {
    const fetchOptions: RequestInit = {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    };

    if (options?.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const json = await response.json();
    let data: T[] = Array.isArray(json) ? json : json.data || [];
    const total = json.total || data.length;

    // Aplicar filtros locais (se a API nao suportar)
    if (options?.filters) {
      data = applyFilters(data, options.filters);
    }

    return { data, total };
  } catch (error) {
    console.error(`Error loading API ${url}:`, error);
    return {
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =============================================================================
// FUNCAO PRINCIPAL - LOAD DATA
// =============================================================================

/**
 * Carrega dados de uma fonte configurada pelo ID
 */
export async function loadData<T extends DataRow>(
  sourceId: string,
  options?: LoadOptions
): Promise<DataSourceResult<T>> {
  const source = DATA_SOURCES.find((s) => s.id === sourceId);

  if (!source) {
    console.error(`Data source "${sourceId}" not found`);
    return { data: [], total: 0, error: `Source "${sourceId}" not found` };
  }

  switch (source.type) {
    case "csv":
      return loadCSV<T>(source.path, options);
    case "json":
      return loadJSON<T>(source.path, options);
    case "api":
      return loadAPI<T>(source.path, options);
    default:
      return { data: [], total: 0, error: `Unknown source type` };
  }
}

/**
 * Carrega dados diretamente de um caminho (para uso flexivel)
 */
export async function loadFromPath<T extends DataRow>(
  path: string,
  type: "csv" | "json" | "api" = "csv",
  options?: LoadOptions
): Promise<DataSourceResult<T>> {
  switch (type) {
    case "csv":
      return loadCSV<T>(path, options);
    case "json":
      return loadJSON<T>(path, options);
    case "api":
      return loadAPI<T>(path, options);
    default:
      return { data: [], total: 0, error: `Unknown type: ${type}` };
  }
}

// =============================================================================
// FUNCOES AUXILIARES
// =============================================================================

/**
 * Aplica filtros aos dados
 */
function applyFilters<T extends DataRow>(
  data: T[],
  filters: Record<string, unknown>
): T[] {
  return data.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === "") return true;

      const rowValue = row[key];

      // Array de valores (OR)
      if (Array.isArray(value)) {
        return value.includes(rowValue);
      }

      // Objeto com operadores
      if (typeof value === "object" && value !== null) {
        const ops = value as Record<string, unknown>;
        if ("gt" in ops && typeof ops.gt === "number")
          return Number(rowValue) > ops.gt;
        if ("gte" in ops && typeof ops.gte === "number")
          return Number(rowValue) >= ops.gte;
        if ("lt" in ops && typeof ops.lt === "number")
          return Number(rowValue) < ops.lt;
        if ("lte" in ops && typeof ops.lte === "number")
          return Number(rowValue) <= ops.lte;
        if ("contains" in ops && typeof ops.contains === "string")
          return String(rowValue)
            .toLowerCase()
            .includes(String(ops.contains).toLowerCase());
        if ("startsWith" in ops && typeof ops.startsWith === "string")
          return String(rowValue)
            .toLowerCase()
            .startsWith(String(ops.startsWith).toLowerCase());
      }

      // Comparacao direta
      return rowValue === value;
    });
  });
}

/**
 * Seleciona campos especificos
 */
function selectFields<T extends DataRow>(data: T[], fields: string[]): T[] {
  return data.map((row) => {
    const selected = {} as T;
    fields.forEach((field) => {
      if (field in row) {
        selected[field as keyof T] = row[field as keyof T];
      }
    });
    return selected;
  });
}

/**
 * Ordena os dados
 */
function sortData<T extends DataRow>(
  data: T[],
  field: string,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return direction === "desc" ? -comparison : comparison;
  });
}

// =============================================================================
// FUNCOES DE AGREGACAO
// =============================================================================

/**
 * Soma valores de um campo
 */
export function sumField<T extends DataRow>(data: T[], field: string): number {
  return data.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
}

/**
 * Calcula media de um campo
 */
export function avgField<T extends DataRow>(data: T[], field: string): number {
  if (data.length === 0) return 0;
  return sumField(data, field) / data.length;
}

/**
 * Encontra valor maximo de um campo
 */
export function maxField<T extends DataRow>(data: T[], field: string): number {
  if (data.length === 0) return 0;
  return Math.max(...data.map((row) => Number(row[field]) || 0));
}

/**
 * Encontra valor minimo de um campo
 */
export function minField<T extends DataRow>(data: T[], field: string): number {
  if (data.length === 0) return 0;
  return Math.min(...data.map((row) => Number(row[field]) || 0));
}

/**
 * Conta registros
 */
export function countField<T extends DataRow>(
  data: T[],
  field?: string,
  value?: unknown
): number {
  if (!field) return data.length;
  return data.filter((row) => row[field] === value).length;
}

/**
 * Agrupa dados por um campo
 */
export function groupBy<T extends DataRow>(
  data: T[],
  field: string
): Record<string, T[]> {
  return data.reduce(
    (groups, row) => {
      const key = String(row[field] || "undefined");
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
      return groups;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Agrupa e agrega dados
 */
export function groupAndAggregate<T extends DataRow>(
  data: T[],
  groupField: string,
  aggregations: {
    field: string;
    operation: "sum" | "avg" | "max" | "min" | "count";
    alias?: string;
  }[]
): Array<{ group: string; [key: string]: number | string }> {
  const groups = groupBy(data, groupField);

  return Object.entries(groups).map(([key, rows]) => {
    const result: { group: string; [key: string]: number | string } = { group: key };

    aggregations.forEach((agg) => {
      const alias = agg.alias || `${agg.operation}_${agg.field}`;
      let value = 0;

      switch (agg.operation) {
        case "sum":
          value = sumField(rows, agg.field);
          break;
        case "avg":
          value = avgField(rows, agg.field);
          break;
        case "max":
          value = maxField(rows, agg.field);
          break;
        case "min":
          value = minField(rows, agg.field);
          break;
        case "count":
          value = rows.length;
          break;
      }

      result[alias] = value;
    });

    return result;
  });
}

// =============================================================================
// HOOKS PARA REACT
// =============================================================================

import { useState, useEffect, useCallback } from "react";

/**
 * Hook para carregar dados com estado
 */
export function useData<T extends DataRow>(
  sourceId: string,
  options?: LoadOptions
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await loadData<T>(sourceId, options);

    setData(result.data);
    setTotal(result.total);
    setError(result.error || null);
    setLoading(false);
  }, [sourceId, JSON.stringify(options)]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, total, loading, error, reload };
}

/**
 * Hook para carregar dados de caminho direto
 */
export function useDataFromPath<T extends DataRow>(
  path: string,
  type: "csv" | "json" | "api" = "csv",
  options?: LoadOptions
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await loadFromPath<T>(path, type, options);

    setData(result.data);
    setTotal(result.total);
    setError(result.error || null);
    setLoading(false);
  }, [path, type, JSON.stringify(options)]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, total, loading, error, reload };
}

// =============================================================================
// COMPATIBILIDADE COM VERSAO ANTERIOR
// =============================================================================

// Interfaces legadas
export interface CRMLead extends DataRow {
  ID_Lead: number;
  "STATUS DO LEAD": string;
  "Vendedor que atendeu": string;
  "Receita Gerada": number;
  "Tempo até Conversão (Dias)": number;
}

export interface DadosConsolidados extends DataRow {
  Data: string;
  Campanha: string;
  Custo: number;
  Cliques: number;
  Impressões: number;
  Conversões: number;
}

export interface Calculos extends DataRow {}

// Funcoes legadas (mantidas para compatibilidade - retornam array direto)
export const loadCRM = async (): Promise<CRMLead[]> => {
  const result = await loadFromPath<CRMLead>("/data/crm.csv", "csv");
  return result.data;
};
export const loadDadosConsolidados = async (): Promise<DadosConsolidados[]> => {
  const result = await loadFromPath<DadosConsolidados>("/data/dados_consolidados.csv", "csv");
  return result.data;
};
export const loadCalculos = async (): Promise<Calculos[]> => {
  const result = await loadFromPath<Calculos>("/data/calculos.csv", "csv");
  return result.data;
};
export const loadGoogleAnalytics = async (): Promise<DataRow[]> => {
  const result = await loadFromPath("/data/google_analytics.csv", "csv");
  return result.data;
};
export const loadKPIs = async (): Promise<DataRow[]> => {
  const result = await loadFromPath("/data/kpis_e_metricas_.csv", "csv");
  return result.data;
};
export const loadLeadsConvertidos = async (): Promise<DataRow[]> => {
  const result = await loadFromPath("/data/leads_convertidos_trafego_pago_.csv", "csv");
  return result.data;
};
