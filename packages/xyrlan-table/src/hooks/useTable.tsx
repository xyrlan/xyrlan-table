import React, { useMemo } from "react";
import { Key } from "@react-types/shared";
import { useDebounce } from "../hooks/useDebounce";
import { useTableState } from "../hooks/useTableState";
import { useTableData } from "../hooks/useTableData";
import { useSorting } from "../hooks/useSorting";
import { TableToolbar } from "../components/TableToolbar";
import { TablePagination } from "../components/TablePagination";
import { Column } from "../GenericTable.types";

export interface UseTableOptions<T> {
  /** Rota a usar com o provedor padrão (default) */
  endpoint?: string;
  /** DataProvider customizado (substitui `endpoint`) */
  dataProvider?: (params: any) => Promise<{ items: T[]; totalCount: number }>;
  /** Base URL para o endpoint padrão */
  baseUrl?: string;
  /** RenderCell customizado (substitui `renderCell` padrão) eg. renderCell={(item, columnKey, mutate) => <CustomCell item={item} columnKey={columnKey} mutate={mutate} />} */
  renderCell?: (item: T, columnKey: keyof T | "actions", mutate?: any) => React.ReactNode;
  /** Configuração de colunas e visibilidade */
  columns: Column<T>[];
  initialVisibleColumns: (keyof T | "actions")[];
  /** Campos para busca full-text */
  searchFields: (keyof T)[];
  /** Adicionar botão de "novo item" */
  addNewItem?: boolean;
  addNewItemComponent?: React.ReactNode | ((mutate: any) => React.ReactNode);
}

export function useTable<T>({
  endpoint,
  dataProvider: customProvider,
  baseUrl,
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

  // 3) Busca de dados via SWR / defaultDataProvider ou customProvider
  const { items, totalCount, isLoading, mutate } = useTableData<T>({
    endpoint,
    customProvider,
    baseUrl,
    page: state.page,
    perPage: state.rowsPerPage,
    sortDescriptor: state.sortDescriptor,
    filterParams: Object.entries(state.filterParams).map(([field, value]) => ({ field, value })),
    searchParam: state.filterValue
      ? { contains: state.filterValue.toLowerCase() }
      : undefined,
    searchFields: searchFields as string[],
  });

  // 4) Ordenação cliente (caso queira override) ou manter ordem do servidor
  const sortedItems = useSorting ? useSorting(items, state.sortDescriptor) : items;

  // 5) Quantidade de páginas
  const totalPages = Math.ceil(totalCount / state.rowsPerPage);

  // 6) Filtros disponíveis
  const filterableColumns = useMemo(
    () => headerColumns.filter((col) => col.filterable),
    [headerColumns]
  );

  // 7) Construção dos slots de UI (Toolbar + Pagination)
  const topContent = useMemo(
    () => (
      <TableToolbar
        state={state}
        columns={columns}
        filterableColumns={filterableColumns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns as any}
        dispatch={dispatch}
        debouncedSearch={debouncedSearch}
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
