import { useMutation } from '@tanstack/react-query';

import {
  getComparison,
  GetComparisonParams,
  GetComparisonResponse,
} from './services/getComparison';

export const useGetComparison = () => {
  return useMutation<GetComparisonResponse, Error, GetComparisonParams>({
    mutationFn: (params) => getComparison(params),
  });
};
