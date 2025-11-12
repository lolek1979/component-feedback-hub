import { axiosInstanceGraph } from '../axiosInstance';

/**
 * Represents a user fetched from Microsoft Graph API.
 */
interface FetchedUser {
  id: string;
  displayName: string;
  mail: string;
  mobilePhone: string;
  givenName: string;
  surname: string;
  jobsite?: string;
}

/**
 * Represents a user's role assignment values.
 */
interface UserRolesValues {
  appRoleId: string;
  createdDateTime: Date;
  deletedDateTime?: Date;
  id: string;
  principalDisplayName: string;
  principalId: string;
  principalType: string;
  resourceDisplayName: string;
  resourceId: string;
}

/**
 * Represents the result of fetching users from Microsoft Graph API.
 */
interface FetchedUserResult {
  '@odata.context': string;
  '@odata.count': number;
  value: FetchedUser[];
}

/**
 * Represents a single batch response for user roles.
 */
interface BatchResponse {
  id: string;
  status: number;
  body: {
    value: UserRolesValues[];
  };
}

/**
 * Represents the batch request response containing multiple batch responses.
 */
interface BatchRequestResponse {
  responses: BatchResponse[];
}

/**
 * Fetches users from Microsoft Graph API based on a name query and filters them by role.
 * Performs a batch request to retrieve user roles and filters users based on the provided role IDs.
 *
 * @param name - The display name to search for.
 * @param editor - If `true`, filters users by the editor role; otherwise, by the publisher role.
 * @param env - An object containing environment variables for role IDs.
 * @returns A promise that resolves to a {@link FetchedUserResult} containing filtered users, or `null` if an error occurs.
 *
 * @example
 * const users = await fetchUsers('John', true, { EDITOR_APP_ROLE_ID: '...', PUBLISHER_APP_ROLE_ID: '...' });
 *
 * @see {@link FetchedUser}
 * @see {@link UserRolesValues}
 * @see {@link FetchedUserResult}
 */
export const fetchUsers = async (
  name: string,
  editor: boolean,
  env: Record<string, string | undefined>,
): Promise<FetchedUserResult | null> => {
  const baseURL = 'https://graph.microsoft.com/v1.0/users?';
  const queryParams = `$count=true&$search="displayName:${name}"&$orderBy=displayName&`;
  const selectParams = `$select=id,displayName,mail,mobilePhone,givenName,surname&$top=20`;
  try {
    const userResult = await axiosInstanceGraph.get<FetchedUserResult>(
      baseURL + queryParams + selectParams,
      { headers: { ConsistencyLevel: 'eventual' } },
    );

    if (!userResult?.data?.value) return null;

    const users = userResult.data.value;
    if (users.length === 0) return { ...userResult.data, value: [] };

    // Batch request na role
    const batchRequests = users.map((user, index) => ({
      id: `${index}`,
      method: 'GET',
      url: `/users/${user.id}/appRoleAssignments`,
    }));

    const batchResponse = await axiosInstanceGraph.post<BatchRequestResponse>(
      'https://graph.microsoft.com/v1.0/$batch',
      {
        requests: batchRequests,
      },
    );

    if (!batchResponse?.data?.responses) return null;

    const userRolesMap = batchResponse.data.responses.reduce<Record<string, UserRolesValues[]>>(
      (acc, response: BatchResponse) => {
        const userIndex = parseInt(response.id);
        const userId = users[userIndex].id;
        acc[userId] = response.body?.value || [];

        return acc;
      },
      {},
    );

    const filteredUsers = users.filter((user) => {
      const userRoles = userRolesMap[user.id] || [];
      //TODO: Update the user roles when the eZdanky roles are ready

      return userRoles.some(
        (role: { appRoleId: string }) =>
          role.appRoleId.trim().toLowerCase() ===
          (editor
            ? env.EDITOR_APP_ROLE_ID?.trim().toLowerCase() || ''
            : env.PUBLISHER_APP_ROLE_ID?.trim().toLowerCase() || ''),
      );
    });

    return { ...userResult.data, value: filteredUsers };
  } catch (error) {
    console.error('Error fetching users:', error);

    return null;
  }
};
