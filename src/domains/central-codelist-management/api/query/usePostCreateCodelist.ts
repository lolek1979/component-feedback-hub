import { useMutation } from '@tanstack/react-query';

import { postNewCodeList } from '../services';

export const usePostCreateCodelist = () => {
  return useMutation({
    mutationFn: postNewCodeList,
  });
};
