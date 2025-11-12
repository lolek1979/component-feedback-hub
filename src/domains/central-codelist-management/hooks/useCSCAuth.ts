import { useEffect } from 'react';
import { useAccount, useMsal } from '@azure/msal-react';

import { codeListStatus } from '@/core/lib';

import useCodeListsById from '../api/query/useCodeListById';
import useDraftsById from '../api/query/useDraftsById';
import { useCSCAuthStore } from './cscAuthStore';

const useCSCAuth = (codeListId: string, status?: string) => {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const {
    isEditAuth,
    isPublisherAuth,
    isGarant,
    isEditor,
    isLoading: storeLoading,
    setCurrentUser,
    setCodeListData,
    setGarantsAndEditors,
    setLoading,
    setError,
    reset,
  } = useCSCAuthStore();

  const isConcept =
    status?.toLowerCase() === codeListStatus.concept ||
    status?.toLowerCase() === codeListStatus.approval ||
    status?.toLowerCase() === codeListStatus.rejected;

  const isCodelist =
    status?.toLowerCase() === codeListStatus.active ||
    status?.toLowerCase() === codeListStatus.planned ||
    status?.toLowerCase() === codeListStatus.expired;

  const draftsQuery = useDraftsById({ id: codeListId, isConcept: isConcept });
  const codeListsQuery = useCodeListsById({ id: codeListId, isCodelist: isCodelist });

  const apiLoading = isConcept ? draftsQuery.isLoading : codeListsQuery.isLoading;
  const codeData = isConcept ? draftsQuery.data : codeListsQuery.data;
  const apiError = isConcept ? draftsQuery.isError : codeListsQuery.isError;

  useEffect(() => {
    if (codeListId && status) {
      setCodeListData(codeListId, status);
    }
  }, [codeListId, status, setCodeListData]);

  useEffect(() => {
    if (account?.username) {
      setCurrentUser(account.username);
    }
  }, [account?.username, setCurrentUser]);

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading, setLoading]);

  useEffect(() => {
    if (apiError) {
      setError(true);
    }
  }, [apiError, setError]);

  useEffect(() => {
    if (codeData && !apiLoading && !apiError) {
      const hasPayload = codeData && 'payload' in codeData;
      const { editors = [], garants = [] } = hasPayload
        ? (codeData.payload ?? {})
        : (codeData ?? {});

      setGarantsAndEditors(garants, editors);
    }
  }, [codeData, apiLoading, apiError, setGarantsAndEditors]);

  useEffect(() => {
    return () => {
      if (!codeListId) {
        reset();
      }
    };
  }, [codeListId, reset]);

  const isLoading = apiLoading || storeLoading;

  return {
    isEditAuth,
    isPublisherAuth,
    isGarant,
    isEditor,
    isLoading,
    isError: apiError,
  };
};

export default useCSCAuth;
