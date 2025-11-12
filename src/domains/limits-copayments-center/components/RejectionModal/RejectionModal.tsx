import { useTranslations } from 'next-intl';

import styles from './RejectionModal.module.css';

import {
  Button,
  Input,
  Modal,
  Table,
  TableCell,
  TableRow,
  Textarea,
  Typography,
} from '@/design-system';

interface RejectionModalProps {
  isVisible: boolean;
  setIsVisible: (bool: boolean) => void;
  onClick: () => void;
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeExternal: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeInternal: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const RejectionModal = ({
  isVisible,
  setIsVisible,
  onClick,
  onChangeExternal,
  onChangeInput,
  onChangeInternal,
}: RejectionModalProps) => {
  const t = useTranslations('');

  return (
    <Modal
      size="large"
      title={t('RejectionModal.title')}
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      id={'rejection-modal'}
    >
      <div className={styles.container}>
        <Table>
          <TableRow>
            <TableCell>
              <Typography variant="Subtitle/Default/Regular">
                {t('RejectionModal.proceedingNumber')}
              </Typography>
            </TableCell>

            <TableCell>
              <Input onChange={onChangeInput} id="input-proceeding-number-rejection-modal" />
            </TableCell>
          </TableRow>

          <TableRow className={styles.borders}>
            <TableCell>
              <Typography variant="Subtitle/Default/Regular">
                {t('RejectionModal.externalComment')}
              </Typography>
            </TableCell>

            <TableCell>
              <Textarea
                onChange={onChangeExternal}
                id="textarea-external-comment-rejection-modal"
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography variant="Subtitle/Default/Regular">
                {t('RejectionModal.internalComment')}
              </Typography>
            </TableCell>

            <TableCell>
              <Textarea
                onChange={onChangeInternal}
                id="textarea-internal-comment-rejection-modal"
              />
            </TableCell>
          </TableRow>
        </Table>

        <div className={styles.buttonGroup}>
          <Button
            variant="tertiary"
            id="button-cancel-rejection-modal"
            onClick={() => setIsVisible(false)}
          >
            {t('common.close')}
          </Button>
          <Button id="button-reject-rejection-modal" onClick={onClick}>
            {t('common.reject')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
