import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';

import { Button, Text } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';
import { toast } from '@/design-system/molecules/Toast';
import {
  useDeleteRequestItem,
  useRequestById,
  useRequestCSCCatalogue,
  useRequestItem,
} from '@/domains/electronic-requests/api/query';
import { useUpdateRequestItemQuantity } from '@/domains/electronic-requests/api/query/useUpdateRequestItem';
import { CSCCatalogueItem } from '@/domains/electronic-requests/api/services/CSC/types';
import { RequestItemUpdateModel } from '@/domains/electronic-requests/api/services/types';
import { mapToUpdateItemPayload } from '@/domains/electronic-requests/utils';

import { useCatalogueSearch } from './hooks/useCatalogueSearch';
import { useCatalogueSort } from './hooks/useCatalogueSort';
import { CatalogueItemsTable } from './partials/CatalogueItemsTable';
import { SearchSection } from './partials/SearchSection';
import styles from './CatalogueItemModal.module.css';

const DECIMAL_NUMBER_REGEX: RegExp = /^\d*\.?\d*$/;
const ALLOWED_INPUT_CHARS_REGEX: RegExp = /[\d.]/;
const ALLOWED_KEYS: string[] = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

export type GetResultsMessageT = (key: string, params?: { count: number }) => string;

const getResultsMessage = (
  isLoading: boolean,
  itemCount: number,
  t: GetResultsMessageT,
): string => {
  if (isLoading) {
    return t('loading');
  }

  if (itemCount > 0) {
    return t('resultItemsCount', { count: itemCount });
  }

  return '';
};

interface CatalogueItemModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  requestId: string | null;
}

export const CatalogueItemModal = ({
  isModalVisible,
  setIsModalVisible,
  requestId,
}: CatalogueItemModalProps) => {
  const t = useTranslations('requests.requestDetail.tabs.items.itemFromCatalogModal');

  const { catalogSortDirection, catalogSortColumn, handleCatalogSort } = useCatalogueSort();

  const { fullText, catalogSearchText, handleFullTextChange, shouldShowResults } =
    useCatalogueSearch();

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [itemQuantities, setItemQuantities] = useState<Record<string, string>>({});
  const [catalogToRequestMapping, setCatalogToRequestMapping] = useState<Record<string, string>>(
    {},
  );
  const [pendingChanges, setPendingChanges] = useState<{
    itemsToAdd: CSCCatalogueItem[];
    itemsToDelete: string[];
    quantityUpdates: Record<string, number>;
  }>({
    itemsToAdd: [],
    itemsToDelete: [],
    quantityUpdates: {},
  });

  const { data: catalogData, isLoading: isLoadingCatalog } = useRequestCSCCatalogue({
    fulltextSearch: catalogSearchText,
    take: 20,
    enabled: !!catalogSearchText,
  });

  const { mutate: addRequestItem, isPending: isAddingItem } = useRequestItem();
  const { mutate: updateItemQuantity, isPending: isUpdatingQuantity } =
    useUpdateRequestItemQuantity();

  const { data: requestData } = useRequestById({
    id: requestId || '',
    enabled: !!requestId,
  });

  const toggleFavorite = useCallback((id: string, isFavorite: boolean) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id] && !isFavorite,
    }));
  }, []);

  const handleQuantityChange = useCallback((id: string, value: string) => {
    if (value === '' || DECIMAL_NUMBER_REGEX.test(value)) {
      if (value === '.') {
        value = '0.';
      }

      setItemQuantities((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  }, []);

  const getDisplayQuantity = useCallback(
    (id: string) => {
      return itemQuantities[id] || '1';
    },
    [itemQuantities],
  );

  const handleNumericInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ALLOWED_INPUT_CHARS_REGEX.test(e.key) && !ALLOWED_KEYS.includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === '.' && e.currentTarget.value.includes('.')) {
      e.preventDefault();
    }
  }, []);

  const catalogItems = useMemo(() => {
    return catalogData?.payload?.items || [];
  }, [catalogData]);

  const sortedCatalogItems = useMemo(() => {
    if (!catalogItems.length) return [];

    return [...catalogItems].sort((a, b) => {
      const columnMapping: Record<string, (item: CSCCatalogueItem) => string | number> = {
        description: (item) => item.description,
        sapNumber: (item) => item.sapNumber,
        unitPrice: (item) => item.unitPrice,
      };

      const getValue = columnMapping[catalogSortColumn] || ((item) => item.description);

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return catalogSortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const stringA = String(valueA).toLowerCase();
      const stringB = String(valueB).toLowerCase();

      return catalogSortDirection === 'asc'
        ? stringA.localeCompare(stringB)
        : stringB.localeCompare(stringA);
    });
  }, [catalogItems, catalogSortColumn, catalogSortDirection]);

  useEffect(() => {
    if (catalogData?.payload?.items && requestData?.items) {
      const initialFavorites: Record<string, boolean> = {};
      const initialAddedItems: Record<string, boolean> = {};
      const initialQuantities: Record<string, string> = {};
      const initialMapping: Record<string, string> = {};

      catalogData.payload.items.forEach((catalogItem) => {
        initialFavorites[catalogItem.id] = catalogItem.isFavorite;

        const existingRequestItem = requestData.items?.find((requestItem) => {
          return (
            requestItem.catalogueItem?.sapNumber &&
            requestItem.manualItem?.description === catalogItem.description
          );
        });

        if (existingRequestItem) {
          initialAddedItems[catalogItem.id] = true;
          initialQuantities[catalogItem.id] = String(existingRequestItem.quantity);
          initialMapping[catalogItem.id] = existingRequestItem.id;
        }
      });

      setFavorites(initialFavorites);
      setAddedItems(initialAddedItems);
      setItemQuantities(initialQuantities);
      setCatalogToRequestMapping(initialMapping);
    }
  }, [catalogData?.payload?.items, requestData?.items]);

  const favoriteItemsCount = useMemo(() => {
    if (!catalogData?.payload?.items) return 0;

    return catalogData.payload.items.filter((item) => item.isFavorite || favorites[item.id]).length;
  }, [catalogData?.payload?.items, favorites]);

  const { mutate: deleteRequestItem } = useDeleteRequestItem();

  const hasAddedItems = useMemo(() => {
    return Object.values(addedItems).some(Boolean);
  }, [addedItems]);

  const hasPendingChanges = useMemo(() => {
    return (
      pendingChanges.itemsToAdd.length > 0 ||
      pendingChanges.itemsToDelete.length > 0 ||
      Object.keys(pendingChanges.quantityUpdates).length > 0
    );
  }, [pendingChanges]);

  const handleDeleteItem = useCallback(
    (catalogItemId: string) => {
      const requestItemId = catalogToRequestMapping[catalogItemId];

      if (requestItemId) {
        setPendingChanges((prev) => ({
          ...prev,
          itemsToAdd: prev.itemsToAdd.filter((item) => item.id !== catalogItemId),
          itemsToDelete: [
            ...prev.itemsToDelete.filter((id) => id !== requestItemId),
            requestItemId,
          ],
        }));
      } else {
        setPendingChanges((prev) => ({
          ...prev,
          itemsToAdd: prev.itemsToAdd.filter((item) => item.id !== catalogItemId),
        }));
      }

      setAddedItems((prev) => ({
        ...prev,
        [catalogItemId]: false,
      }));

      setItemQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[catalogItemId];

        return newQuantities;
      });
    },
    [catalogToRequestMapping],
  );

  const handleAddItem = useCallback(
    (item: CSCCatalogueItem) => {
      if (!requestId) {
        console.error('Cannot add item: requestId is null');

        return;
      }

      const quantity = Number(itemQuantities[item.id] || '1');

      setPendingChanges((prev) => ({
        ...prev,
        itemsToAdd: [...prev.itemsToAdd.filter((i) => i.id !== item.id), item],
        quantityUpdates: { ...prev.quantityUpdates, [item.id]: quantity },
      }));

      setAddedItems((prev) => ({
        ...prev,
        [item.id]: true,
      }));

      setItemQuantities((prev) => ({
        ...prev,
        [item.id]: String(quantity),
      }));
    },
    [requestId, itemQuantities],
  );

  const handleQuantityBlur = useCallback((catalogItemId: string, value: string) => {
    const quantity = parseFloat(value || '1');

    if (!isNaN(quantity) && quantity > 0) {
      setPendingChanges((prev) => ({
        ...prev,
        quantityUpdates: { ...prev.quantityUpdates, [catalogItemId]: quantity },
      }));
    }
  }, []);

  const handleApproveChanges = useCallback(() => {
    if (!requestId) {
      console.error('Cannot apply changes: requestId is null');

      return;
    }

    let completedOperations = 0;
    const totalOperations =
      pendingChanges.itemsToAdd.length +
      pendingChanges.itemsToDelete.length +
      Object.keys(pendingChanges.quantityUpdates).filter((catalogItemId) => {
        const requestItemId = catalogToRequestMapping[catalogItemId];
        if (!requestItemId || !requestData) return false;
        const currentItem = requestData.items?.find((item) => item.id === requestItemId);

        return (
          currentItem && currentItem.quantity !== pendingChanges.quantityUpdates[catalogItemId]
        );
      }).length;

    if (totalOperations === 0) {
      setIsModalVisible(false);

      return;
    }

    const handleOperationComplete = () => {
      completedOperations++;
      if (completedOperations === totalOperations) {
        setPendingChanges({ itemsToAdd: [], itemsToDelete: [], quantityUpdates: {} });
        setAddedItems({});
        setItemQuantities({});
        setCatalogToRequestMapping({});
        setIsModalVisible(false);
        toast.success(t('onSuccess'), { id: 'toast-changes-applied-success' });
      }
    };

    pendingChanges.itemsToAdd.forEach((item) => {
      const quantity = pendingChanges.quantityUpdates[item.id] || 1;
      const payload = {
        requestId,
        items: [
          {
            manualItem: {
              description: item.description,
              categoryId: item.category.id,
              sapNumber: item.sapNumber,
              supplierArticleNumber: item.supplierArticleNumber,
              unitOfMeasure: item.unitOfMeasure,
              unitPrice: item.unitPrice,
              contract: item.contract,
              externalUrl: item.externalUrl,
            },
            description: item.description,
            quantity,
            expectedDeliveryDate: new Date().toISOString().split('T')[0],
            attachments: [],
            isFromCatalogue: true,
          },
        ],
      };

      addRequestItem(payload, {
        onSuccess: () => handleOperationComplete(),
        onError: (err: AxiosError) => {
          console.error('Failed to add item:', err);
          toast.error(t('onError'), { id: `toast-add-item-error-${item.id}` });
          handleOperationComplete();
        },
      });
    });

    pendingChanges.itemsToDelete.forEach((requestItemId) => {
      deleteRequestItem(requestItemId, {
        onSuccess: () => handleOperationComplete(),
        onError: () => {
          console.error('Failed to delete item:', requestItemId);
          toast.error(t('onDeleteError'), { id: `toast-delete-item-error-${requestItemId}` });
          handleOperationComplete();
        },
      });
    });

    Object.entries(pendingChanges.quantityUpdates).forEach(([catalogItemId, quantity]) => {
      const requestItemId = catalogToRequestMapping[catalogItemId];
      if (requestItemId && requestData) {
        const currentItem = requestData.items?.find((item) => item.id === requestItemId);

        if (currentItem && currentItem.quantity !== quantity) {
          const updateItemPayload = mapToUpdateItemPayload(currentItem);

          updateItemQuantity(
            {
              itemId: requestItemId,
              quantity,
              currentItem: updateItemPayload,
            },
            {
              onSuccess: () => handleOperationComplete(),
              onError: () => {
                console.error('Failed to update item quantity:', catalogItemId);
                handleOperationComplete();
              },
            },
          );
        } else {
          handleOperationComplete();
        }
      } else {
        handleOperationComplete();
      }
    });
  }, [
    pendingChanges,
    requestId,
    addRequestItem,
    deleteRequestItem,
    catalogToRequestMapping,
    requestData,
    t,
    setIsModalVisible,
  ]);

  const handleCloseModal = useCallback(() => {
    if (catalogData?.payload?.items && requestData?.items) {
      const resetAddedItems: Record<string, boolean> = {};
      const resetQuantities: Record<string, string> = {};
      const resetMapping: Record<string, string> = {};

      catalogData.payload.items.forEach((catalogItem) => {
        const existingRequestItem = requestData.items?.find((requestItem) => {
          return (
            requestItem.catalogueItem?.sapNumber &&
            requestItem.manualItem?.description === catalogItem.description
          );
        });

        if (existingRequestItem) {
          resetAddedItems[catalogItem.id] = true;
          resetQuantities[catalogItem.id] = String(existingRequestItem.quantity);
          resetMapping[catalogItem.id] = existingRequestItem.id;
        }
      });

      setAddedItems(resetAddedItems);
      setItemQuantities(resetQuantities);
      setCatalogToRequestMapping(resetMapping);
    } else {
      setAddedItems({});
      setItemQuantities({});
      setCatalogToRequestMapping({});
    }

    setPendingChanges({ itemsToAdd: [], itemsToDelete: [], quantityUpdates: {} });
    setIsModalVisible(false);
  }, [catalogData?.payload?.items, requestData?.items, setIsModalVisible]);

  return (
    <Modal
      id="add-item-modal"
      isVisible={isModalVisible}
      setIsVisible={setIsModalVisible}
      size="large"
    >
      <div>
        <div className={styles.modalHeader}>
          <Text variant="headline">{t('title')}</Text>
        </div>
        <div>
          <SearchSection
            fullText={fullText}
            handleFullTextChange={handleFullTextChange}
            sortedCatalogItemsLength={sortedCatalogItems.length}
            favoriteItemsCount={favoriteItemsCount}
            t={t}
          />
          {shouldShowResults && (
            <div className={styles.modalContent}>
              <div className={styles.resultsContainer}>
                <Text variant="subtitle">
                  {getResultsMessage(isLoadingCatalog, sortedCatalogItems.length, t)}
                </Text>
              </div>

              <CatalogueItemsTable
                sortedCatalogItems={sortedCatalogItems}
                favorites={favorites}
                addedItems={addedItems}
                isLoading={isAddingItem || isUpdatingQuantity}
                isLoadingCatalog={isLoadingCatalog}
                catalogSortDirection={catalogSortDirection}
                handleCatalogSort={handleCatalogSort}
                itemActions={{
                  onAdd: handleAddItem,
                  onDelete: handleDeleteItem,
                  onFavoriteToggle: toggleFavorite,
                }}
                quantityHandling={{
                  onChange: handleQuantityChange,
                  onBlur: handleQuantityBlur,
                  getDisplayValue: getDisplayQuantity,
                  onKeyDown: handleNumericInputKeyDown,
                }}
                t={t}
              />
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {hasAddedItems || hasPendingChanges ? (
            <Button
              id="button-add-item-from-catalog-confirm"
              size="medium"
              className={styles.cancelApproveButton}
              onClick={handleApproveChanges}
              disabled={isAddingItem || isUpdatingQuantity}
            >
              {t('approveButton')}
            </Button>
          ) : (
            <Button
              id="button-close-item-from-catalog-modal"
              variant="secondary"
              size="medium"
              className={styles.cancelApproveButton}
              onClick={handleCloseModal}
            >
              {t('closeButton')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
