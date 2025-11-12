import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const useCatalogueSearch = () => {
  const [fullText, setFullText] = useState('');
  const [catalogSearchText, setCatalogSearchText] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleFullTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullText(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setCatalogSearchText(value.trim() || null);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const shouldShowResults = useMemo(() => {
    return fullText.trim().length > 0;
  }, [fullText]);

  return {
    fullText,
    catalogSearchText,
    handleFullTextChange,
    shouldShowResults,
  };
};
