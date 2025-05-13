import React from "react";
import { Pagination } from "@heroui/pagination";
import { Checkbox } from "@heroui/checkbox";

type TablePaginationProps = {
  total: number;
  page: number;
  rowsPerPage: number;
  selectedKeys: Set<React.Key> | "all";
  setPage: (page: number) => void;
  selectionMode: boolean;
};

export function TablePagination({
  total,
  page,
  rowsPerPage,
  selectedKeys,
  setPage,
  selectionMode
}: TablePaginationProps) {
  
  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="flex gap-4 sm:flex-row sm:items-center sm:justify-between p-2 text-sm text-default-400">
      <span className=" text-small text-default-400">
        {selectionMode &&
          (selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} de ${total} selecionado${selectedKeys.size > 1 ? "s" : ""}`)
        }
      </span>
      <div className="flex items-center gap-4">
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
      <span>
        Total de registros: <strong className=" text-small text-default-400">{total}</strong>
      </span>
    </div>
  );
}
