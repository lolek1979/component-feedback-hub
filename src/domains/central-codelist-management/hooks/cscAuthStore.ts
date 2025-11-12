import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { Garants } from '../api/services/getDraftsById';
import { CSCAuthStore } from './cscAuthTypes';

type CSCAuthData = {
  isEditAuth: boolean;
  isPublisherAuth: boolean;
  isGarant: boolean;
  isEditor: boolean;
  isLoading: boolean;
  isError: boolean;
};

const isEditAuthorized = (
  editors: Array<Garants>,
  garants: Array<Garants>,
  currentUserMail?: string,
): boolean => {
  return (
    editors.some((editor) => editor.mail === currentUserMail) ||
    garants.some((garant) => garant.mail === currentUserMail)
  );
};

const isPublisherAuthorized = (garants: Array<Garants>, currentUserMail?: string): boolean => {
  return garants.some((garant) => garant.mail === currentUserMail);
};

const initialState = {
  currentUserEmail: undefined,
  codeListId: undefined,
  status: undefined,
  garants: [],
  editors: [],
  isLoading: false,
  isError: false,
  isEditAuth: false,
  isPublisherAuth: false,
  isGarant: false,
  isEditor: false,
};

export const useCSCAuthStore = create<CSCAuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentUser: (email: string) => {
        set({ currentUserEmail: email });
        get().computeAuth();
      },

      setCodeListData: (codeListId: string, status?: string) => {
        set({ codeListId, status });
        get().computeAuth();
      },

      setGarantsAndEditors: (garants, editors) => {
        set({ garants, editors, isLoading: false, isError: false });
        get().computeAuth();
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (isError: boolean) => {
        set({ isError, isLoading: false });
      },

      reset: () => {
        set(initialState);
      },

      computeAuth: () => {
        const { currentUserEmail, garants, editors, status } = get();

        if (!currentUserEmail || !status) {
          set({
            isEditAuth: false,
            isPublisherAuth: false,
            isGarant: false,
            isEditor: false,
          });

          return;
        }

        const isEditAuth = isEditAuthorized(editors, garants, currentUserEmail);
        const isPublisherAuth = isPublisherAuthorized(garants, currentUserEmail);

        const isGarant = garants.some((garant) => garant.mail === currentUserEmail);
        const isEditor = editors.some((editor) => editor.mail === currentUserEmail);

        set({ isEditAuth, isPublisherAuth, isGarant, isEditor });
      },
    }),
    {
      name: 'csc-auth-store',
    },
  ),
);

export const getCSCAuthData = (): CSCAuthData => {
  const { isEditAuth, isPublisherAuth, isGarant, isEditor, isLoading, isError } =
    useCSCAuthStore.getState();

  return { isEditAuth, isPublisherAuth, isGarant, isEditor, isLoading, isError };
};

export const setCSCAuthData = (
  codeListId: string,
  status: string,
  currentUserEmail: string,
  garants: Array<Garants>,
  editors: Array<Garants>,
): void => {
  const store = useCSCAuthStore.getState();
  store.setCodeListData(codeListId, status);
  store.setCurrentUser(currentUserEmail);
  store.setGarantsAndEditors(garants, editors);
};
