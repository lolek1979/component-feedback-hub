import { useTranslations } from 'next-intl';

import { RequestItemDetailModel } from '@/domains/electronic-requests/api/services/types';

import styles from '../../../RequestsDataTable/RequestsDataTable.module.css';

import { Checkbox, TableCell, TableHead, TableRow, Typography } from '@/design-system';

interface ItemsTableHeaderProps {
  displayedRecords: RequestItemDetailModel[];
  isApprover?: boolean;
  handleSelectAll: (checked: boolean) => void;
  allSelected?: boolean;
  handleHeaderSort: (column: string) => void;
}

export const ItemsTableHeader = ({
  displayedRecords,
  isApprover = false,
  handleSelectAll,
  allSelected = false,
  handleHeaderSort,
}: ItemsTableHeaderProps) => {
  const tRequestItemsTable = useTranslations('requests.itemsTable');

  return (
    <TableHead className={styles.tableHeader}>
      <TableRow>
        <TableCell
          isHeader
          isChecked={allSelected}
          onCheckChange={handleSelectAll}
          isSort
          columnKey="description"
          onClick={() => handleHeaderSort('description')}
        >
          <div className={styles.inlineCells}>
            <Checkbox
              id="checkbox-select-all-items"
              name="select-all-items"
              disabled={displayedRecords.length === 0}
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <Typography variant="Subtitle/Default/Regular">
              {tRequestItemsTable('title')}
            </Typography>
          </div>
        </TableCell>

        <TableCell isHeader columnKey="description">
          <Typography variant="Subtitle/Default/Regular">
            {tRequestItemsTable('description')}
          </Typography>
        </TableCell>
        <TableCell isHeader columnKey="attachments">
          <Typography variant="Subtitle/Default/Regular">
            {tRequestItemsTable('attachments')}
          </Typography>
        </TableCell>
        <TableCell
          isHeader
          isSort
          columnKey="categoryType"
          onClick={() => handleHeaderSort('categoryType')}
        >
          <Typography variant="Subtitle/Default/Regular">
            {tRequestItemsTable('category')}
          </Typography>
        </TableCell>
        {isApprover && (
          <TableCell isHeader columnKey="approver">
            <Typography variant="Subtitle/Default/Regular">
              {tRequestItemsTable('approver')}
            </Typography>
          </TableCell>
        )}
        <TableCell isHeader>
          <Typography variant="Subtitle/Default/Regular">
            {tRequestItemsTable('quantity')}
          </Typography>
        </TableCell>
        <TableCell
          isHeader
          isSort
          columnKey="unitPrice"
          onClick={() => handleHeaderSort('unitPrice')}
        >
          <Typography variant="Subtitle/Default/Regular">
            {tRequestItemsTable('priceWithDPH')}
          </Typography>
        </TableCell>
        <TableCell isHeader>
          <Typography variant="Subtitle/Default/Regular">
            {isApprover ? tRequestItemsTable('decision') : tRequestItemsTable('status')}
          </Typography>
        </TableCell>
        <TableCell isHeader />
      </TableRow>
    </TableHead>
  );
};
