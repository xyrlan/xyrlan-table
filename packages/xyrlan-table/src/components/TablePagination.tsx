import React from "react";
import { Pagination } from "@heroui/pagination";
import { Checkbox } from "@heroui/checkbox";

type TablePaginationProps = {
  total: number;
  page: number;
  rowsPerPage: number;
  selectedKeys: Set<React.Key> | "all";
  onSelectAllChange?: (checked: boolean) => void;
  setPage: (page: number) => void;
};

export function TablePagination({
  total,
  page,
  rowsPerPage,
  selectedKeys,
  setPage,
  onSelectAllChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / rowsPerPage);
  const selectedCount = selectedKeys === "all" ? total : selectedKeys.size;

  const isAllSelected = selectedKeys === "all" || selectedCount === total;
  const isIndeterminate = selectedKeys !== "all" && selectedCount > 0 && selectedCount < total;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-2 text-sm text-default-400">
      <span>
        Total de registros: <strong className="text-default-600">{total}</strong>
      </span>

      <div className="flex items-center gap-4">
        {onSelectAllChange && (
          <Checkbox
            isSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            onChange={onSelectAllChange as any}
          >
            Selecionar todos
          </Checkbox>
        )}

        <Pagination
          size="sm"
          showControls
          total={totalPages}
          page={page}
          onChange={setPage}
          classNames={{
            cursor: "bg-foreground text-background",
            item: "text-default-500",
          }}
          radius="full"
          variant="flat"
        />
      </div>
    </div>
  );
}
