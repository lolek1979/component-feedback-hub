import { useCallback, useState } from 'react';

import { SortDirection } from '@/core/utils/types';

export const useCatalogueSort = () => {
  const [catalogSortDirection, setCatalogSortDirection] = useState<SortDirection>('asc');
  const [catalogSortColumn, setCatalogSortColumn] = useState<string>('description');

  const handleCatalogSort = useCallback((column: string, newDirection: SortDirection) => {
    setCatalogSortDirection(newDirection);
    setCatalogSortColumn(column);
  }, []);

  return {
    catalogSortDirection,
    catalogSortColumn,
    handleCatalogSort,
  };
};
