import { useRequestsUsers } from '../api/query';

export const useRequestsUserRoles = () => {
  const { data: userData, isLoading: isLoadingUser, isError } = useRequestsUsers({});

  const roles = {
    isAdmin: !!userData?.payload,
    isApprover: !!userData?.payload.isApprover,
    isBudgetManager: !!userData?.payload.isBudgetManager,
    isCatalogueManager: !!userData?.payload.isCatalogueManager,
    isPurchaser: !!userData?.payload.isPurchaser,
  };

  return {
    roles,
    isLoadingUser,
    isError,
    userId: userData?.payload.id,
    fullUser: userData,
  };
};
