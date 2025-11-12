'use client';

import { useTranslations } from 'next-intl';

import { Button, Text } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';

import styles from './KdpModalTooltip.module.css';

interface KdpModalTooltipProps {
  isModalOpen: boolean;
  setIsModalOpen: (isVisible: boolean) => void;
}

export const KdpModalTooltip = ({ isModalOpen, setIsModalOpen }: KdpModalTooltipProps) => {
  const t = useTranslations('common');
  const tModal = useTranslations('KDPModal');

  return (
    <Modal
      id="cld-modal-tooltip"
      title={tModal('title')}
      size="large"
      isVisible={isModalOpen}
      setIsVisible={setIsModalOpen}
    >
      <div className={styles.kdpModalContent}>
        <Text variant="subtitle" regular tabIndex={0}>
          {tModal.rich('description', { b: (chunks) => <b>{chunks}</b> })}
        </Text>

        <Text variant="body" tabIndex={0}>
          {tModal('subtitle')}
        </Text>

        <ul className={styles.list} tabIndex={0}>
          <li>
            <Text variant="subtitle" regular>
              {tModal.rich('listItem1', { b: (chunks) => <b>{chunks}</b> })}
            </Text>
          </li>
          <li>
            <Text variant="subtitle" regular>
              {tModal.rich('listItem2', { b: (chunks) => <b>{chunks}</b> })}
            </Text>
          </li>
          <li>
            <Text variant="subtitle" regular>
              {tModal.rich('listItem3', { b: (chunks) => <b>{chunks}</b> })}
            </Text>
          </li>
          <li>
            <Text variant="subtitle" regular>
              {tModal.rich('listItem4', { b: (chunks) => <b>{chunks}</b> })}
            </Text>
          </li>
        </ul>
        <div className={styles.bottomContent}>
          <Button
            id="button-modal-toolip-cancel"
            autoFocus
            tabIndex={0}
            onClick={() => setIsModalOpen(false)}
            className={styles.closeBtn}
          >
            {t('cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
