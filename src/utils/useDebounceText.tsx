import { useState } from 'react';
import { useDebounce } from 'use-debounce';

export const useDebouncedQuery = (initialValue: string, debounceTime: number) => {
  const [query, setQuery] = useState<string>(initialValue);
  const [debouncedQuery] = useDebounce(query, debounceTime);

  return { query, setQuery, debouncedQuery };
};
