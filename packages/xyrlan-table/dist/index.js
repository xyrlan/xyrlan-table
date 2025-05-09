"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  XyrlanTable: () => XyrlanTable,
  XyrlanTableProvider: () => XyrlanTableProvider,
  defaultRenderCell: () => defaultRenderCell
});
module.exports = __toCommonJS(index_exports);

// src/GenericTable.tsx
var import_table = require("@heroui/table");
var import_progress = require("@heroui/progress");

// src/utils/renderCell.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function defaultRenderCell(item, columnKey) {
  const value = item[columnKey];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm text-default-800 break-all", children: typeof value === "object" ? JSON.stringify(value) : String(value ?? "") });
}

// src/GenericTable.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  filterableColumns = [],
  totalCount,
  rowsPerPage,
  page,
  setPage,
  mutate,
  visibleColumns,
  setVisibleColumns,
  dispatch,
  debouncedSearch,
  addNewItem,
  addNewItemComponent,
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
  const effectiveRenderCell = renderCell ?? defaultRenderCell;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("section", { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_table.Table,
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
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_table.TableHeader, { columns, children: (column) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_table.TableColumn,
          {
            align: column.uid === "actions" ? "center" : "start",
            allowsSorting: column.sortable,
            children: column.name
          },
          column.uid
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_table.TableBody,
          {
            emptyContent: "Nenhum registro encontrado",
            isLoading,
            items,
            loadingContent: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_progress.CircularProgress, { "aria-label": "Carregando..." }),
            children: (item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_table.TableRow, { children: (columnKey) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_table.TableCell, { children: effectiveRenderCell(item, columnKey, mutate) }) }, item.id)
          }
        )
      ]
    }
  ) });
}

// src/hooks/useTable.tsx
var import_react4 = require("react");

// src/hooks/useDebounce.tsx
var import_react = require("react");
function useDebounce(callback, delay) {
  const debounceTimeout = (0, import_react.useRef)(null);
  const debouncedCallback = (...args) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
  (0, import_react.useEffect)(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  return debouncedCallback;
}

// src/hooks/useTableState.tsx
var import_react2 = require("react");
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
  const [state, dispatch] = (0, import_react2.useReducer)(reducer, initialState);
  const headerColumns = (0, import_react2.useMemo)(() => {
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
var import_swr = __toESM(require("swr"));

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

// src/hooks/defaultDataProvider.ts
function createDefaultDataProvider(endpoint, baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "") {
  return async ({
    page,
    perPage,
    sort,
    filterParams,
    searchParam,
    searchFields
  }) => {
    const where = QueryParamsBuilder.buildQueryParams(
      filterParams,
      searchParam,
      searchFields
    );
    const queryCriteria = {
      page,
      pageSize: perPage,
      orderBy: sort ? { [sort.column]: sort.direction } : void 0,
      params: where
    };
    const url = `${baseUrl}${endpoint}?queryCriteria=` + encodeURIComponent(JSON.stringify(queryCriteria));
    const res = await fetch(url);
    const json = await res.json();
    return {
      items: json.data,
      totalCount: json.paging.totalCount
    };
  };
}

// src/hooks/useTableData.tsx
function useTableData(opts) {
  const {
    endpoint,
    customProvider,
    baseUrl,
    page,
    perPage,
    sortDescriptor,
    filterParams,
    searchParam,
    searchFields
  } = opts;
  const provider = customProvider ? customProvider : createDefaultDataProvider(endpoint, baseUrl);
  const key = [
    "table-data",
    page,
    perPage,
    sortDescriptor,
    filterParams,
    searchParam
  ];
  const { data, error, mutate, isValidating } = (0, import_swr.default)(
    key,
    () => provider({
      page,
      perPage,
      sort: {
        column: sortDescriptor.column,
        direction: sortDescriptor.direction === "ascending" ? "asc" : "desc"
      },
      filterParams,
      searchParam,
      searchFields
    })
  );
  return {
    items: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    isLoading: isValidating,
    error,
    mutate
  };
}

// src/hooks/useSorting.tsx
var import_react3 = require("react");
function useSorting(data, sortDescriptor) {
  return (0, import_react3.useMemo)(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);
}

// src/components/TableToolbar.tsx
var import_input = require("@heroui/input");
var import_lucide_react = require("lucide-react");
var import_dropdown = require("@heroui/dropdown");
var import_popover = require("@heroui/popover");
var import_checkbox = require("@heroui/checkbox");
var import_button = require("@heroui/button");
var import_jsx_runtime3 = require("react/jsx-runtime");
function TableToolbar({
  state,
  filterableColumns,
  visibleColumns,
  setVisibleColumns,
  dispatch,
  debouncedSearch,
  columns,
  addNewItem,
  addNewItemComponent,
  selectionMode
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex gap-3 flex-grow", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      import_input.Input,
      {
        isClearable: true,
        className: "w-full sm:max-w-[25%]",
        placeholder: "Pesquisar...",
        size: "sm",
        startContent: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react.SearchIcon, {}),
        onClear: () => dispatch?.({ type: "CLEAR_FILTER" }),
        onValueChange: (value) => {
          debouncedSearch?.(value);
          dispatch?.({ type: "SET_PAGES", payload: 1 });
        }
      }
    ),
    filterableColumns.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_popover.Popover, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_popover.PopoverTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_button.Button, { size: "sm", startContent: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react.FilterIcon, { size: 18 }), variant: "flat", children: "Filtros" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_popover.PopoverContent, { className: "min-w-[300px] flex flex-col gap-4", children: filterableColumns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_checkbox.CheckboxGroup,
        {
          label: column.name,
          value: state.filterParams[column.uid] ? Array.from(state.filterParams[column.uid]) : Array.from(
            column?.filterOptions?.reduce(
              (acc, option) => acc.add(option.value),
              /* @__PURE__ */ new Set()
              // inicializa com um Set vazio
            ) ?? /* @__PURE__ */ new Set(),
            // se não tiver nenhum valor, retorna um Set vazio
            (option) => option.value
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
          children: column?.filterOptions?.map((option) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_checkbox.Checkbox, { value: option.value, children: option.label ?? option.value }, option.value))
        },
        column.uid
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_dropdown.Dropdown, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dropdown.DropdownTrigger, { className: "hidden sm:flex", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_button.Button, { size: "sm", startContent: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react.Columns3, { size: 18 }), variant: "flat", children: "Colunas" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_dropdown.DropdownMenu,
        {
          disallowEmptySelection: true,
          "aria-label": "Table Columns",
          closeOnSelect: false,
          selectedKeys: visibleColumns,
          selectionMode: "multiple",
          onSelectionChange: setVisibleColumns,
          children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dropdown.DropdownItem, { children: column.name }, column.uid))
        }
      )
    ] })
  ] });
}

// src/components/TablePagination.tsx
var import_pagination = require("@heroui/pagination");
var import_checkbox2 = require("@heroui/checkbox");
var import_jsx_runtime4 = require("react/jsx-runtime");
function TablePagination({
  total,
  page,
  rowsPerPage,
  selectedKeys,
  setPage,
  onSelectAllChange
}) {
  const totalPages = Math.ceil(total / rowsPerPage);
  const selectedCount = selectedKeys === "all" ? total : selectedKeys.size;
  const isAllSelected = selectedKeys === "all" || selectedCount === total;
  const isIndeterminate = selectedKeys !== "all" && selectedCount > 0 && selectedCount < total;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-2 text-sm text-default-400", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { children: [
      "Total de registros: ",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { className: "text-default-600", children: total })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-4", children: [
      onSelectAllChange && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_checkbox2.Checkbox,
        {
          isSelected: isAllSelected,
          isIndeterminate,
          onChange: onSelectAllChange,
          children: "Selecionar todos"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_pagination.Pagination,
        {
          size: "sm",
          showControls: true,
          total: totalPages,
          page,
          onChange: setPage,
          classNames: {
            cursor: "bg-foreground text-background",
            item: "text-default-500"
          },
          radius: "full",
          variant: "flat"
        }
      )
    ] })
  ] });
}

// src/hooks/useTable.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function useTable({
  endpoint,
  dataProvider: customProvider,
  baseUrl,
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
  const { items, totalCount, isLoading, mutate } = useTableData({
    endpoint,
    customProvider,
    baseUrl,
    page: state.page,
    perPage: state.rowsPerPage,
    sortDescriptor: state.sortDescriptor,
    filterParams: Object.entries(state.filterParams).map(([field, value]) => ({ field, value })),
    searchParam: state.filterValue ? { contains: state.filterValue.toLowerCase() } : void 0,
    searchFields
  });
  const sortedItems = useSorting ? useSorting(items, state.sortDescriptor) : items;
  const totalPages = Math.ceil(totalCount / state.rowsPerPage);
  const filterableColumns = (0, import_react4.useMemo)(
    () => headerColumns.filter((col) => col.filterable),
    [headerColumns]
  );
  const topContent = (0, import_react4.useMemo)(
    () => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      TableToolbar,
      {
        state,
        columns,
        filterableColumns,
        visibleColumns,
        setVisibleColumns,
        dispatch,
        debouncedSearch,
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
  const bottomContent = (0, import_react4.useMemo)(
    () => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      TablePagination,
      {
        total: totalCount,
        page: state.page,
        rowsPerPage: state.rowsPerPage,
        setPage: (p) => dispatch({ type: "SET_PAGE", payload: p }),
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
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
      renderCell: props.renderCell
    }
  );
}

// src/components/XyrlanTableProvider.tsx
var import_system = require("@heroui/system");
var import_jsx_runtime7 = require("react/jsx-runtime");
var XyrlanTableProvider = ({ children }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_system.HeroUIProvider, { children });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  XyrlanTable,
  XyrlanTableProvider,
  defaultRenderCell
});
