'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { SortDirection } from '@/core/utils/types';
import { Badge, Button, Text } from '@/design-system/atoms';
import { TabProps } from '@/design-system/atoms/Tab';
import { TabGroup } from '@/design-system/molecules';
import { useRequestById } from '@/domains/electronic-requests/api/query';
import { PAGE_SIZE_OPTIONS } from '@/domains/electronic-requests/partials/RequestsDataTable/RequestsDataTable';

import { CatalogueItemModal } from './NewItemModals/CatalogueItemModal/CatalogueItemModal';
import { EmptyItemsModal } from './NewItemModals/EmptyItemsModal';
import { ApprovalHistoryTab } from './TabsGroup/ApprovalHistoryTab/ApprovalHistoryTab';
import { BasicDataTab } from './TabsGroup/BasicDataTab/BasicDataTab';
import { ItemsTab } from './TabsGroup/BasicDataTab/ItemsTab';
import { CommentsTab } from './TabsGroup/CommentsTab/CommentsTab';
import styles from './RequestTabsContainer.module.css';

export interface TabContentProps {
  icon?: React.FC<React.SVGProps<SVGElement>>;
  text: string;
  count?: number;
  selected?: boolean;
  disabled?: boolean;
}
interface RequestTabsContainerProps {
  selectedTab?: string;
  setSelectedTab?: (value: string) => void;
}

const TabContent = ({ icon: Icon, text, count, selected }: TabContentProps) => (
  <div className={styles.tabContent}>
    {Icon && <Icon id="icon-tab-content" className={`${styles.tabIcon}`} />}
    <Text variant="subtitle" regular={!selected} className={styles.text} selectable={false}>
      {text}
    </Text>
    {count !== undefined && <Badge id={`badge-items-tab-${text}`}>{count}</Badge>}
  </div>
);

export const RequestTabsContainer = ({
  setSelectedTab,
  selectedTab,
}: RequestTabsContainerProps) => {
  const t = useTranslations('requests.requestDetail.tabs');
  const pathname = usePathname();
  const requestDetailRegex = /^\/e-zadanky\/(.+)$/;
  const match = requestDetailRegex.exec(pathname);
  const requestId = match ? match[1] : null;

  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [sortColumn, setSortColumn] = useState<string>('title');

  const [pageSize, setPageSize] = useState(Number(PAGE_SIZE_OPTIONS[0].value));
  const [currentPage, setCurrentPage] = useState(0);
  const [isCatalogItemsModalVisible, setIsCatalogItemsModalVisible] = useState(false);
  const [isEmptyItemsModalVisible, setIsEmptyItemsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const { data: requestData, isLoading: isLoadingRequest } = useRequestById({
    id: requestId ?? '',
  });
  const itemsNumber = requestData?.items?.length ?? 0;
  const approver = requestData?.approver
    ? `${requestData.approver.givenName} ${requestData.approver.surname}`
    : null;
  const approveHistory = requestData?.approveHistory;

  const tabs = useMemo(
    () => [
      {
        id: 'tab-request-tabs-container-items',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent
            text={t('items.title')}
            count={itemsNumber}
            selected={selected}
            disabled={disabled}
          />
        ),
      },
      {
        id: 'tab-request-tabs-container-basic-data',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('basicInfo')} selected={selected} disabled={disabled} />
        ),
      },
      {
        id: 'tab-request-tabs-container-approval',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          <TabContent text={t('approval.title')} selected={selected} disabled={disabled} />
        ),
      },
      {
        id: 'tab-request-tabs-container-comments',
        disabled: false,
        value: ({ selected, disabled }: TabProps) => (
          //TODO: update count when comments are fetched
          <TabContent
            text={t('comments.title')}
            selected={selected}
            disabled={disabled}
            count={0}
          />
        ),
      },
    ],
    [t, itemsNumber],
  );

  const isItemsTabSelected = selectedTab === 'tab-request-tabs-container-items';

  const handleSort = useCallback((column: string, newDirection: SortDirection) => {
    setSortDirection(newDirection);
    setSortColumn(column);
  }, []);

  const sortedItems = useMemo(() => {
    if (!requestData?.items) return [];

    const items = [...requestData.items];

    const columnMapping: Record<string, (item: any) => any> = {
      title: (item) => item.catalogueItem?.description ?? '',
      sapNumber: (item) => item.catalogueItem?.sapNumber ?? '',
      categoryType: (item) => item.catalogueItem?.categoryType ?? '',
      quantity: (item) => item.quantity ?? 0,
      priceWithoutDPH: (item) => item.catalogueItem?.unitPrice ?? 0,
      approver: () =>
        requestData?.approver
          ? `${requestData.approver.givenName} ${requestData.approver.surname}`
          : '',
    };

    const getValue = columnMapping[sortColumn] || (() => '');

    return items.sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();

      if (sortDirection === 'asc') {
        return stringA.localeCompare(stringB);
      } else {
        return stringB.localeCompare(stringA);
      }
    });
  }, [requestData?.approver, requestData?.items, sortColumn, sortDirection]);

  const handleNewEmptyItem = useCallback(() => {
    setModalMode('create');
    setIsEmptyItemsModalVisible(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const handlePageSizeChange = useCallback((value: string) => {
    setPageSize(Number(value));
    setCurrentPage(0);
  }, []);

  return (
    <div className={styles.tabsWrapper}>
      {isItemsTabSelected && (
        <div className={styles.buttonsContainer}>
          <Button
            id="button-items-tab-new-item-from-catalog"
            variant={itemsNumber > 0 ? 'secondary' : 'primary'}
            onClick={() => setIsCatalogItemsModalVisible(true)}
          >
            <Text variant="subtitle" selectable={false}>
              {t('items.addItemFromCatalog')}
            </Text>
          </Button>
          <Button
            id="button-items-tab-new-free-item"
            variant="secondary"
            onClick={handleNewEmptyItem}
          >
            <Text variant="subtitle" selectable={false}>
              {t('items.addFreeItem')}
            </Text>
          </Button>
        </div>
      )}
      <CatalogueItemModal
        requestId={requestId}
        isModalVisible={isCatalogItemsModalVisible}
        setIsModalVisible={setIsCatalogItemsModalVisible}
      />
      <EmptyItemsModal
        isModalVisible={isEmptyItemsModalVisible}
        setIsModalVisible={setIsEmptyItemsModalVisible}
        requestId={requestId ?? ''}
        modalMode={modalMode}
        inputReadonly={false}
        isFromCatalogue={false}
      />
      <TabGroup tabs={tabs} setSelectedTab={setSelectedTab} selectedTab={selectedTab}>
        <ItemsTab
          displayedRecords={sortedItems}
          recipientId={requestData?.recipient?.id || ''}
          approver={approver ?? ''}
          isLoading={isLoadingRequest}
          sortDirection={sortDirection}
          sortColumn={sortColumn}
          handleSort={handleSort}
          pageSize={pageSize}
          currentPage={currentPage}
          totalCount={requestData?.items?.length || 0}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          requestId={requestId}
          wfStatus={requestData?.wfState ?? 'Draft'}
        />
        <BasicDataTab
          requestId={requestData?.id || requestId}
          requestData={requestData}
          isLoading={isLoadingRequest}
        />
        <ApprovalHistoryTab displayedRecords={approveHistory ?? []} itemsCount={itemsNumber} />
        <CommentsTab requestId={requestId ?? ''} />
      </TabGroup>
    </div>
  );
};
