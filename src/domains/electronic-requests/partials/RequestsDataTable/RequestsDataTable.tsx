import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { IChat } from '@/core/assets/icons';
import { formatDateWithDots } from '@/core/auth/utils';
import { getNextSortDirection } from '@/core/utils/table';
import { SortDirection } from '@/core/utils/types';
import { AppLink, Badge, Tooltip } from '@/design-system/atoms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@/design-system/molecules';
import DataTableSkeleton from '@/design-system/organisms/DataTableSkeleton/DataTableSkeleton';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import { formatWorkflowState, getBadgeColor } from '../../utils';
import { EmptyCell } from '../RequestItemsTable/partials/Table/EmptyCell';
import styles from './RequestsDataTable.module.css';

export const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

interface RequestsDataTableProps {
  displayedRecords: RequestDetailModel[];
  isLoading: boolean;
  sortDirection: SortDirection;
  handleSort: (column: string, newDirection: SortDirection) => void;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (value: string) => void;
  inReview?: boolean;
}

export const mapStatusToBadge = (status: string, tStatus: (key: string) => string) => {
  switch (status) {
    case 'Draft':
      return tStatus('new');
    case 'PendingApprove':
    case 'PendingApprove1':
    case 'PendingApprove2':
      return tStatus('inReview');
    case 'Withdrawn':
      return tStatus('withdrawn');
    case 'Completed':
      return tStatus('completed');
    case 'Closed':
      return tStatus('completed');
    case 'Rejected':
      return tStatus('rejected');
    default:
      return tStatus('new');
  }
};

export const mapBadgeColorToTextColor = (badgeColor: string) => {
  switch (badgeColor) {
    case 'lightBlue':
      return 'info';
    case 'lightGreen':
      return 'positive';
    case 'lightRed':
      return 'negative';
    case 'lightOrange':
      return 'warning';
    default:
      return undefined;
  }
};

export const RequestsDataTable = ({
  displayedRecords,
  isLoading,
  sortDirection,
  handleSort,
  totalCount,
  pageSize,
  currentPage,
  handlePageChange,
  handlePageSizeChange,
  inReview = false,
}: RequestsDataTableProps) => {
  const tRequests = useTranslations('requests.requestsTable');
  const tStatus = useTranslations('requests.filters.status');

  const renderIdCell = (record: RequestDetailModel) => (
    <AppLink
      link={`/e-zadanky/${record.id}?parent=${record.id}`}
      target="_self"
      variant="primary"
      id={`link-request-id-${record.id}`}
    >
      <Typography variant="Subtitle/Default/Bold">
        {record.requestNumber ?? tRequests('withoutID')}
      </Typography>
    </AppLink>
  );

  useEffect(() => {
    handleSort('createdAt', 'desc');
  }, [handleSort]);

  return (
    <>
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <div className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead className={styles.tableHeader}>
              <TableRow>
                <TableCell
                  isHeader
                  isSort
                  onClick={() => handleSort('id', getNextSortDirection(sortDirection))}
                >
                  <Typography variant="Subtitle/Default/Regular">{tRequests('id')}</Typography>
                </TableCell>
                <TableCell isHeader>
                  <Typography variant="Subtitle/Default/Regular">{tRequests('items')}</Typography>
                </TableCell>
                {inReview && (
                  <TableCell isHeader>
                    <Typography variant="Subtitle/Default/Regular">
                      {tRequests('justification')}
                    </Typography>
                  </TableCell>
                )}
                <TableCell isHeader>
                  <Typography variant="Subtitle/Default/Regular">
                    {tRequests('requester')}
                  </Typography>
                </TableCell>
                <TableCell isHeader>
                  <Typography variant="Subtitle/Default/Regular">
                    {tRequests('recipient')}
                  </Typography>
                </TableCell>
                {!inReview && (
                  <TableCell isHeader>
                    <Typography variant="Subtitle/Default/Regular">
                      {tRequests('approver')}
                    </Typography>
                  </TableCell>
                )}
                <TableCell
                  isHeader
                  isSort
                  onClick={() =>
                    handleSort('costCenter', sortDirection === 'desc' ? 'asc' : 'desc')
                  }
                >
                  <Typography variant="Subtitle/Default/Regular">
                    {tRequests('costCenter')}
                  </Typography>
                </TableCell>
                <TableCell
                  isHeader
                  isSort
                  onClick={() => handleSort('createdAt', sortDirection === 'desc' ? 'asc' : 'desc')}
                >
                  <Typography variant="Subtitle/Default/Regular">
                    {tRequests('createdAt')}
                  </Typography>
                </TableCell>
                <TableCell isHeader>
                  <Typography variant="Subtitle/Default/Regular">{tRequests('status')}</Typography>
                </TableCell>
                <TableCell isHeader></TableCell>
              </TableRow>
            </TableHead>

            <TableBody className={styles.tableBody}>
              {displayedRecords.map((request, index) => {
                const requesterFullName = `${request.createdBy.givenName} ${request.createdBy.surname}`;
                const recipientFullName = `${request.recipient.givenName} ${request.recipient.surname}`;
                const approverFullName = request.approver?.givenName && request.approver?.surname;

                const mappedStatus = mapStatusToBadge(
                  formatWorkflowState(request.wfState),
                  tStatus,
                );
                const badgeColor = getBadgeColor(request.wfState);

                return (
                  <TableRow key={`${request.id}-${index}`} className={styles.tableRow}>
                    <TableCell>{renderIdCell(request)}</TableCell>
                    <TableCell>
                      {request.items && request.items.length > 0 ? (
                        <Tooltip
                          variant="inverse"
                          placement="tooltipBottom"
                          content={
                            <>
                              {request.items.slice(0, 5).map((item) => (
                                <div key={item.id}>
                                  <Typography variant="Caption/Regular">
                                    {item.description}
                                  </Typography>
                                </div>
                              ))}
                              {request.items.length > 5 && (
                                <div>
                                  <Typography variant="Caption/Regular">
                                    {tRequests('moreItems', { count: request.items.length - 5 })}
                                  </Typography>
                                </div>
                              )}
                            </>
                          }
                          id="tooltip-csc-header-save-button"
                        >
                          <Badge id="request-items-count">
                            <Typography variant="Caption/Regular">
                              {request.items.length}
                            </Typography>
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Badge id="request-no-items">
                          <Typography variant="Caption/Regular">{request.items?.length}</Typography>
                        </Badge>
                      )}
                    </TableCell>
                    {inReview && (
                      <TableCell>
                        <Tooltip
                          variant="inverse"
                          placement="tooltipTop"
                          id={`request-justification-${request.id}`}
                          content={
                            <Typography variant="Caption/Regular">
                              {request.justification ?? request.justification}
                            </Typography>
                          }
                        >
                          <IChat
                            id={`request-justification-${request.id}`}
                            width={24}
                            height={24}
                          ></IChat>
                        </Tooltip>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className={styles.userCell}>
                        <Typography variant="Subtitle/Default/Link-dotted-regular">
                          {requesterFullName}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.userCell}>
                        <Typography variant="Subtitle/Default/Link-dotted-regular">
                          {recipientFullName}
                        </Typography>
                      </div>
                    </TableCell>
                    {!inReview && (
                      <TableCell>
                        <div className={styles.userCell}>
                          {approverFullName && approverFullName?.trim() !== '' ? (
                            <Typography variant="Subtitle/Default/Link-dotted-regular">
                              {approverFullName}
                            </Typography>
                          ) : (
                            <EmptyCell />
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="Subtitle/Default/Link-dotted-regular">
                        {request.costCenter.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="Caption/Regular">
                        {formatDateWithDots(new Date(request.createdAtUtc))}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Badge color={badgeColor}>
                        <Typography variant="Caption/Bold">{mappedStatus}</Typography>
                      </Badge>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TableFooter
            selectItems={PAGE_SIZE_OPTIONS}
            onSelectChange={handlePageSizeChange}
            onPageChange={handlePageChange}
            pageCount={Math.ceil(totalCount / pageSize) || 1}
            totalCount={totalCount}
            value={pageSize.toString()}
            currPage={currentPage + 1}
          />
        </div>
      )}
    </>
  );
};
