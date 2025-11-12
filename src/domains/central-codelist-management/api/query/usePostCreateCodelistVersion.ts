import { useMutation } from '@tanstack/react-query';

import { postCreateCodelistVersion } from '../services';

export const usePostCreateCodelistVersion = () => {
  return useMutation({
    mutationFn: postCreateCodelistVersion,
  });
};
