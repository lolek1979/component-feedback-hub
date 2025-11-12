import { useQuery } from '@tanstack/react-query';

import { getContractById } from '../../services/Contracts/getContractById';

type UseContractByIdOptions = {
  contractId: string;
  enabled?: boolean;
};

export const useContractById = ({ contractId, enabled = true }: UseContractByIdOptions) => {
  return useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => getContractById(contractId),
    enabled: enabled && !!contractId,
  });
};
