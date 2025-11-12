import { useTranslations } from 'next-intl';

import styles from '../../../RequestsDataTable/RequestsDataTable.module.css';
import { ModalType } from '../RequestModalContent';

import { Button, TableCell, TableHead, TableRow, Typography } from '@/design-system';

interface RequesterItemsActionsProps {
  selectedItemsCount: number;
  handleOpenModalWithType: (type: ModalType) => void;
}

export const RequesterItemsActions = ({
  selectedItemsCount,
  handleOpenModalWithType,
}: RequesterItemsActionsProps) => {
  const tRequestItemsTable = useTranslations('requests.itemsTable');

  return (
    <TableHead className={`${styles.tableHeader} ${styles.firstTableHeader}`}>
      <TableRow>
        <TableCell isHeader className={styles.selectedItemsCount}>
          <Typography variant="Caption/Bold">
            {tRequestItemsTable('selectedItems', { count: selectedItemsCount })}
          </Typography>
        </TableCell>
        <>
          <TableCell isHeader align="left">
            <div className={styles.tableActionsButtons}>
              <Button
                id="button-delete-selected-item"
                variant="secondary"
                onClick={() => handleOpenModalWithType('delete')}
                disabled={selectedItemsCount === 0}
              >
                {tRequestItemsTable('tableHeaderButtons.Delete')}
              </Button>
              <Button
                id="button-create-new-request-from-selected-items"
                variant="secondary"
                onClick={() => handleOpenModalWithType('createNew')}
                disabled={selectedItemsCount === 0}
              >
                {tRequestItemsTable('tableHeaderButtons.newRequestFromCurrentItem')}
              </Button>
            </div>
          </TableCell>
          <TableCell isHeader align="right" />
          <TableCell isHeader align="right" />
          <TableCell isHeader align="right" />
          <TableCell isHeader align="right" />
          <TableCell isHeader align="right" />
          <TableCell isHeader align="right" />
          <TableCell isHeader />
        </>
      </TableRow>
    </TableHead>
  );
};
