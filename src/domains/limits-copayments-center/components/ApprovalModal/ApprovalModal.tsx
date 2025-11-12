import { useTranslations } from 'next-intl';

import styles from './ApprovalModal.module.css';

import {
  Button,
  Input,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Textarea,
  Typography,
} from '@/design-system';

interface ApprovalModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  onClick: () => void;
  onChangeInputCurrency: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeExternal: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeInternal: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  demandedAmount: string;
}

export const ApprovalModal = ({
  isVisible,
  setIsVisible,
  onClick,
  onChangeExternal,
  onChangeInput,
  onChangeInputCurrency,
  onChangeInternal,
  demandedAmount,
}: ApprovalModalProps) => {
  const t = useTranslations('');

  return (
    <Modal
      isVisible={isVisible}
      title={t('ApprovalModal.title')}
      setIsVisible={setIsVisible}
      size="large"
      id={'modal-approval-modal'}
    >
      <div className={styles.container}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="Subtitle/Default/Regular">
                  {t('ApprovalModal.demandedAmount')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="Subtitle/Default/Regular">{demandedAmount} Kč</Typography>
              </TableCell>
            </TableRow>

            <TableRow className={styles.borders}>
              <TableCell>
                <Typography variant="Subtitle/Default/Regular">
                  {t('ApprovalModal.approvedAmount')}
                </Typography>
              </TableCell>
              <TableCell>
                <Input
                  currency="Kč"
                  type="number"
                  onChange={onChangeInputCurrency}
                  id="input-demanded-amount-approval-modal"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="Subtitle/Default/Regular">
                  {t('ApprovalModal.proceedingNumber')}
                </Typography>
              </TableCell>
              <TableCell>
                <Input onChange={onChangeInput} id="input-proceeding-number-approval-modal" />
              </TableCell>
            </TableRow>
            <TableRow className={styles.borders}>
              <TableCell>
                <Typography variant="Subtitle/Default/Regular">
                  {t('ApprovalModal.externalComment')}
                </Typography>
              </TableCell>
              <TableCell>
                <Textarea
                  onChange={onChangeExternal}
                  id="textarea-external-comment-approval-modal"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="Subtitle/Default/Regular">
                  {t('ApprovalModal.internalComment')}
                </Typography>
              </TableCell>
              <TableCell>
                <Textarea
                  onChange={onChangeInternal}
                  id="textarea-internal-comment-approval-modal"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className={styles.buttonGroup}>
          <Button
            variant="tertiary"
            id="button-cancel-approval-modal"
            onClick={() => setIsVisible(false)}
          >
            {t('common.close')}
          </Button>
          <Button id="button-reject-approval-modal" onClick={onClick}>
            {t('common.approve')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
