import { useMutation } from '@tanstack/react-query';

import {
  postImportCodeList,
  PostImportCodeListParams,
  PostImportCodeListResponse,
} from '../services';

export const usePostImportCodelist = () => {
  return useMutation<PostImportCodeListResponse | null, Error, PostImportCodeListParams>({
    mutationFn: postImportCodeList,
  });
};
