import { ReadonlyURLSearchParams } from 'next/navigation';

export function composeCallBackQuery(searchParams: ReadonlyURLSearchParams): string {
  const params: string[] = [];
  searchParams.forEach((value, key) => {
    params.push(`${key}=${encodeURIComponent(value)}`);
  });

  return params.join('&');
}
