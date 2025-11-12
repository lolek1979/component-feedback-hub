import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { clearImpersonation } from '../../services/Impersonate/clearImpersonation';

export const useClearImpersonation = () => {
  return useMutation<AxiosResponse<void>, Error, void>({
    mutationFn: () => clearImpersonation(),
    onSuccess: () => {
      window.location.reload();
    },
  });
};
