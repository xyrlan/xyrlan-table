import { useMemo } from "react";

export function useFilter(data: any[], filterValue: string) {
  const filteredItems = useMemo(() => {
    let _filteredItems = [...data];

    if (filterValue !== "all") {
      _filteredItems = _filteredItems.filter((item) =>
        Array.from(filterValue).includes(item.status),
      );
    }

    return _filteredItems;
  }, [data, filterValue]);

  return filteredItems;
}
