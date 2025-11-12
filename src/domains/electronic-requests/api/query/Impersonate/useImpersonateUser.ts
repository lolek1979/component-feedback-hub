import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { impersonateUser, UserRole } from '../../services/Impersonate/impersonateUser';

export const useImpersonateUser = () => {
  return useMutation<AxiosResponse<void> | null, Error, UserRole>({
    mutationFn: (id: UserRole) => impersonateUser(id),
    onSuccess: () => {
      window.location.reload();
    },
  });
};
