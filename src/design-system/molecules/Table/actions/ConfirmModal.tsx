import { useTranslations } from 'next-intl';

import { Button, Text } from '@/design-system/atoms';

import { Modal } from '../../Modal';
import styles from '../Table.module.css';
/**
 * Props for the ConfirmModal component.
 *
 * @property status - Current status or action type for the modal.
 * @property onConfirm - Callback when the confirm button is clicked.
 * @property onCancel - Callback when the cancel button is clicked.
 * @property isVisible - Controls modal visibility.
 * @property setIsVisible - Function to set modal visibility.
 * @property name - Name or label to display in the modal.
 * @property validFrom - Optional date for publishing actions.
 */
interface ConfirmModalProps {
  status: string;
  onConfirm: (index: number) => void;
  onCancel: () => void;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  name: string;
  validFrom?: string;
}

/**
 * Content mapping for modal titles, bodies, and button labels by status.
 *
 * @property title - Translation key for the modal title.
 * @property body - Translation key for the modal body.
 * @property button - Translation key for the confirm button.
 */
type ContentMapping = {
  title: string;
  body: string;
  button: string;
};

/**
 * ConfirmModal displays a modal dialog for confirming row/table actions.
 *
 * Shows dynamic title, body, and button text based on the action status.
 *
 * @param props ConfirmModalProps
 * @returns React component
 */
export const ConfirmModal = ({
  status,
  onConfirm,
  onCancel,
  isVisible,
  setIsVisible,
  name,
  validFrom,
}: ConfirmModalProps) => {
  const t = useTranslations('StatusRowActions');

  const contentMapping: { [key: string]: ContentMapping } = {
    Concept: { title: 'deleteHead', body: 'deleteBody', button: 'delete' },
    ConceptPublish: {
      title: 'PublishConceptHeader',
      body: 'PublishConceptBody',
      button: 'PublishButton',
    },
    ConceptSaveAndPublish: {
      title: 'PublishConceptHeader',
      body: 'PublishConceptBody',
      button: 'PublishButton',
    },
    Planned: { title: 'unPublishHead', body: 'unPublishBody', button: 'unPublishButton' },
    DeleteRow: { title: 'deleteRowHead', body: 'deleteRowBody', button: 'delete' },
    DeleteColumn: { title: 'deleteColumnHead', body: 'deleteColumnBody', button: 'delete' },
    SendForApproval: { title: 'approvalHead', body: 'approvalBody', button: 'send' },
    SendForRework: { title: 'reworkHead', body: 'reworkBody', button: 'return' },
    SaveAndSendForApproval: { title: 'approvalHead', body: 'approvalBody', button: 'send' },
  };

  const getTitle = (status: string) => {
    const key = contentMapping[status]?.title;
    if (!key) return 'Default Title';

    return t(key, { defaultMessage: 'Default Title' });
  };

  const getBody = (status: string) => {
    const key = contentMapping[status]?.body;
    if (!key) return 'Default Body';

    return t(key, { defaultMessage: 'Default Body' });
  };

  const getButton = (status: string) => {
    const key = contentMapping[status]?.button;
    if (!key) return 'Default Button';

    return t(key, { defaultMessage: 'Default Button' });
  };

  const getModalTitle = (status: string) => {
    if (!status) return 'Default Modal Title';

    switch (status) {
      case 'Concept':
        return `${getTitle(status)} ${name}?`;
      case 'ConceptPublish':
      case 'ConceptSaveAndPublish':
        return `${getTitle(status)} ${name} ${t('PublishConceptHeader2', { defaultMessage: '' })} ${
          validFrom ? new Date(validFrom).toLocaleDateString('cs-CZ') : ''
        }?`;
      case 'Planned':
      case 'DeleteRow':
      case 'DeleteColumn':
        return `${getTitle(status)} ${name}?`;

      case 'SendForApproval':
      case 'SaveAndSendForApproval':
      case 'SendForRework':
        return `${getTitle(status)}`;

      default:
        return 'Default Modal Title';
    }
  };

  return (
    <Modal
      id={status + '-modal'}
      title={getModalTitle(status)}
      size="medium"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
    >
      <Text variant={'body'}>{getBody(status)}</Text>
      <div className={styles.modalContent}>
        <Button id="button-confirm-modal-cancel" onClick={onCancel} variant="secondary">
          {t('cancel')}
        </Button>
        <Button id="button-confirm-modal-confirm" onClick={() => onConfirm(0)}>
          {getButton(status)}
        </Button>
      </div>
    </Modal>
  );
};
