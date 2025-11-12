import { useMsal } from '@azure/msal-react';
import { useMutation } from '@tanstack/react-query';

import { sendFeedbackHub, SendFeedbackHubParams } from '../services';
/**
 * Custom React hook to send feedback to the Feedback Hub API.
 *
 * This hook uses MSAL for authentication and React Query's `useMutation`
 * to handle the mutation logic.
 *
 * @returns {ReturnType<typeof useMutation>} The mutation object from React Query.
 *
 * @example
 * const mutation = useSendFeedbackHubMutation();
 * mutation.mutate({ message: 'Feedback message', ...otherParams });
 */
export const useSendFeedbackHubMutation = () => {
  const { instance: msalInstance } = useMsal();

  return useMutation({
    mutationFn: (params: SendFeedbackHubParams) => {
      return sendFeedbackHub(params, msalInstance);
    },
  });
};
