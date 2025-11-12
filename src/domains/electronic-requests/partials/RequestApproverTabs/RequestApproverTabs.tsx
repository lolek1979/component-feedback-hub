'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Badge, Text } from '@/design-system/atoms';
import { TabProps } from '@/design-system/atoms/Tab';
import { TabGroup } from '@/design-system/molecules';

import { useRequests } from '../../api/query';
import { TabContentProps } from '../../components/RequestDetail/partials/RequestTabsContainer/RequestTabsContainer';
import { useRequestsUserRoles } from '../../hooks/useRequestsUserRoles';
import { MyRequestsTab } from './tabs/MyRequestsTab';
import { PendingApprovalsTab } from './tabs/PendingApprovalsTab';
import styles from './RequestApproverTabs.module.css';

interface RequestApproverTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const TabContent = ({ icon: Icon, text, count, selected }: TabContentProps) => (
  <div className={styles.tabPendingApprovals}>
    {Icon && <Icon id="icon-tab-pending-approvals" className={`${styles.tabIcon}`} />}
    <Text variant="subtitle" regular={!selected} className={styles.text} selectable={false}>
      {text}
    </Text>
    {count !== undefined && (
      <Badge id={`badge-pending-approvals-tab-${text}`} color={count === 0 ? 'gray' : 'red'}>
        {count}
      </Badge>
    )}
  </div>
);

export const RequestApproverTabs = ({ selectedTab, setSelectedTab }: RequestApproverTabsProps) => {
  const t = useTranslations('requests.approver.tabs');
  const { roles } = useRequestsUserRoles();
  const isApprover = roles.isApprover;

  const { data: requestsResponse, isLoading } = useRequests({
    enabled: true,
    role: isApprover ? 'approver' : 'requester',
    stateFilter: [
      'PendingApprove1',
      'PendingApprove2',
      'PendingApprove3',
      'PendingApprove4',
      'PendingApprove5',
    ],
    take: 10000,
    skip: 0,
  });

  const requestsRecord = useMemo(() => requestsResponse?.payload?.items ?? [], [requestsResponse]);
  const requestsCount = requestsRecord.length;

  const tabs = useMemo(
    () => [
      {
        id: 'tab-approver-my-requests',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('myRequests.name')} selected={selected} disabled={disabled} />
        ),
      },
      {
        id: 'tab-approver-pending-approvals',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent
            count={requestsCount}
            text={t('pendingApproval.name')}
            selected={selected}
            disabled={disabled}
          />
        ),
      },
    ],
    [requestsCount, t],
  );

  return (
    <div className={styles.tabsWrapper}>
      <TabGroup tabs={tabs} setSelectedTab={setSelectedTab} selectedTab={selectedTab}>
        <MyRequestsTab />
        <PendingApprovalsTab requestsRecord={requestsRecord} isLoading={isLoading} />
      </TabGroup>
    </div>
  );
};
