import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  const triggerImmediately = () => {
    setDebouncedValue(value);
  };

  return {
    debouncedValue,
    triggerImmediately
  };
}