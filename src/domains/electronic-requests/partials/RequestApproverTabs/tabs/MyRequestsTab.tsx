import React, { useMemo } from 'react';

import { useRequests } from '@/domains/electronic-requests/api/query';
import { useRequestsUserRoles } from '@/domains/electronic-requests/hooks/useRequestsUserRoles';

import { BaseRequestTab } from './BaseRequestTab';

export const MyRequestsTab = () => {
  const { roles } = useRequestsUserRoles();
  const isApprover = roles.isApprover;

  const { data: requestsResponse, isLoading } = useRequests({
    enabled: true,
    role: isApprover ? 'approver' : 'requester',
    take: 10000,
    skip: 0,
  });

  const requestsRecord = useMemo(() => requestsResponse?.payload?.items ?? [], [requestsResponse]);

  return (
    <BaseRequestTab
      requestsRecord={requestsRecord}
      isLoading={isLoading}
      tabKey={'approver-tab-my-requests'}
    />
  );
};
