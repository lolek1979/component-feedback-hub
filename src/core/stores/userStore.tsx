import { create } from 'zustand';

interface MsalUser {
  name?: string;
  username?: string;
  email?: string;
  tenantId?: string;
  objectId?: string;
  idTokenClaims?: Record<string, any>;
}

interface UserStore {
  account: MsalUser | null;
  setAccount: (account: MsalUser) => void;
  clearAccount: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
  clearAccount: () => set({ account: null }),
}));
