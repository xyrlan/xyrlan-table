import { DataProvider, QueryParams } from "./useTable.types";

export function createDefaultDataProvider<T>(endpoint: string, baseUrl = ""): DataProvider<T> {
  if (!endpoint) throw new Error("Endpoint is required.");

  return async (params: QueryParams) => {
    const url = new URL(`${baseUrl}${endpoint}`);
    url.searchParams.append("page", params.page.toString());
    url.searchParams.append("perPage", params.perPage.toString());

    if (params.sort) {
      url.searchParams.append("sortBy", params.sort.column);
      url.searchParams.append("sortOrder", params.sort.direction);
    }

    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      const json: T[] = await res.json();

      return {
        items: json, // Assume que o JSON é um array de objetos
        totalCount: json.length, // Estimativa simples; pode ser substituído se sua API suportar total real
      };
    } catch (err) {
      console.error("Data fetch error:", err);
      return { items: [], totalCount: 0 };
    }
  };
}
