import { useTranslations } from 'next-intl';

import Iinfo from '@/core/assets/icons/info.svg';
import {
  InlineMessage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/design-system/molecules';
import { ApprovalHistoryItem } from '@/domains/electronic-requests/api/services/types';
import { getBadgeColor } from '@/domains/electronic-requests/utils';

import styles from '../../RequestTabsContainer.module.css';

import { formatDateWithDots } from '@/core';
import { Avatar, Badge, Text } from '@/design-system';

interface ApprovalHistoryProps {
  displayedRecords: ApprovalHistoryItem[];
  itemsCount: number;
}

export const mapStatusToBadge = (status: string, tStatus: (key: string) => string) => {
  switch (status) {
    case 'Pending':
      return tStatus('pending');
    case 'Approved':
      return tStatus('approved');
    case 'Withdrawn':
      return tStatus('withdrawn');
    case 'Returned':
      return tStatus('completed');
    case 'Rejected':
      return tStatus('returned');
    default:
      return tStatus('pending');
  }
};

export const ApprovalHistoryTab = ({ displayedRecords, itemsCount }: ApprovalHistoryProps) => {
  const t = useTranslations('requests.requestDetail.tabs.approval');
  const tStatus = useTranslations('requests.requestDetail.tabs.approval.status');

  return (
    <div>
      {displayedRecords.length === 0 ? (
        <InlineMessage
          id="inline-message-empty-requests"
          icon={<Iinfo id="icon-table-inline-empty-requests" width={20} height={20} />}
          centeredText
          message={t('noDataMessage')}
        />
      ) : (
        <div>
          <Table className={styles.table}>
            <TableHead className={styles.tableHeader}>
              <TableRow>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('level')}
                  </Text>
                </TableCell>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('approver')}
                  </Text>
                </TableCell>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('performedBy')}
                  </Text>
                </TableCell>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('receivedAt')}
                  </Text>
                </TableCell>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('resolvedAt')}
                  </Text>
                </TableCell>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('itemsToApprove')}
                  </Text>
                </TableCell>
                <TableCell isHeader>
                  <Text variant="subtitle" regular>
                    {t('resolution')}
                  </Text>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody className={styles.tableBody}>
              {displayedRecords.map((historyItem) => {
                const approverFullName = historyItem.approver
                  ? `${historyItem.approver.givenName} ${historyItem.approver.surname}`
                  : '-';
                const resolvedByFullName = historyItem.resolvedBy
                  ? `${historyItem.resolvedBy.givenName} ${historyItem.resolvedBy.surname}`
                  : '-';

                return (
                  <TableRow key={historyItem.level} className={styles.tableRow}>
                    <TableCell>
                      <Text variant="caption">{historyItem.level}.</Text>
                    </TableCell>
                    <TableCell>
                      <div className={styles.userCell}>
                        {approverFullName !== '-' && (
                          <Avatar name={approverFullName} className={styles.avatar} />
                        )}
                        <Text variant="caption">{approverFullName}</Text>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.userCell}>
                        {resolvedByFullName !== '-' && (
                          <Avatar name={resolvedByFullName} className={styles.avatar} />
                        )}
                        <Text variant="caption">{resolvedByFullName}</Text>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text variant="caption">
                        {formatDateWithDots(new Date(historyItem.receivedAtUtc))}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text variant="caption">
                        {historyItem.resolvedAtUtc
                          ? formatDateWithDots(new Date(historyItem.resolvedAtUtc))
                          : '-'}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <div className={styles.itemsCountCell}>
                        <Badge color={'gray'}>
                          <Text variant="caption">{itemsCount}</Text>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color={getBadgeColor(historyItem.resolution)}>
                        <Text variant="caption">
                          {mapStatusToBadge(historyItem.resolution, tStatus)}
                        </Text>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
