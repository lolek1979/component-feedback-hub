import { useMutation } from '@tanstack/react-query';

import {
  postComparison,
  PostComparisonParams,
  PostComparisonResponse,
} from '@/domains/pdf-comparison/api/services/postComparison';

export const usePostComparison = () => {
  return useMutation<PostComparisonResponse, Error, PostComparisonParams>({
    mutationFn: (params) => postComparison(params),
  });
};
