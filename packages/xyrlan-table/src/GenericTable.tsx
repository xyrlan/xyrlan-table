"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { CircularProgress } from "@heroui/progress";
import { Key } from "@react-types/shared";

import { TableToolbar } from "./components/TableToolbar";
import { TablePagination } from "./components/TablePagination";
import { GenericTableProps, Column } from "./GenericTable.types";
import { Action, State } from "./hooks/useTableState";
import { defaultRenderCell } from "./utils/renderCell";

type InternalTableProps<T> = GenericTableProps<T> & {
  visibleColumns?: Set<Key>;
  setVisibleColumns?: (keys: Set<Key>) => void;
  dispatch?: React.Dispatch<Action>;
  debouncedSearch?: (v: string) => void;
  addNewItem?: boolean;
  addNewItemComponent?: React.ReactNode | ((mutate?: () => void) => React.ReactNode);
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
};

export default function GenericTable<T extends Record<string, any>>({
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
  bottomContent,
}: InternalTableProps<T>) {

  const handleSelectionChange = (keys: "all" | Set<Key>) => {
    if (!onSelectionChange) return;

    if (keys === "all") {
      const visibleIds = items.map((item: any) => item.id);
      const updatedSelection = new Set([
        ...(selectedKeys as Set<Key>),
        ...visibleIds,
      ]);
      onSelectionChange(updatedSelection);
    } else {
      onSelectionChange(keys as Set<Key>);
    }
  };

  const effectiveRenderCell = renderCell ?? defaultRenderCell;

  return (
    <section className="space-y-4">
      <Table
        isHeaderSticky
        aria-label="Tabela genérica"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContent={topContent}
        topContentPlacement="outside"
        classNames={{ wrapper: "h-full max-h-[600px]" }}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode ? "multiple" : "none"}
        sortDescriptor={sortDescriptor}
        onSelectionChange={handleSelectionChange}
        onSortChange={onSortChange}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid as string}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          emptyContent="Nenhum registro encontrado"
          isLoading={isLoading}
          items={items}
          loadingContent={<CircularProgress aria-label="Carregando..." />}
        >
          {(item) => (
            <TableRow key={(item as any).id}>
              {(columnKey) => (
                <TableCell>{effectiveRenderCell(item, columnKey as keyof T, mutate)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
