import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import { BaseRequestTab } from './BaseRequestTab';

interface PendingApprovalsTabProps {
  requestsRecord: RequestDetailModel[];
  isLoading: boolean;
}
export const PendingApprovalsTab = ({ requestsRecord, isLoading }: PendingApprovalsTabProps) => {
  return (
    <BaseRequestTab
      requestsRecord={requestsRecord}
      isLoading={isLoading}
      tabKey={'approver-tab-pending-approvals'}
      inReview
    />
  );
};
