import IAdd from '@/core/assets/icons/add.svg';
import IDelete from '@/core/assets/icons/delete_forever.svg';
import Iinfo from '@/core/assets/icons/info.svg';
import IStar from '@/core/assets/icons/star.svg';
import IStarFilled from '@/core/assets/icons/star_filled.svg';
import { SortDirection } from '@/core/utils/types';
import { DataTableSkeleton } from '@/design-system/organisms';
import { CSCCatalogueItem } from '@/domains/electronic-requests/api/services/CSC/types';

import styles from '../CatalogueItemModal.module.css';

import { getNextSortDirection } from '@/core';
import {
  Button,
  InlineMessage,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
} from '@/design-system';

interface CatalogueItemsTableProps {
  sortedCatalogItems: CSCCatalogueItem[];
  favorites: Record<string, boolean>;
  addedItems: Record<string, boolean>;

  isLoading: boolean;
  isLoadingCatalog: boolean;

  catalogSortDirection: SortDirection;
  handleCatalogSort: (column: string, newDirection: SortDirection) => void;
  itemActions: {
    onAdd: (item: CSCCatalogueItem) => void;
    onDelete: (itemId: string) => void;
    onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  };
  quantityHandling: {
    onChange: (id: string, value: string) => void;
    onBlur: (id: string, value: string) => void;
    getDisplayValue: (id: string) => string;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  };
  t: (key: string) => string;
}

export const CatalogueItemsTable = ({
  isLoading,
  itemActions,
  quantityHandling,
  addedItems,
  isLoadingCatalog,
  sortedCatalogItems,
  handleCatalogSort,
  catalogSortDirection,
  favorites,
  t,
}: CatalogueItemsTableProps) => {
  const { onAdd, onDelete, onFavoriteToggle } = itemActions;
  const { onChange, onBlur, getDisplayValue, onKeyDown } = quantityHandling;
  let content: React.ReactNode;

  if (isLoadingCatalog) {
    content = <DataTableSkeleton size={'quarter'} />;
  } else if (sortedCatalogItems.length === 0) {
    content = (
      <InlineMessage
        id="inline-message-no-items-found"
        className={styles.noResultsMessage}
        icon={<Iinfo id="icon-inline-message-no-items-found" width={20} height={20} />}
        centeredText
      >
        <Text variant="subtitle"> {t('noResultsMessage')}</Text>
      </InlineMessage>
    );
  } else {
    content = (
      <div className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHeader}>
            <TableRow className={styles.tableRow}>
              <TableCell
                isHeader
                isSort
                onClick={() =>
                  handleCatalogSort('description', getNextSortDirection(catalogSortDirection))
                }
              >
                <Text variant="subtitle" regular>
                  {t('tableHeaders.title')}
                </Text>
              </TableCell>
              <TableCell isHeader />
              <TableCell
                isHeader
                isSort
                onClick={() =>
                  handleCatalogSort('sapNumber', getNextSortDirection(catalogSortDirection))
                }
              >
                <Text variant="subtitle" regular>
                  {t('tableHeaders.sapNumber')}
                </Text>
              </TableCell>
              <TableCell
                isHeader
                isSort
                onClick={() =>
                  handleCatalogSort('unitPrice', getNextSortDirection(catalogSortDirection))
                }
              >
                <Text variant="subtitle" regular>
                  {t('tableHeaders.price')}
                </Text>
              </TableCell>
              <TableCell isHeader />
              <TableCell isHeader />
            </TableRow>
          </TableHead>
          <TableBody className={styles.tableBody}>
            {sortedCatalogItems.map((item, index) => (
              <TableRow key={item.id} className={styles.tableRow}>
                <TableCell>
                  <Text variant="subtitle" regular>
                    {item.description}
                  </Text>
                </TableCell>
                <TableCell>
                  <div className={styles.starButtonContainer}>
                    <Button
                      id={`button-add-favorite-${item.id}`}
                      variant="unstyled"
                      onClick={() => onFavoriteToggle(item.id, item.isFavorite)}
                    >
                      {item.isFavorite || favorites[item.id] ? (
                        <IStarFilled
                          width={24}
                          height={24}
                          id={'icon-catalog-item-star-' + index}
                        />
                      ) : (
                        <IStar width={24} height={24} id={'icon-catalog-item-star-' + index} />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Text variant="subtitle" regular>
                    {item.sapNumber}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text variant="subtitle" regular>
                    {item.unitPrice} Kč
                  </Text>
                </TableCell>
                <TableCell>
                  {addedItems[item.id] && (
                    <Input
                      id={`input-quantity-${item.id}`}
                      type="text"
                      className={styles.searchItemInput}
                      value={getDisplayValue(item.id)}
                      width={75}
                      onChange={(e) => onChange(item.id, e.target.value)}
                      onBlur={(e) => onBlur(item.id, e.target.value)}
                      onKeyDown={onKeyDown}
                      disabled={isLoading}
                      currency="ks"
                    />
                  )}
                </TableCell>
                <TableCell className={styles.buttonCell}>
                  {addedItems[item.id] ? (
                    <div>
                      <Button
                        id={`button-remove-item-${item.id}`}
                        variant="secondary"
                        className={styles.addRemoveButton}
                        onClick={() => onDelete(item.id)}
                      >
                        <IDelete width={24} height={24} id={'icon-catalog-item-delete-' + index} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      id={`button-add-item-${item.id}`}
                      variant="primary"
                      className={styles.addRemoveButton}
                      onClick={() => onAdd(item)}
                      disabled={isLoading}
                    >
                      <IAdd
                        width={24}
                        height={24}
                        className="icon_white"
                        id={'icon-catalog-item-add-' + index}
                      />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return <>{content}</>;
};
