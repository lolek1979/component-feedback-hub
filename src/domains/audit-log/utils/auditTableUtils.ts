import { ReadonlyURLSearchParams } from 'next/navigation';

export function getPageSizeFromUrlGetParam(searchParams: ReadonlyURLSearchParams): string {
  let pageSize: string = searchParams.get('pageSize') ?? '10';
  // check if the pageSize is number
  if (isNaN(Number(pageSize))) {
    pageSize = '10'; // Default value if not a number
  }

  return pageSize;
}

export function getSuccessFromUrlGetParam(searchParams: ReadonlyURLSearchParams): string | null {
  const success = searchParams.get('success');
  if (success) {
    if (success === 'true' || success === 'false') {
      return success;
    } else {
      console.error(`Invalid success value in URL: ${success}. Expected 'true' or 'false'.`);
    }
  }

  return null; // Return null if not a valid boolean string
}

export function getDateFromUrlGetParam(
  type: string,
  searchParams: ReadonlyURLSearchParams,
): Date | null {
  const dateStr = searchParams.get(type);
  if (dateStr) {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      // Check if the date is valid
      return date;
    } else {
      console.error(
        `Invalid date value in URL for ${type}: ${dateStr}. Expected a valid date string.`,
      );
    }
  }

  return null; // Return null if not present or invalid
}

export function getPageIndexFromUrlGetParam(searchParams: ReadonlyURLSearchParams): number {
  const pageIndex = searchParams.get('page');
  if (pageIndex !== null) {
    const page = parseInt(pageIndex, 10);
    if (!isNaN(page) && page >= 0) {
      return page; // Return the valid page index
    } else {
      console.error(`Invalid page index in URL: ${pageIndex}. Expected a non-negative integer.`);
    }
  }

  return 0; // Default to 0 if not present or invalid
}
