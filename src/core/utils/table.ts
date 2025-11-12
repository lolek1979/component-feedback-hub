import { SortDirection } from './types';

/**
 * Returns the next sort direction in a table sorting cycle.
 *
 * Cycles through 'asc' → 'desc' → 'none' → 'asc'.
 *
 * @param currentDirection - The current sort direction ('asc', 'desc', or 'none').
 * @returns The next sort direction.
 *
 * @example
 * let direction = getNextSortDirection('asc'); // 'desc'
 * direction = getNextSortDirection(direction); // 'none'
 * direction = getNextSortDirection(direction); // 'asc'
 */
const getNextSortDirection = (currentDirection: SortDirection): SortDirection => {
  if (currentDirection === 'asc') return 'desc';
  if (currentDirection === 'desc') return 'none';

  return 'asc';
};

export { getNextSortDirection };
