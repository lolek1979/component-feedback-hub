import { useMutation } from '@tanstack/react-query';

import { postImportCodelistVersion } from '../services';

export const usePostImportCodelistVersion = () => {
  return useMutation({
    mutationFn: postImportCodelistVersion,
  });
};
