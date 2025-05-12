/** Parâmetros que seu hook vai passar ao provedor */
export interface QueryParams {
  page: number;
  perPage: number;
  /** { column: "name", direction: "asc"|"desc" } */
  sort?: { column: string; direction: "asc" | "desc" };
  /** Array de filtros já no formato [{ field, value }] */
  filterParams?: { field: string; value: any }[];
  /** Parâmetro de busca { contains: string } */
  searchParam?: any;
  /** Em quais campos aplicar a busca */
  searchFields?: string[];
}

/** O que o provedor deve devolver */
export interface DataResponse<T> {
  data: T[];
  paging: {
    totalCount: number;
    page: number;
    pageSize: number;
  };
}

/** Assinatura do provedor de dados */
export type DataProvider<T> = (params: QueryParams) => Promise<DataResponse<T>>;
