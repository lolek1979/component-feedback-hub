import { useMsal } from '@azure/msal-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ensureAccessToken } from '@/core/auth/tokenFetcher';

import { postComplaint } from '../services/postComplaint';
import { ComplaintCreateRequest } from '../services/types';

const usePostComplaint = () => {
  const { instance: msalInstance } = useMsal();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ComplaintCreateRequest) => {
      await ensureAccessToken(msalInstance);
      const result = await postComplaint(data);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
    },
  });

  return mutation;
};

export default usePostComplaint;
