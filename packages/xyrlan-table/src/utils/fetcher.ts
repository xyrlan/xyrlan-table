import { DataResponse } from "../hooks/useTable.types";

export const fetcher = async <T,>(url: string): Promise<DataResponse<T>> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};