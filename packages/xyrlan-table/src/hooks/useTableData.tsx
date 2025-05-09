import useSWR from "swr";
import { createDefaultDataProvider } from "./defaultDataProvider"; 
import { DataProvider, QueryParams } from "./useTable.types";

export function useTableData<T>(opts: {
  endpoint?: string;
  customProvider?: DataProvider<T>;
  baseUrl?: string;
  page: number;
  perPage: number;
  sortDescriptor: { column: string; direction: "ascending"|"descending" };
  filterParams: { field: string; value: any }[];
  searchParam: { contains: string } | undefined;
  searchFields?: string[];
}) {
  const {
    endpoint, customProvider, baseUrl,
    page, perPage, sortDescriptor, filterParams,
    searchParam, searchFields,
  } = opts;

  const provider = customProvider
    ? customProvider
    : createDefaultDataProvider<T>(endpoint!, baseUrl);

  const key = ["table-data",
    page, perPage, sortDescriptor, filterParams, searchParam
  ];

  const { data, error, mutate, isValidating } = useSWR(
    key,
    () => provider({
      page,
      perPage,
      sort: {
        column: sortDescriptor.column,
        direction: sortDescriptor.direction === "ascending" ? "asc" : "desc",
      },
      filterParams,
      searchParam,
      searchFields,
    } as QueryParams)
  );

  return {
    items:     data?.items     ?? []   as T[],
    totalCount:data?.totalCount?? 0,
    isLoading: isValidating,
    error,
    mutate,
  };
}
