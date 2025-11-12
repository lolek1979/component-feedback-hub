import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SortDirection } from '@tanstack/react-table';
import { useQueryState } from 'nuqs';

import { Button } from '@/design-system/atoms';
import { Modal, Table, Typography } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast/Toast';
import DataTableSkeleton from '@/design-system/organisms/DataTableSkeleton/DataTableSkeleton';
import { TableFooter } from '@/design-system/organisms/TableContainer/partials';
import { RequestItemDetailModel, WFState } from '@/domains/electronic-requests/api/services/types';

import { useCreateRequest, useDeleteRequestItem, useRequestItem } from '../../api/query';
import { useApproveRequest } from '../../api/query/useApproveRequest';
import { useUpdateItemState } from '../../api/query/useUpdateItemState';
import { EmptyItemsModal } from '../../components/RequestDetail/partials/RequestTabsContainer/NewItemModals/EmptyItemsModal';
import { useRequestsUserRoles } from '../../hooks/useRequestsUserRoles';
import styles from '../RequestsDataTable/RequestsDataTable.module.css';
import { RequestItemConfirmModal } from './partials/RequestItemConfirmModal';
import { ModalType } from './partials/RequestModalContent';
import { ApproverItemsActions } from './partials/Table/ApproverItemsActions';
import { ItemsTableBody } from './partials/Table/ItemsTableBody';
import { ItemsTableHeader } from './partials/Table/ItemsTableHeader';
import { RequesterItemsActions } from './partials/Table/RequesterItemsActions';

const PAGE_SIZE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

export interface RequestItemsTableProps {
  displayedRecords: RequestItemDetailModel[];
  recipientId: string;
  approver: string;
  isLoading: boolean;
  sortDirection: SortDirection | 'none';
  sortColumn?: string;
  handleSort: (column: string, newDirection: SortDirection) => void;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (value: string) => void;
  requestId: string | null;
  wfStatus: WFState;
}

export const RequestItemsTable = ({
  displayedRecords,
  isLoading,
  recipientId,
  sortDirection,
  sortColumn = '',
  handleSort,
  totalCount,
  pageSize,
  currentPage,
  handlePageChange,
  handlePageSizeChange,
  approver,
  requestId,
  wfStatus,
}: RequestItemsTableProps) => {
  const router = useRouter();
  const tRequestItemsTable = useTranslations('requests.itemsTable');
  const tRequestItemsActions = useTranslations('requests.itemsTable.deleteConfirmation');

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [allSelected, setAllSelected] = useState(false);
  const [emptyItemsModalVisible, setEmptyItemsModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [modalType, setModalType] = useState<ModalType>('createNew');
  const [selectedBatchItems, setSelectedBatchItems] = useState<RequestItemDetailModel[]>([]);
  const [, setItemIdQuery] = useQueryState('itemId');
  const itemId = modalMode === 'edit' ? (selectedItemId ?? undefined) : undefined;

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { mutate: deleteRequestItem, isPending: isDeletingItem } = useDeleteRequestItem();

  const { mutate: createRequest } = useCreateRequest();
  const { mutate: addItemsToRequest } = useRequestItem();
  const { mutate: approveRequest, isPending: isApproving } = useApproveRequest();
  const { mutate: updateItemState } = useUpdateItemState();

  const { roles } = useRequestsUserRoles();
  const isApprover = roles.isApprover;

  const handleSelectAll = (checked: boolean) => {
    setAllSelected(checked);

    if (checked) {
      const newSelectedItems = displayedRecords.reduce(
        (acc, item) => {
          acc[item.id] = true;

          return acc;
        },
        {} as Record<string, boolean>,
      );
      setSelectedItems(newSelectedItems);
    } else {
      setSelectedItems({});
    }
  };

  const handleSelectItem = (checked: boolean, itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: checked,
    }));

    if (!checked) {
      setAllSelected(false);
    } else {
      const allItemsSelected = displayedRecords.every(
        (item) => item.id === itemId || selectedItems[item.id],
      );
      setAllSelected(allItemsSelected);
    }
  };

  const handleCloseModal = () => {
    setEmptyItemsModalVisible(false);
    setSelectedItemId(null);
    setItemIdQuery(null);
  };

  const handleDeleteItem = useCallback((itemId: string) => {
    setItemToDelete(itemId);
    setIsDeleteModalVisible(true);
  }, []);

  const handleConfirmDeletion = useCallback(() => {
    if (!itemToDelete) return;

    deleteRequestItem(itemToDelete, {
      onSuccess: () => {
        toast.success(tRequestItemsTable('deleteConfirmation.onSuccess'), {
          id: 'toast-delete-item-success',
        });
        setIsDeleteModalVisible(false);
        setItemToDelete(null);
      },
      onError: (err) => {
        console.error('Failed to delete item:', err);
        toast.error(tRequestItemsTable('deleteConfirmation.onError'), {
          id: 'toast-delete-item-error',
        });
        setIsDeleteModalVisible(false);
        setItemToDelete(null);
      },
    });
  }, [itemToDelete, deleteRequestItem, tRequestItemsTable]);

  const handleCancelDeletion = useCallback(() => {
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  }, []);

  const selectedItemForDeletion = useMemo(() => {
    if (!itemToDelete) return null;

    return displayedRecords.find((item) => item.id === itemToDelete);
  }, [itemToDelete, displayedRecords]);

  const selectedItemsCount = useMemo(() => {
    return Object.values(selectedItems).filter(Boolean).length;
  }, [selectedItems]);

  const handleCloseCreateModal = () => {
    setConfirmModalVisible(false);
    setSelectedBatchItems([]);
  };

  const handleCreateNewRequest = () => {
    setIsCreatingRequest(true);

    const requestData = {
      recipientId: recipientId,
      //TODO: Update prefilled values with business
      description: 'New request created from selected items',
      justification: 'Items transferred from another request',
      deliveryAddress: 'Default Delivery Address',
    };

    createRequest(requestData, {
      onSuccess: (response) => {
        const newRequestId = response.data?.payload?.id;

        if (!newRequestId) {
          console.error('Failed to get new request ID from response:', response);
          setIsCreatingRequest(false);
          setConfirmModalVisible(false);

          return;
        }

        const formattedItems = selectedBatchItems.map((item) => ({
          description: item.catalogueItem?.description || item.manualItem?.description || '',
          catalogueItemId: item.catalogueItem?.id,
          manualItem: {
            description: item.manualItem?.description || '',
            categoryId: item.manualItem?.category.id,
            sapNumber: item.manualItem.sapNumber,
            supplierArticleNumber: item.manualItem?.supplierArticleNumber || '',
            unitOfMeasure: item.manualItem?.unitOfMeasure || '',
            unitPrice: item.manualItem?.unitPrice || 0,
            contract: item.manualItem?.contract || '',
            externalUrl: item.manualItem?.externalUrl || '',
          },
          quantity: item.quantity,
          justification: 'Item transferred from another request',
          expectedDeliveryDate: new Date().toISOString().split('T')[0],
          attachments: item.attachments?.map((att) => att.id) || [],
        }));

        addItemsToRequest(
          { requestId: newRequestId, items: formattedItems },
          {
            onSuccess: () => {
              setSelectedItems({});
              setAllSelected(false);
              setConfirmModalVisible(false);
              setIsCreatingRequest(false);
              toast.success(tRequestItemsTable('newRequestFromSelectedItems.onSuccess'), {
                id: 'toast-create-request-from-selected-items-success',
              });

              router.push(`/e-zadanky/${newRequestId}?parent=${newRequestId}`);
            },
            onError: (error) => {
              console.error('Failed to add items to new request:', error);
              setIsCreatingRequest(false);
              toast.error(tRequestItemsTable('newRequestFromSelectedItems.onError'), {
                id: 'toast-create-request-from-selected-items-error',
              });
            },
          },
        );
      },
      onError: (error) => {
        console.error('Failed to create new request:', error);
        setIsCreatingRequest(false);
        toast.error(tRequestItemsTable('newRequestFromSelectedItems.onError'), {
          id: 'toast-create-request-from-selected-items-error',
        });
      },
    });
  };

  const handleApproveItems = () => {
    if (!requestId) return;
    approveRequest(requestId, {
      onSuccess: () => {
        setConfirmModalVisible(false);
        toast.success(tRequestItemsTable('approveConfirmation.onSuccess'));
      },
      onError: () => {
        setConfirmModalVisible(false);
        toast.error(tRequestItemsTable('approveConfirmation.onError'));
      },
    });
  };

  const handleRejectItems = () => {
    setConfirmModalVisible(false);
    if (!requestId) return;

    const selectedItemIds = displayedRecords
      .filter((item) => selectedItems[item.id])
      .map((item) => item.id);

    if (selectedItemIds.length === 0) return;

    updateItemState(
      {
        itemIds: selectedItemIds,
        newState: 'Rejected',
        reason: rejectReason,
      },
      {
        onSuccess: () => {
          toast.success(tRequestItemsTable('declineConfirmation.onSuccess'));
          setRejectReason('');
        },
        onError: () => {
          toast.error(tRequestItemsTable('declineConfirmation.onError'));
        },
      },
    );
  };

  const handleCompleteWithoutPurchaseItems = () => {
    if (!requestId) return;

    const selectedItemIds = displayedRecords
      .filter((item) => selectedItems[item.id])
      .map((item) => item.id);

    if (selectedItemIds.length === 0) return;

    updateItemState(
      {
        itemIds: selectedItemIds,
        newState: 'ApprovedWithoutPurchase',
        reason: '',
      },
      {
        onSuccess: () => {
          toast.success(tRequestItemsTable('completeWithoutPurchaseConfirmation.onSuccess'));
        },
        onError: () => {
          toast.error(tRequestItemsTable('completeWithoutPurchaseConfirmation.onError'));
        },
      },
    );
  };

  const handleDeleteSelectedItems = useCallback(async () => {
    if (!selectedBatchItems || selectedBatchItems.length === 0) return;

    setConfirmModalVisible(false);
    setSelectedItems({});
    setAllSelected(false);
    setSelectedBatchItems([]);

    const deletePromises = selectedBatchItems.map(
      (item) =>
        new Promise((resolve, reject) => {
          deleteRequestItem(item.id, {
            onSuccess: (data) => {
              if (!data || data.status === 'Error') {
                reject(new Error('Delete operation returned error status'));
              } else {
                resolve(data);
              }
            },
            onError: (err) => {
              reject(err);
            },
          });
        }),
    );

    try {
      const results = await Promise.allSettled(deletePromises);

      const successCount = results.filter((result) => result.status === 'fulfilled').length;
      const errorCount = results.filter((result) => result.status === 'rejected').length;

      if (errorCount === 0) {
        toast.success(tRequestItemsTable('deleteConfirmation.onSuccess'), {
          id: 'toast-delete-selected-items-success',
        });
      } else if (successCount > 0) {
        toast.success(tRequestItemsTable('deleteConfirmation.onSuccess'), {
          id: 'toast-delete-selected-items-partial-success',
        });
      } else {
        toast.error(tRequestItemsTable('deleteConfirmation.onError'), {
          id: 'toast-delete-selected-items-error',
        });
      }
    } catch (error) {
      console.error('Unexpected error in delete operations:', error);
      toast.error(tRequestItemsTable('deleteConfirmation.onError'), {
        id: 'toast-delete-selected-items-error',
      });
    }
  }, [selectedBatchItems, deleteRequestItem, tRequestItemsTable]);

  const handleOpenModalWithType = (type: ModalType) => {
    setModalType(type);
    setConfirmModalVisible(true);
    setSelectedBatchItems(displayedRecords.filter((item) => selectedItems[item.id]));
  };

  const handleHeaderSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        handleSort(column, sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        handleSort(column, 'asc');
      }
    },
    [sortColumn, sortDirection, handleSort],
  );

  const sortedRecords = useMemo(() => {
    if (!displayedRecords) return [];
    const items = [...displayedRecords];

    const columnMapping: Record<string, (item: RequestItemDetailModel) => any> = {
      description: (item) => item.catalogueItem?.description ?? item.manualItem?.description ?? '',

      unitPrice: (item) => item.catalogueItem?.unitPrice ?? 0,
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
  }, [displayedRecords, sortColumn, sortDirection]);

  const paginatedRecords = useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;

    return sortedRecords.slice(start, end);
  }, [sortedRecords, currentPage, pageSize]);

  const selectedItem = selectedItemId
    ? displayedRecords.find((item) => item.id === selectedItemId)
    : undefined;

  const isFromCatalogue = useMemo(() => {
    if (!selectedItem) return false;

    return !!selectedItem.manualItem?.sapNumber?.trim();
  }, [selectedItem]);

  return (
    <>
      {isLoading ? (
        <DataTableSkeleton />
      ) : (
        <div className={styles.tableContainer}>
          {isApprover && selectedItemsCount > 0 && (
            <ApproverItemsActions
              selectedItemsCount={selectedItemsCount}
              handleOpenModalWithType={handleOpenModalWithType}
              handleCompleteWithoutPurchaseItems={handleCompleteWithoutPurchaseItems}
            />
          )}
          <Table className={styles.table}>
            {!isApprover && (
              <RequesterItemsActions
                selectedItemsCount={selectedItemsCount}
                handleOpenModalWithType={handleOpenModalWithType}
              />
            )}
            <ItemsTableHeader
              displayedRecords={displayedRecords}
              isApprover
              handleSelectAll={handleSelectAll}
              allSelected={allSelected}
              handleHeaderSort={handleHeaderSort}
            />
            <ItemsTableBody
              paginatedRecords={paginatedRecords}
              approver={approver}
              isApprover
              setSelectedItemId={setSelectedItemId}
              setEmptyItemsModalVisible={setEmptyItemsModalVisible}
              setItemIdQuery={setItemIdQuery}
              setModalMode={setModalMode}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleDeleteItem={handleDeleteItem}
            />
          </Table>
          <TableFooter
            selectItems={PAGE_SIZE_OPTIONS}
            onSelectChange={handlePageSizeChange}
            onPageChange={handlePageChange}
            pageCount={Math.ceil(totalCount / pageSize)}
            totalCount={totalCount}
            value={pageSize.toString()}
            currPage={currentPage + 1}
          />
        </div>
      )}
      <Modal
        id="modal-delete-item-confirm"
        size="small"
        title={tRequestItemsActions('title')}
        isVisible={isDeleteModalVisible}
        setIsVisible={setIsDeleteModalVisible}
        closeOnEsc={true}
        closeOnOverlayClick={false}
      >
        <div>
          {selectedItemForDeletion && (
            <Typography variant="Subtitle/Default/Regular">
              <ul className={styles.modalConfirmContent}>
                <li>
                  {selectedItemForDeletion.description} - {selectedItemForDeletion.quantity}
                  {selectedItemForDeletion.manualItem.unitOfMeasure}
                </li>
              </ul>
            </Typography>
          )}
        </div>
        <div className={styles.modalConfirmButtons}>
          <Button id="button-modal-cancel" variant="secondary" onClick={handleCancelDeletion}>
            <Typography variant="Subtitle/Default/Regular">
              {tRequestItemsActions('cancel')}
            </Typography>
          </Button>
          <Button
            id="button-modal-confirm"
            onClick={handleConfirmDeletion}
            disabled={isDeletingItem}
          >
            <Typography variant="Subtitle/Default/Regular">
              {tRequestItemsActions('confirm')}
            </Typography>
          </Button>
        </div>
      </Modal>
      <EmptyItemsModal
        isModalVisible={emptyItemsModalVisible}
        setIsModalVisible={handleCloseModal}
        requestId={requestId}
        modalMode={modalMode}
        itemId={itemId}
        inputReadonly={wfStatus !== 'Draft'}
        isFromCatalogue={isFromCatalogue}
        existingItem={selectedItem}
      />
      <RequestItemConfirmModal
        isModalVisible={confirmModalVisible}
        setIsModalVisible={setConfirmModalVisible}
        handleCloseCreateModal={handleCloseCreateModal}
        handleCreateNewRequest={handleCreateNewRequest}
        handleApproveItems={handleApproveItems}
        handleRejectItems={handleRejectItems}
        handleCompleteWithoutPurchaseItems={handleCompleteWithoutPurchaseItems}
        handleDeleteSelectedItems={handleDeleteSelectedItems}
        isCreating={isCreatingRequest}
        isDeleting={isDeletingItem}
        isApproving={isApproving}
        modalType={modalType}
        selectedItem={modalType === 'delete' ? selectedItemForDeletion : null}
        selectedBatchItems={selectedBatchItems}
        reason={modalType === 'reject' ? rejectReason : undefined}
        onReasonChange={modalType === 'reject' ? setRejectReason : undefined}
      />
    </>
  );
};
