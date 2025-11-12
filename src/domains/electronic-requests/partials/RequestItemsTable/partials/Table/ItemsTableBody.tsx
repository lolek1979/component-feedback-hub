import { useTranslations } from 'next-intl';

import { IArrowDown, IAttachFile, IChat } from '@/core/assets/icons';
import IDelete from '@/core/assets/icons/delete_forever.svg';
import { RequestItemDetailModel } from '@/domains/electronic-requests/api/services/types';
import { formatWorkflowState, getBadgeColor } from '@/domains/electronic-requests/utils';

import styles from '../../../RequestsDataTable/RequestsDataTable.module.css';
import { EmptyCell } from './EmptyCell';

import {
  AppLink,
  Badge,
  Button,
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@/design-system';

interface ItemsTableBodyProps {
  paginatedRecords: RequestItemDetailModel[];
  approver: string;
  isApprover: boolean;
  setSelectedItemId: (value: string) => void;
  setEmptyItemsModalVisible: (value: boolean) => void;
  setItemIdQuery: (itemId: string) => void;
  setModalMode: (modalMode: 'create' | 'edit') => void;
  selectedItems: Record<string, boolean>;
  handleSelectItem: (checked: boolean, itemId: string) => void;
  handleDeleteItem: (itemId: string) => void;
}

export const ItemsTableBody = ({
  paginatedRecords,
  approver,
  isApprover = false,
  setSelectedItemId,
  setEmptyItemsModalVisible,
  setItemIdQuery,
  setModalMode,
  selectedItems,
  handleSelectItem,
  handleDeleteItem,
}: ItemsTableBodyProps) => {
  const tCurrencies = useTranslations('common.currencies');
  const tRequestItemsTable = useTranslations('requests.itemsTable');

  const handleOpenModal = (itemId: string, record?: RequestItemDetailModel) => {
    setSelectedItemId(itemId);
    setEmptyItemsModalVisible(true);
    setItemIdQuery(itemId);
  };

  const handleItemLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    record: RequestItemDetailModel,
  ) => {
    e.preventDefault();
    handleOpenModal(record.id, record);
    setModalMode('edit');
  };

  const renderIdCell = (record: RequestItemDetailModel) => (
    <AppLink
      link={`/e-zadanky/${record.id}?parent=${record.id}`}
      target="_self"
      variant="primary"
      id={`link-request-id-${record.id}`}
      onClick={(e) => handleItemLinkClick(e, record)}
    >
      <Typography variant="Subtitle/Default/Link-inline">{record.description}</Typography>
    </AppLink>
  );

  return (
    <TableBody className={styles.tableBody}>
      {paginatedRecords.map((item, index) => {
        const attachmentsCount = item.attachments?.length;

        return (
          <TableRow key={item.id} className={styles.tableRow}>
            <TableCell
              isChecked={!!selectedItems[item.id]}
              onCheckChange={(checked) => handleSelectItem(checked, item.id)}
            >
              <div className={styles.inlineCells}>
                <Checkbox
                  id={`checkbox-select-item-${item.id}`}
                  name={`select-item-${item.id}`}
                  checked={!!selectedItems[item.id]}
                  onChange={(e) => handleSelectItem(e.target.checked, item.id)}
                />
                {renderIdCell(item)}
              </div>
            </TableCell>
            <TableCell>
              {item.manualItem.description?.trim() !== '' ? (
                <Tooltip
                  variant="inverse"
                  placement="tooltipTop"
                  id={`item-description-${item.id}`}
                  content={
                    <Typography variant="Caption/Regular">
                      {item.catalogueItem?.description ?? item.manualItem?.description}
                    </Typography>
                  }
                >
                  <IChat id={`item-description-${item.id}`} width={24} height={24}></IChat>
                </Tooltip>
              ) : (
                <EmptyCell />
              )}
            </TableCell>
            <TableCell>
              {attachmentsCount !== 0 ? (
                <Tooltip
                  variant="inverse"
                  placement="tooltipTop"
                  id={`item-attachments-${item.id}`}
                  content={
                    <Typography variant="Caption/Regular">
                      {tRequestItemsTable('attachmentsCount', {
                        count: attachmentsCount || 0,
                      })}
                    </Typography>
                  }
                >
                  <IAttachFile
                    id={`item-attachments-${item.id}`}
                    width={24}
                    height={24}
                  ></IAttachFile>
                </Tooltip>
              ) : (
                <EmptyCell />
              )}
            </TableCell>
            <TableCell>
              <Typography variant="Caption/Regular">
                {item.manualItem?.category.categoryType}
              </Typography>
            </TableCell>
            {isApprover && (
              <TableCell>
                {approver !== '' ? (
                  <Typography variant="Subtitle/Default/Link-dotted-regular">{approver}</Typography>
                ) : (
                  <EmptyCell />
                )}
              </TableCell>
            )}
            <TableCell>
              <Typography variant="Subtitle/Default/Regular">
                {item.quantity} {item.manualItem.unitOfMeasure}
              </Typography>
            </TableCell>
            <TableCell>
              <div className={styles.costContainer}>
                <span className={styles.costPerItem}>
                  <Typography variant="Caption/Regular">
                    {item.manualItem
                      ? item.manualItem?.unitPrice * item?.quantity
                      : (item.catalogueItem?.unitPrice ?? 0) * item?.quantity}
                  </Typography>
                  <Typography variant="Caption/Regular">{tCurrencies('crown')} </Typography>
                </span>
                <span className={styles.costPerItem}>
                  <Typography variant="Caption/Regular">
                    {item.manualItem
                      ? item.manualItem?.unitPrice
                      : (item.catalogueItem?.unitPrice ?? 0)}
                  </Typography>
                  <Typography variant="Caption/Regular">
                    {tRequestItemsTable('pricePerItem')}
                  </Typography>
                </span>
              </div>
            </TableCell>
            <TableCell>
              {item.wfState && (
                <Badge
                  color={getBadgeColor(formatWorkflowState(item.wfState))}
                  iconPosition="right"
                  icon={<IArrowDown id={`arrow-down-${item.id}`} />}
                >
                  <Typography variant="Caption/Regular">
                    {formatWorkflowState(item.wfState)}
                  </Typography>
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <Button
                id={`button-remove-item-${item.id}`}
                variant="secondary"
                className={styles.removeButton}
                onClick={() => handleDeleteItem(item.id)}
              >
                <IDelete
                  width={24}
                  height={24}
                  id={'icon-catalog-item-delete-' + index}
                  aria-label={tRequestItemsTable('actions.deleteItem')}
                />
              </Button>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};
