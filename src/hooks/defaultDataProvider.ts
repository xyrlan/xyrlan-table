import { QueryParamsBuilder } from "../utils/queryHelper";
import { DataProvider, DataResponse, QueryParams } from "./useTable.types";

/**
 * Cria um DataProvider que faz fetch em `${baseUrl}${endpoint}`.
 * @param endpoint – rota (ex: "/users")
 * @param baseUrl – prefixo, ex: process.env.NEXT_PUBLIC_APP_URL
 */
export function createDefaultDataProvider<T>(
  endpoint: string,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""
): DataProvider<T> {
  return async ({
    page,
    perPage,
    sort,
    filterParams,
    searchParam,
    searchFields,
  }: QueryParams): Promise<DataResponse<T>> => {
    // monta filtros e busca
    const where = QueryParamsBuilder.buildQueryParams(
      filterParams,
      searchParam,
      searchFields
    );

    // objeto conforme seu backend espera
    const queryCriteria = {
      page,
      pageSize: perPage,
      orderBy: sort ? { [sort.column]: sort.direction } : undefined,
      params: where,
    };

    const url =
      `${baseUrl}${endpoint}?queryCriteria=` +
      encodeURIComponent(JSON.stringify(queryCriteria));

    const res = await fetch(url);
    const json = await res.json();

    return {
      items: json.data,
      totalCount: json.paging.totalCount,
    };
  };
}
