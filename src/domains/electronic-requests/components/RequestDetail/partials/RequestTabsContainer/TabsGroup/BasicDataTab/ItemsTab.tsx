import { useTranslations } from 'next-intl';
import {
  RequestItemsTable,
  RequestItemsTableProps,
} from 'src/domains/electronic-requests/partials/RequestItemsTable/RequestItemsTable';

import Iinfo from '@/core/assets/icons/info.svg';
import { InlineMessage, Typography } from '@/design-system/molecules';
import { WFState } from '@/domains/electronic-requests/api/services/types';

interface ItemsTabProps extends RequestItemsTableProps {
  recipientId: string;
  approver: string;
  wfStatus: WFState;
  sortColumn?: string;
}

export const ItemsTab = ({
  displayedRecords,
  approver,
  isLoading,
  sortDirection,
  sortColumn,
  recipientId,
  handleSort,
  totalCount,
  pageSize,
  currentPage,
  handlePageChange,
  handlePageSizeChange,
  requestId,
  wfStatus,
}: ItemsTabProps) => {
  const t = useTranslations('requests.requestDetail.tabs.items');

  return displayedRecords.length === 0 ? (
    <InlineMessage
      id="inline-message-empty-items"
      icon={<Iinfo id="icon-table-inline-empty-items" width={20} height={20} />}
      centeredText
    >
      <Typography variant="Subtitle/Default/Bold"> {t('emptyItemsMessage')}</Typography>
    </InlineMessage>
  ) : (
    <div>
      <RequestItemsTable
        displayedRecords={displayedRecords}
        approver={approver}
        recipientId={recipientId}
        isLoading={isLoading}
        sortDirection={sortDirection}
        sortColumn={sortColumn}
        handleSort={handleSort}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        requestId={requestId}
        wfStatus={wfStatus}
      />
    </div>
  );
};
