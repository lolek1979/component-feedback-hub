import { axiosInstanceGraph } from '../axiosInstance';

/**
 * Represents a user fetched from Microsoft Graph API.
 */
interface FetchedUser {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
}

/**
 * Represents the result of fetching users from Microsoft Graph API.
 */
interface FetchedUserResult {
  '@odata.context': string;
  '@odata.count': number;
  '@odata.nextLink': string;
  value: FetchedUser[];
}

/**
 * Checks if a string is a valid GUID.
 *
 * @param value - The string to validate.
 * @returns `true` if the string is a valid GUID, otherwise `false`.
 */
function isValidGuid(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    value,
  );
}

/**
 * Fetches users from Microsoft Graph API based on a name query or GUID.
 * Handles pagination using the `nextLink` parameter.
 *
 * @param query - The search query (name or GUID).
 * @param nextLink - The next page link for pagination, if available.
 * @returns A promise that resolves to a {@link FetchedUserResult} or `null` if an error occurs.
 *
 * @example
 * const users = await fetchAllUsers('John', null);
 *
 * @see {@link FetchedUser}
 * @see {@link FetchedUserResult}
 */
export const fetchAllUsers = async (
  query: string,
  nextLink: string | null,
): Promise<FetchedUserResult | null> => {
  const PAGE_SIZE = 10;
  const baseURL = `/users?`;
  const queryParams = `$orderby=displayName&$top=${PAGE_SIZE}&$count=true&`;
  const selectParams = `$select=id,displayName,givenName,surname&`;
  let filterParams;
  if (isValidGuid(query)) {
    //search based on ID
    filterParams = `$filter=id eq '${encodeURIComponent(query)}'&`;
  } else {
    filterParams =
      query === '' || query == null
        ? ''
        : `$filter=startswith(givenName,'${encodeURIComponent(query)}') or startswith(surname,'${encodeURIComponent(query)}')&`;
  }

  try {
    const url = nextLink || baseURL + queryParams + selectParams + filterParams;
    const userResult = await axiosInstanceGraph.get<FetchedUserResult>(url, {
      //useQuery
      headers: {
        ConsistencyLevel: 'eventual',
      },
    });

    if (!userResult?.data) return null;

    return userResult.data;
  } catch (error) {
    console.error('Error fetching users:', error);

    return null;
  }
};
