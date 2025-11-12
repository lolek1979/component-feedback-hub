import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { BankAccount, Payload } from '../api/services/getInsuredDetail';

export interface UserInfo {
  userData: Payload;
  limit?: number;
  hasToPayTotal?: number | null;
  dayLimitReached?: string;
}

interface UserInfoStore {
  userInfo: UserInfo | null;
  insuranceNum: string;
  applicant: string;
  setInsuranceNum: (ssn: string) => void;
  setApplicant: (name: string) => void;
  setUserInfo: (info: UserInfo) => void;
  setBankInfo: (bankInfo: BankAccount) => void;
  resetStates: () => void;
}

/**
 *
 * @remarks
 * This store persists user data (name, insurance number, limit info) between tabs
 * to support the upcoming dual-tab functionality for claims/complaints.
 *
 * @returns
 * - `userInfo`: Current user information or null
 * - `setUserInfo(info)`: Sets user information
 * - `clearUserInfo()`: Clears stored user information
 */
export const useUserInfoStore = create<UserInfoStore>()(
  persist(
    (set) => ({
      userInfo: null,
      insuranceNum: '',
      applicant: '',
      setUserInfo: (info: UserInfo) =>
        set(() => ({
          userInfo: info,
        })),

      setBankInfo: (bankInfo: BankAccount) =>
        set((state) => {
          if (!state.userInfo) return {};

          return {
            userInfo: {
              ...state.userInfo,
              userData: {
                ...state.userInfo.userData,
                bankAccounts: [bankInfo],
              },
            },
          };
        }),

      setInsuranceNum: (num) =>
        set(() => ({
          insuranceNum: num,
        })),

      setApplicant: (name) =>
        set(() => ({
          applicant: name,
        })),

      resetStates: () =>
        set(() => ({
          userInfo: null,
          insuranceNum: '',
          applicant: '',
        })),
    }),
    {
      name: 'limits-copayments-user-info',
    },
  ),
);
