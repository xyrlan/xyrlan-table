import useSWR from "swr";
import { createDefaultDataProvider } from "./defaultDataProvider";
import { DataProvider, QueryParams } from "./useTable.types";
import { fetcher } from "../utils/fetcher";

export function useTableData<T>(opts: {
  url: string;
  customProvider?: DataProvider<T>;
}) {

  const {
    url, customProvider
  } = opts;

  // const provider = customProvider
  //   ? customProvider
  //   : createDefaultDataProvider<T>(endpoint!, baseUrl);

  // const key = ["table-data",
  //   page, perPage, sortDescriptor, filterParams, searchParam
  // ];

  const { data: result, error, mutate, isValidating } = useSWR(
    url,
    fetcher<T>
  );

  console.log(result);

  return {
    items: result?.data ?? [] as T[],
    totalCount: result?.paging?.totalCount ?? 0,
    isLoading: isValidating,
    error,
    mutate,
  };
}
