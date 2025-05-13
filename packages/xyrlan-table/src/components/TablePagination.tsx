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
  selectionMode: boolean;
};

export function TablePagination({
  total,
  page,
  rowsPerPage,
  selectedKeys,
  setPage,
  onSelectAllChange,
  selectionMode
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / rowsPerPage);
  const selectedCount = selectedKeys === "all" ? total : selectedKeys.size;

  const isAllSelected = selectedKeys === "all" || selectedCount === total;
  const isIndeterminate = selectedKeys !== "all" && selectedCount > 0 && selectedCount < total;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-2 text-sm text-default-400">
      <span className="w-[30%] text-small text-default-400">
        {selectionMode &&
          (selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} de ${total} selecionado${selectedKeys.size > 1 ? "s" : ""}`)
        }
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
          isCompact
          size="sm"
          showControls
          showShadow
          color="primary"
          total={totalPages}
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  );
}
