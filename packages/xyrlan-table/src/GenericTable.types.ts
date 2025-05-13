import { Key } from "@react-types/shared";
import { Dispatch, ReactNode } from "react";

export interface Column<T = any> {
  uid: keyof T | "actions" | (string & {});
  name: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: { value: any; label?: string }[];
}

// Props para renderização da tabela
export interface RenderProps<T> {
  columns: Column[];
  items: T[];
  renderCell?: Partial<Record<keyof T | "actions", (item: T, mutate?: any) => React.ReactNode>>;
}

// Seleção (checkbox)
export interface SelectionProps {
  selectedKeys: "all" | Set<Key>;
  selectionMode: boolean;
  onSelectionChange: (keys: Set<Key>) => void;
}

// Ordenação (sorting)
export interface SortingProps {
  sortDescriptor: {
    column: string;
    direction: "ascending" | "descending";
  };
  onSortChange: (sortDescriptor: any) => void;
}

// Paginação
export interface PaginationProps {
  totalCount: number;
  rowsPerPage: number;
  page: number;
  setPage:  (n: number) => void | undefined;
}

// Toolbar (filtros, botões de nova entrada etc.)
export interface ToolbarProps {
  filterableColumns?: Column[];
  mutate?: () => void;
}

// Props gerais do componente de tabela genérica
export interface GenericTableProps<T>
  extends RenderProps<T>,
    Partial<SelectionProps>,
    Partial<SortingProps>,
    Partial<PaginationProps>,
    Partial<ToolbarProps> {
  isLoading: boolean;
}
