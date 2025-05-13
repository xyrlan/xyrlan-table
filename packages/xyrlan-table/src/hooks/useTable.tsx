import React, { useMemo } from "react";
import { Key } from "@react-types/shared";
import { useDebounce } from "../hooks/useDebounce";
import { useTableState } from "../hooks/useTableState";
import { useTableData } from "../hooks/useTableData";
import { useSorting } from "../hooks/useSorting";
import { TableToolbar } from "../components/TableToolbar";
import { TablePagination } from "../components/TablePagination";
import { Column, FilterableColumn } from "../GenericTable.types";
import { QueryParamsBuilder } from "../utils/queryHelper";

export interface UseTableOptions<T> {
  /** Configuração de colunas e visibilidade */
  columns: Column<T>[];
  initialVisibleColumns: (keyof T | "actions")[];
  /** Campos para busca full-text */
  searchFields: (keyof T & string)[];
  /** Rota a usar com o provedor padrão (default) */
  endpoint: string;
  /** Base URL para o endpoint padrão */
  baseUrl?: string;
  /** RenderCell customizado (substitui `renderCell` padrão) eg. renderCell={(item, columnKey, mutate) => <CustomCell item={item} columnKey={columnKey} mutate={mutate} />} */
  renderCellMap?: Partial<Record<keyof T | "actions", (item: T, mutate?: any) => React.ReactNode>>;
  /** Adicionar botão de "novo item" */
  addNewItem?: boolean;
  addNewItemComponent?: React.ReactNode | ((mutate: any) => React.ReactNode);
  /** DataProvider customizado (substitui `endpoint`) */
  dataProvider?: (params: any) => Promise<{
    data: T[];
    paging: {
      totalCount: number;
      page: number;
      pageSize: number;
    };
  }>;
}

export function useTable<T>({
  endpoint,
  dataProvider: customProvider,
  baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "",
  columns,
  initialVisibleColumns,
  searchFields,
  addNewItem = false,
  addNewItemComponent,
}: UseTableOptions<T>) {
  // 1) Estado de UI (página, filtros, colunas, seleção...)
  const {
    state,
    dispatch,
    headerColumns,
    selectedKeys,
    setSelectedKeys,
    visibleColumns,
    setVisibleColumns,
    selectionMode,
    setSelectionMode,
  } = useTableState<T>(columns, initialVisibleColumns);

  // 2) Debounce na busca
  const debouncedSearch = useDebounce((value: string) => {
    dispatch({ type: "SET_FILTER_VALUE", payload: value });
    dispatch({ type: "SET_PAGE", payload: 1 });
  }, 500);


  const queryCriteria = useMemo(() => {
    const params = QueryParamsBuilder.buildQueryParams(
      Object.entries(state.filterParams).map(([field, value]) => ({
        field,
        value,
      })),
      state.filterValue
        ? { contains: state.filterValue.toLowerCase() }
        : undefined,
      searchFields,
    );

    return {
      page: state.page,
      pageSize: state.rowsPerPage,
      orderBy: state.sortDescriptor
        ? {
          [state.sortDescriptor.column]:
            state.sortDescriptor.direction === "ascending" ? "asc" : "desc",
        }
        : undefined,
      params,
    };
  }, [
    state.filterParams,
    state.filterValue,
    state.page,
    state.rowsPerPage,
    state.sortDescriptor,
    searchFields,
  ]);

  // 3) Busca de dados via SWR / defaultDataProvider ou customProvider
  const { items, totalCount, isLoading, mutate } = useTableData<T>({
    url: `${baseUrl}${endpoint}?queryCriteria=${JSON.stringify(queryCriteria)}`,
  });

  // 4) Ordenação cliente (caso queira override) ou manter ordem do servidor
  const sortedItems = useSorting ? useSorting(items, state.sortDescriptor) : items;

  // 5) Quantidade de páginas
  const totalPages = Math.ceil(totalCount / state.rowsPerPage);

  // 6) Filtros disponíveis
  function isFilterableColumn<T>(col: Column<T>): col is FilterableColumn<T> {
    return col.filterable === true && Array.isArray(col.filterOptions);
  }
  const filterableColumns: FilterableColumn<T>[] = useMemo(
    () => headerColumns.filter(isFilterableColumn),
    [headerColumns]
  );

  // 7) Construção dos slots de UI (Toolbar + Pagination)
  const topContent = useMemo(
    () => (
      <TableToolbar<T>
        state={state}
        columns={columns}
        filterableColumns={filterableColumns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns as any}
        dispatch={dispatch}
        debouncedSearch={debouncedSearch}
        total={totalCount}
        selectionMode={selectionMode}
        addNewItem={addNewItem}
        addNewItemComponent={addNewItemComponent}
      />
    ), [
    filterableColumns,
    visibleColumns,
    debouncedSearch,
    selectionMode,
    addNewItem,
    addNewItemComponent,
    mutate,
  ]
  );

  const bottomContent = useMemo(
    () => (
      <TablePagination
        total={totalCount}
        page={state.page}
        rowsPerPage={state.rowsPerPage}
        setPage={(p) => dispatch({ type: "SET_PAGE", payload: p })}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys as Set<Key>}
      />
    ), [totalCount, state.page, state.rowsPerPage, selectedKeys]);

  // 8) Expor API do hook
  return {
    headerColumns,
    sortedItems,
    selectedKeys,
    selectionMode,
    sortDescriptor: state.sortDescriptor,
    isLoading,
    topContent,
    bottomContent,
    setSelectedKeys,
    setSortDescriptor: (desc: typeof state.sortDescriptor) =>
      dispatch({ type: "SET_SORT_DESCRIPTOR", payload: desc }),
    mutate,
  };
}
