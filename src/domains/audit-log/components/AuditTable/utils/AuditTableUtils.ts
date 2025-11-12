import { isEqual } from 'date-fns';

//compare two dates to check if they are equal
// if both are null return true
// if both are undefined return true
// if one is null and the other is undefined return false
// if both are equal return true
export function isEqualDates(
  prevDate: Date | null | undefined,
  postDate: Date | null | undefined,
): boolean {
  if (prevDate === null && postDate === null) return true; // both null
  if (prevDate === undefined && postDate === undefined) return true; // both undefined
  if (prevDate === null || postDate === null) return false; // one is null
  if (prevDate === undefined || postDate === undefined) return false; // one is undefined

  return isEqual(prevDate, postDate);
}
