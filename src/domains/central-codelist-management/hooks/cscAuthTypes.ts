import { Garants } from '../api/services/getDraftsById';

export interface CSCAuthState {
  currentUserEmail?: string;
  codeListId?: string;
  status?: string;

  garants: Array<Garants>;
  editors: Array<Garants>;

  isLoading: boolean;
  isError: boolean;

  isEditAuth: boolean;
  isPublisherAuth: boolean;

  isGarant: boolean;
  isEditor: boolean;
}

export interface CSCAuthActions {
  setCurrentUser: (email: string) => void;
  setCodeListData: (codeListId: string, status?: string) => void;
  setGarantsAndEditors: (garants: Array<Garants>, editors: Array<Garants>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (isError: boolean) => void;
  reset: () => void;
  computeAuth: () => void;
}

export interface CSCAuthStore extends CSCAuthState, CSCAuthActions {}

export interface CSCData {
  garants: Array<Garants>;
  editors: Array<Garants>;
}
