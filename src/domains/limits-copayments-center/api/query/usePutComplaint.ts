import { useMsal } from '@azure/msal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { putComplaint } from '../services/putComplaint';
import { ComplaintUpdateRequest } from '../services/types';

const usePutComplaint = () => {
  const { instance: msalInstance } = useMsal();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ComplaintUpdateRequest) => {
      await ensureAccessToken(msalInstance);
      const result = await putComplaint(data);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
    },
  });

  return mutation;
};

export default usePutComplaint;
