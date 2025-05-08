import { useState, useEffect } from "react";

export function usePagination(totalCount: number, rowsPerPage: number) {
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (totalCount != null && totalCount > 0) {
      setPages(Math.ceil(totalCount / rowsPerPage));
    } else {
      // Keep the existing number of pages to avoid setting pages to zero
      setPages((prevPages) => (prevPages > 0 ? prevPages : 1));
    }
  }, [totalCount, rowsPerPage]);

  return {
    pages,
    page,
    setPage,
  };
}
