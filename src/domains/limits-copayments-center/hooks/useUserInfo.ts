import { useUserInfoStore } from '../stores';

/**
 * Hook for accessing user information in limits-copayments domain.
 *
 * @returns Object containing user info and store management functions
 */
export const useUserInfo = () => {
  const { userInfo, setUserInfo, resetStates: clearUserInfo } = useUserInfoStore();

  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
    hasUserInfo: !!userInfo?.userData.insuranceNumber,
    userName: `${userInfo?.userData?.firstName ?? '-'} ${userInfo?.userData?.lastName ?? '-'}`,
    insuranceNumber: userInfo?.userData.insuranceNumber,
    limit: userInfo?.limit,
    hasToPayTotal: userInfo?.hasToPayTotal,
    dayLimitReached: userInfo?.dayLimitReached,
  };
};
