import { useRef, useEffect } from "react";

export function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = (...args: any[]) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return debouncedCallback;
}
