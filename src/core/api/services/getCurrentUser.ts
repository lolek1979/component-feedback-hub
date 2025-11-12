import { axiosInstanceGraph } from '../axiosInstance';

/**
 * Represents the current user fetched from Microsoft Graph API.
 */
interface CurrentUser {
  id: string;
  displayName: string;
  mail: string;
  mobilePhone: string;
  givenName: string;
  surname: string;
  jobTitle?: string;
  officeLocation?: string;
  businessPhones?: string[];
}

/**
 * Fetches the current user from Microsoft Graph API using the provided email.
 * Attempts to find the user by filtering on the email field, and falls back to direct lookup if not found.
 *
 * @param email - The email address of the user to fetch.
 * @returns A promise that resolves to a {@link CurrentUser} object or `null` if not found or on error.
 *
 * @example
 * const user = await fetchCurrentUser('user@example.com');
 *
 * @see {@link CurrentUser}
 */
export const fetchCurrentUser = async (email: string): Promise<CurrentUser | null> => {
  try {
    const searchResponse = await axiosInstanceGraph.get<{ value: CurrentUser[] }>(
      `https://graph.microsoft.com/v1.0/users?$filter=mail eq '${email}'&$select=id,displayName,mail,mobilePhone,givenName,surname,jobTitle,officeLocation,businessPhones`,
    );

    if (searchResponse.data.value && searchResponse.data.value.length > 0) {
      return searchResponse.data.value[0];
    }

    const userResponse = await axiosInstanceGraph.get<CurrentUser>(
      `https://graph.microsoft.com/v1.0/users/${email}?$select=id,displayName,mail,mobilePhone,givenName,surname,jobTitle,officeLocation,businessPhones`,
    );

    if (userResponse.data) {
      return userResponse.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);

    return null;
  }
};
