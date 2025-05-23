// src/GenericTable.tsx
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/table";
import { CircularProgress } from "@heroui/progress";

// src/utils/renderCell.tsx
import { jsx } from "react/jsx-runtime";
function defaultRenderCell(item, columnKey) {
  const value = item[columnKey];
  return /* @__PURE__ */ jsx("span", { className: "text-sm text-default-800 break-all", children: typeof value === "object" ? JSON.stringify(value) : String(value ?? "") });
}

// src/GenericTable.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function GenericTable({
  columns,
  items,
  renderCell,
  selectedKeys,
  selectionMode = false,
  onSelectionChange,
  isLoading,
  sortDescriptor,
  onSortChange,
  mutate,
  topContent,
  bottomContent
}) {
  const handleSelectionChange = (keys) => {
    if (!onSelectionChange) return;
    if (keys === "all") {
      const visibleIds = items.map((item) => item.id);
      const updatedSelection = /* @__PURE__ */ new Set([
        ...selectedKeys,
        ...visibleIds
      ]);
      onSelectionChange(updatedSelection);
    } else {
      onSelectionChange(keys);
    }
  };
  function getCellRenderer(item, columnKey, renderCellMap, mutate2) {
    if (renderCellMap?.[columnKey]) {
      return renderCellMap[columnKey]?.(item, mutate2);
    }
    return defaultRenderCell(item, columnKey);
  }
  const effectiveRenderCell = renderCell ?? defaultRenderCell;
  return /* @__PURE__ */ jsx2("section", { className: "space-y-4", children: /* @__PURE__ */ jsxs(
    Table,
    {
      isHeaderSticky: true,
      "aria-label": "Tabela gen\xE9rica",
      bottomContent,
      bottomContentPlacement: "outside",
      topContent,
      topContentPlacement: "outside",
      classNames: { wrapper: "h-full max-h-[600px]" },
      selectedKeys,
      selectionMode: selectionMode ? "multiple" : "none",
      sortDescriptor,
      onSelectionChange: handleSelectionChange,
      onSortChange,
      children: [
        /* @__PURE__ */ jsx2(TableHeader, { columns, children: (column) => /* @__PURE__ */ jsx2(
          TableColumn,
          {
            align: column.uid === "actions" ? "center" : "start",
            allowsSorting: column.sortable,
            children: column.name
          },
          column.uid
        ) }),
        /* @__PURE__ */ jsx2(
          TableBody,
          {
            emptyContent: "Nenhum registro encontrado",
            isLoading,
            items,
            loadingContent: /* @__PURE__ */ jsx2(CircularProgress, { "aria-label": "Carregando..." }),
            children: (item) => /* @__PURE__ */ jsx2(TableRow, { children: (columnKey) => /* @__PURE__ */ jsxs(TableCell, { children: [
              " ",
              getCellRenderer(item, columnKey, renderCell, mutate),
              " "
            ] }) }, item.id)
          }
        )
      ]
    }
  ) });
}

// src/hooks/useTable.tsx
import { useMemo as useMemo3 } from "react";

// src/hooks/useDebounce.tsx
import { useRef, useEffect } from "react";
function useDebounce(callback, delay) {
  const debounceTimeout = useRef(null);
  const debouncedCallback = (...args) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  return debouncedCallback;
}

// src/hooks/useTableState.tsx
import { useReducer, useMemo } from "react";
function reducer(state, action) {
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
          page: 1
        }
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
        queryCriteria: { ...state.queryCriteria, page: action.payload }
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
            [action.payload.column]: action.payload.direction === "ascending" ? "asc" : "desc"
          }
        }
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
          page: 1
        }
      };
    case "SET_FILTER_PARAM":
      return {
        ...state,
        filterParams: {
          ...state.filterParams,
          [action.payload.field]: action.payload.value
        },
        page: 1
      };
    case "REMOVE_FILTER_PARAM":
      const { [action.payload]: _, ...remainingFilters } = state.filterParams;
      return {
        ...state,
        filterParams: remainingFilters,
        page: 1
      };
    case "CLEAR_FILTER":
      return {
        ...state,
        filterValue: "",
        page: 1,
        queryCriteria: { ...state.queryCriteria, params: {}, page: 1 }
      };
    default:
      return state;
  }
}
function useTableState(columns, initialVisibleColumns) {
  const initialState = {
    pages: 5,
    rowsPerPage: 10,
    page: 1,
    filterValue: "",
    selectedKeys: /* @__PURE__ */ new Set(),
    visibleColumns: new Set(initialVisibleColumns),
    sortDescriptor: {
      column: "createdAt",
      direction: "ascending"
    },
    selectionMode: false,
    queryCriteria: {
      page: 1,
      pageSize: 10,
      orderBy: { createdAt: "asc" },
      params: {
        searchParam: { contains: "", fields: ["name", "email", "phoneNumber"] }
      }
    },
    filterParams: []
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const headerColumns = useMemo(() => {
    return state.visibleColumns === "all" ? columns : columns.filter((column) => state.visibleColumns.has(column.uid));
  }, [state.visibleColumns, columns]);
  const setSelectedKeys = (keys) => dispatch({ type: "SET_SELECTED_KEYS", payload: keys });
  const setVisibleColumns = (columns2) => dispatch({ type: "SET_VISIBLE_COLUMNS", payload: columns2 });
  const setSelectionMode = (mode) => dispatch({ type: "SET_SELECTION_MODE", payload: mode });
  return {
    state,
    dispatch,
    headerColumns,
    selectedKeys: state.selectedKeys,
    setSelectedKeys,
    visibleColumns: state.visibleColumns,
    setVisibleColumns,
    selectionMode: state.selectionMode,
    setSelectionMode
  };
}

// src/hooks/useTableData.tsx
import useSWR from "swr";

// src/utils/fetcher.ts
var fetcher = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// src/hooks/useTableData.tsx
function useTableData(opts) {
  const {
    url,
    customProvider
  } = opts;
  const { data: result, error, mutate, isValidating } = useSWR(
    url,
    fetcher
  );
  return {
    items: result?.data ?? [],
    totalCount: result?.paging?.totalCount ?? 0,
    isLoading: isValidating,
    error,
    mutate
  };
}

// src/hooks/useSorting.tsx
import { useMemo as useMemo2 } from "react";
function useSorting(data, sortDescriptor) {
  return useMemo2(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);
}

// src/components/TableToolbar.tsx
import { Input } from "@heroui/input";
import { FilterIcon, Columns3, SearchIcon } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function TableToolbar({
  state,
  filterableColumns,
  visibleColumns,
  setVisibleColumns,
  dispatch,
  debouncedSearch,
  total,
  columns,
  addNewItem,
  addNewItemComponent,
  selectionMode
}) {
  return /* @__PURE__ */ jsxs2("div", { className: "flex gap-3 flex-grow", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex flex-col gap-2 items-center", children: [
      /* @__PURE__ */ jsx3(
        Switch,
        {
          defaultSelected: selectionMode,
          size: "sm",
          onValueChange: () => dispatch?.({
            type: "SET_SELECTION_MODE",
            payload: !selectionMode
          })
        }
      ),
      /* @__PURE__ */ jsx3("span", { className: "text-xs check", children: "Modo selecionar" })
    ] }),
    /* @__PURE__ */ jsx3(
      Input,
      {
        isClearable: true,
        className: "w-full sm:max-w-[25%]",
        placeholder: "Pesquisar...",
        size: "sm",
        startContent: /* @__PURE__ */ jsx3(SearchIcon, {}),
        onClear: () => dispatch?.({ type: "CLEAR_FILTER" }),
        onValueChange: (value) => {
          debouncedSearch?.(value);
          dispatch?.({ type: "SET_PAGES", payload: 1 });
        }
      }
    ),
    filterableColumns.length > 0 && /* @__PURE__ */ jsxs2(
      Popover,
      {
        classNames: {
          content: "min-w-[300px] flex flex-col items-start gap-4 py-4 px-4"
        },
        size: "sm",
        children: [
          /* @__PURE__ */ jsx3(PopoverTrigger, { children: /* @__PURE__ */ jsx3(Button, { size: "sm", startContent: /* @__PURE__ */ jsx3(FilterIcon, { size: 18 }), variant: "flat", children: "Filtros" }) }),
          /* @__PURE__ */ jsx3(PopoverContent, { children: filterableColumns.map((column) => /* @__PURE__ */ jsx3(
            CheckboxGroup,
            {
              classNames: {
                label: "capitalize text-sm"
              },
              label: column.name,
              value: state.filterParams[column.uid] ? Array.from(state.filterParams[column.uid]) : Array.from(
                column.filterOptions.map(
                  (option) => option.value
                )
              ),
              onChange: (value) => {
                dispatch?.({
                  type: "SET_FILTER_PARAM",
                  payload: {
                    field: column.uid,
                    value: new Set(value)
                  }
                });
                dispatch?.({ type: "SET_PAGES", payload: 1 });
              },
              children: column?.filterOptions?.map((option) => /* @__PURE__ */ jsx3(
                Checkbox,
                {
                  value: option.value,
                  classNames: {
                    label: "text-sm "
                  },
                  children: option.label ?? option.value
                },
                option.value
              ))
            },
            column.uid
          )) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs2(Dropdown, { children: [
      /* @__PURE__ */ jsx3(DropdownTrigger, { className: "hidden sm:flex", children: /* @__PURE__ */ jsx3(Button, { size: "sm", startContent: /* @__PURE__ */ jsx3(Columns3, { size: 18 }), variant: "flat", children: "Colunas" }) }),
      /* @__PURE__ */ jsx3(
        DropdownMenu,
        {
          disallowEmptySelection: true,
          "aria-label": "Table Columns",
          closeOnSelect: false,
          selectedKeys: visibleColumns,
          selectionMode: "multiple",
          onSelectionChange: setVisibleColumns,
          children: columns.map((column) => /* @__PURE__ */ jsx3(DropdownItem, { children: column.name }, column.uid))
        }
      )
    ] }),
    /* @__PURE__ */ jsx3(
      Select,
      {
        className: "max-w-56",
        classNames: {
          label: "text-default-400 text-small"
        },
        label: "Linhas por p\xE1gina",
        labelPlacement: "outside-left",
        selectedKeys: [state.rowsPerPage.toString()],
        selectionMode: "single",
        size: "sm",
        onChange: (e) => dispatch?.({
          type: "SET_ROWS_PER_PAGE",
          payload: Number(e.target.value)
        }),
        children: ["5", "10", "15", "20", "25", "30", "35", "40", "50", "60", "70", "80", "90", "100"].map(
          (size) => /* @__PURE__ */ jsx3(SelectItem, { children: size }, size.toString())
        )
      }
    )
  ] });
}

// src/components/TablePagination.tsx
import { Pagination } from "@heroui/pagination";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function TablePagination({
  total,
  page,
  rowsPerPage,
  selectedKeys,
  setPage,
  selectionMode
}) {
  const totalPages = Math.ceil(total / rowsPerPage);
  return /* @__PURE__ */ jsxs3("div", { className: "flex gap-4 sm:flex-row sm:items-center sm:justify-between p-2 text-sm text-default-400", children: [
    /* @__PURE__ */ jsx4("span", { className: " text-small text-default-400", children: selectionMode && (selectedKeys === "all" ? "All items selected" : `${selectedKeys.size} de ${total} selecionado${selectedKeys.size > 1 ? "s" : ""}`) }),
    /* @__PURE__ */ jsx4("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx4(
      Pagination,
      {
        isCompact: true,
        size: "sm",
        showControls: true,
        showShadow: true,
        color: "primary",
        total: totalPages,
        page,
        onChange: setPage
      }
    ) }),
    /* @__PURE__ */ jsxs3("span", { children: [
      "Total de registros: ",
      /* @__PURE__ */ jsx4("strong", { className: " text-small text-default-400", children: total })
    ] })
  ] });
}

// src/utils/queryHelper.tsx
var QueryParamsBuilder = class {
  static buildFilterParams(filterParams) {
    return filterParams.reduce((acc, item) => {
      if (item.field.includes("_")) {
        const keys = item.field.split("_");
        let currentLevel = acc;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            if (Array.isArray(item.value)) {
              currentLevel[key] = { in: item.value };
            } else {
              currentLevel[key] = item.value;
            }
          } else {
            currentLevel[key] = currentLevel[key] || {};
            currentLevel = currentLevel[key];
          }
        });
      } else {
        if (Array.isArray(item.value)) {
          acc[item.field] = { in: item.value };
        } else {
          acc[item.field] = item.value;
        }
      }
      return acc;
    }, {});
  }
  static buildSearchParam(searchParam) {
    return { ...searchParam, mode: "insensitive" };
  }
  static buildSearchFields(searchFields, searchParam) {
    return searchFields.map((field) => {
      const keys = field.split("_");
      let condition = { contains: searchParam.contains, mode: "insensitive" };
      for (let i = keys.length - 1; i >= 0; i--) {
        condition = { [keys[i]]: condition };
      }
      return condition;
    });
  }
  static buildQueryParams(filterParams, searchParam, searchFields) {
    const conditions = [];
    if (searchParam) {
      if (!searchFields || searchFields.length === 0) {
        throw new Error(
          "searchFields must be provided when searchParam is used."
        );
      }
      const orConditions = this.buildSearchFields(searchFields, searchParam);
      conditions.push({ OR: orConditions });
    }
    if (filterParams) {
      const filters = this.buildFilterParams(filterParams);
      conditions.push(filters);
    }
    return conditions.length > 1 ? { AND: conditions } : conditions[0] || {};
  }
};

// src/hooks/useTable.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function useTable({
  endpoint,
  dataProvider: customProvider,
  baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "",
  columns,
  initialVisibleColumns,
  searchFields,
  addNewItem = false,
  addNewItemComponent
}) {
  const {
    state,
    dispatch,
    headerColumns,
    selectedKeys,
    setSelectedKeys,
    visibleColumns,
    setVisibleColumns,
    selectionMode,
    setSelectionMode
  } = useTableState(columns, initialVisibleColumns);
  const debouncedSearch = useDebounce((value) => {
    dispatch({ type: "SET_FILTER_VALUE", payload: value });
    dispatch({ type: "SET_PAGE", payload: 1 });
  }, 500);
  const queryCriteria = useMemo3(() => {
    const params = QueryParamsBuilder.buildQueryParams(
      Object.entries(state.filterParams).map(([field, value]) => ({
        field,
        value
      })),
      state.filterValue ? { contains: state.filterValue.toLowerCase() } : void 0,
      searchFields
    );
    return {
      page: state.page,
      pageSize: state.rowsPerPage,
      orderBy: state.sortDescriptor ? {
        [state.sortDescriptor.column]: state.sortDescriptor.direction === "ascending" ? "asc" : "desc"
      } : void 0,
      params
    };
  }, [
    state.filterParams,
    state.filterValue,
    state.page,
    state.rowsPerPage,
    state.sortDescriptor,
    searchFields
  ]);
  const { items, totalCount, isLoading, mutate } = useTableData({
    url: `${baseUrl}${endpoint}?queryCriteria=${JSON.stringify(queryCriteria)}`
  });
  const sortedItems = useSorting ? useSorting(items, state.sortDescriptor) : items;
  function isFilterableColumn(col) {
    return col.filterable === true && Array.isArray(col.filterOptions);
  }
  const filterableColumns = useMemo3(
    () => headerColumns.filter(isFilterableColumn),
    [headerColumns]
  );
  const topContent = useMemo3(
    () => /* @__PURE__ */ jsx5(
      TableToolbar,
      {
        state,
        columns,
        filterableColumns,
        visibleColumns,
        setVisibleColumns,
        dispatch,
        debouncedSearch,
        total: totalCount,
        selectionMode,
        addNewItem,
        addNewItemComponent
      }
    ),
    [
      filterableColumns,
      visibleColumns,
      debouncedSearch,
      selectionMode,
      addNewItem,
      addNewItemComponent,
      mutate
    ]
  );
  const bottomContent = useMemo3(
    () => /* @__PURE__ */ jsx5(
      TablePagination,
      {
        total: totalCount,
        page: state.page,
        rowsPerPage: state.rowsPerPage,
        setPage: (p) => dispatch({ type: "SET_PAGE", payload: p }),
        selectionMode,
        selectedKeys
      }
    ),
    [totalCount, state.page, state.rowsPerPage, selectedKeys]
  );
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
    setSortDescriptor: (desc) => dispatch({ type: "SET_SORT_DESCRIPTOR", payload: desc }),
    mutate
  };
}

// XyrlanTable.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function XyrlanTable(props) {
  const {
    headerColumns,
    sortedItems,
    selectedKeys,
    selectionMode,
    sortDescriptor,
    isLoading,
    topContent,
    bottomContent,
    setSelectedKeys,
    setSortDescriptor,
    mutate
  } = useTable(props);
  return /* @__PURE__ */ jsx6(
    GenericTable,
    {
      columns: headerColumns,
      items: sortedItems,
      selectedKeys,
      selectionMode,
      sortDescriptor,
      isLoading,
      onSelectionChange: setSelectedKeys,
      onSortChange: setSortDescriptor,
      topContent,
      bottomContent,
      mutate,
      renderCell: props.renderCellMap
    }
  );
}

// src/components/XyrlanTableProvider.tsx
import { HeroUIProvider } from "@heroui/system";
import { jsx as jsx7 } from "react/jsx-runtime";
var XyrlanTableProvider = ({ children }) => {
  return /* @__PURE__ */ jsx7(HeroUIProvider, { children });
};
export {
  XyrlanTable,
  XyrlanTableProvider,
  defaultRenderCell
};
