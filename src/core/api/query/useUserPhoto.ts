import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';

import { ensureGraphToken } from '@/core/auth';

import { getUserPhoto } from '../services/getUserPhoto';
/**
 * Custom React hook to send feedback to the Feedback Hub API.
 *
 * This hook uses MSAL for authentication and React Query's {@link useMutation}
 * to handle the mutation logic.
 *
 * @returns {ReturnType<typeof useMutation>} The mutation object from React Query.
 *
 * @example
 * const mutation = useSendFeedbackHubMutation();
 * mutation.mutate({ message: 'Feedback message', ...otherParams });
 *
 * @see {@link sendFeedbackHub}
 * @see {@link SendFeedbackHubParams}
 * @see {@link useMsal}
 * @see {@link useMutation}
 *
 * @module useSendFeedbackHubMutation
 */
const useUserPhoto = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance: msalInstance } = useMsal();

  const query = useQuery({
    queryKey: ['userPhoto'],
    queryFn: async () => {
      await ensureGraphToken(msalInstance);

      return getUserPhoto();
    },
    enabled: isAuthenticated,
    retry: false,
  });

  return { ...query };
};

export default useUserPhoto;
