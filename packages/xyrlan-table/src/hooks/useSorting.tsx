import { useMemo } from "react";

export function useSorting(
  data: any[],
  sortDescriptor: { column: string; direction: "ascending" | "descending" },
) {
  return useMemo(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);
}
