import { useReducer, useMemo } from "react";
import { Column } from "../GenericTable.types";

export interface State {
  pages: number;
  rowsPerPage: number;
  page: number;
  filterValue: string;
  selectedKeys: any;
  visibleColumns: any | "all";
  sortDescriptor: {
    column: string;
    direction: "ascending" | "descending";
  };
  selectionMode: boolean;
  queryCriteria: any;
  filterParams: { [key: string]: any };
}

export type Action =
  | { type: "SET_PAGES"; payload: number }
  | { type: "SET_ROWS_PER_PAGE"; payload: number }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_FILTER_VALUE"; payload: string }
  | { type: "SET_SELECTED_KEYS"; payload: Set<any> }
  | { type: "SET_VISIBLE_COLUMNS"; payload: Set<string> | "all" }
  | {
      type: "SET_SORT_DESCRIPTOR";
      payload: { column: string; direction: "ascending" | "descending" };
    }
  | { type: "SET_SELECTION_MODE"; payload: boolean }
  | { type: "SET_QUERY_CRITERIA"; payload: any }
  | { type: "SET_FILTER_PARAM"; payload: { field: string; value: any } }
  | { type: "REMOVE_FILTER_PARAM"; payload: string }
  | { type: "CLEAR_FILTER" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAGES":
      return { ...state, pages: action.payload };
    case "SET_ROWS_PER_PAGE":
      return {
        ...state,
        rowsPerPage: action.payload,
        page: 1,
        queryCriteria: {
          ...state.queryCriteria,
          pageSize: action.payload,
          page: 1,
        },
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
        queryCriteria: { ...state.queryCriteria, page: action.payload },
      };
    case "SET_FILTER_VALUE":
      return { ...state, filterValue: action.payload };
    case "SET_SELECTED_KEYS":
      return { ...state, selectedKeys: action.payload };
    case "SET_VISIBLE_COLUMNS":
      return { ...state, visibleColumns: action.payload };
    case "SET_SORT_DESCRIPTOR":
      return {
        ...state,
        sortDescriptor: action.payload,
        queryCriteria: {
          ...state.queryCriteria,
          orderBy: {
            [action.payload.column]:
              action.payload.direction === "ascending" ? "asc" : "desc",
          },
        },
      };
    case "SET_SELECTION_MODE":
      return { ...state, selectionMode: action.payload };
    case "SET_QUERY_CRITERIA":
      return {
        ...state,
        page: 1,
        queryCriteria: {
          ...state.queryCriteria,
          params: { ...state.queryCriteria.params, ...action.payload },
          page: 1,
        },
      };
    case "SET_FILTER_PARAM":
      return {
        ...state,
        filterParams: {
          ...state.filterParams,
          [action.payload.field]: action.payload.value,
        },
        page: 1,
      };
    case "REMOVE_FILTER_PARAM":
      const { [action.payload]: _, ...remainingFilters } = state.filterParams;

      return {
        ...state,
        filterParams: remainingFilters,
        page: 1,
      };
    case "CLEAR_FILTER":
      return {
        ...state,
        filterValue: "",
        page: 1,
        queryCriteria: { ...state.queryCriteria, params: {}, page: 1 },
      };
    default:
      return state;
  }
}

export function useTableState<T>(columns: Column<T>[], initialVisibleColumns: (keyof T | "actions")[]) {
  const initialState: State = {
    pages: 5,
    rowsPerPage: 10,
    page: 1,
    filterValue: "",
    selectedKeys: new Set(),
    visibleColumns: new Set(initialVisibleColumns),
    sortDescriptor: {
      column: "createdAt",
      direction: "ascending",
    },
    selectionMode: false,
    queryCriteria: {
      page: 1,
      pageSize: 10,
      orderBy: { createdAt: "asc" },
      params: {
        searchParam: { contains: "", fields: ["name", "email", "phoneNumber"] },
      },
    },
    filterParams: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const headerColumns = useMemo(() => {
    return state.visibleColumns === "all"
      ? columns
      : columns.filter((column: any) => state.visibleColumns.has(column.uid));
  }, [state.visibleColumns, columns]);

  const setSelectedKeys = (keys: Set<any>) =>
    dispatch({ type: "SET_SELECTED_KEYS", payload: keys });
  const setVisibleColumns = (columns: Set<string> | "all") =>
    dispatch({ type: "SET_VISIBLE_COLUMNS", payload: columns });
  const setSelectionMode = (mode: boolean) =>
    dispatch({ type: "SET_SELECTION_MODE", payload: mode });

  return {
    state,
    dispatch,
    headerColumns,
    selectedKeys: state.selectedKeys,
    setSelectedKeys,
    visibleColumns: state.visibleColumns,
    setVisibleColumns,
    selectionMode: state.selectionMode,
    setSelectionMode,
  };
}
