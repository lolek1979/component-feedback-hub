'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Divider, Textarea } from '@/design-system/atoms';
import { Modal, RadioGroup, Typography } from '@/design-system/molecules';

import styles from './OpinionModal.module.css';

export const OpinionRecipientEnum = {
  OZP_UZP: 'ozp-uzp',
  OPSP: 'opsp',
} as const;

export type OpinionRecipient = (typeof OpinionRecipientEnum)[keyof typeof OpinionRecipientEnum];

interface OpinionModalProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onSubmit?: (data: OpinionFormData) => void;
}

export interface OpinionFormData {
  recipient: OpinionRecipient;
  message: string;
}

export const OpinionModal = ({ isVisible, setIsVisible, onSubmit }: OpinionModalProps) => {
  const t = useTranslations('KDPPage.opinionTab');
  const [recipient, setRecipient] = useState<OpinionRecipient>(OpinionRecipientEnum.OZP_UZP);
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const formData: OpinionFormData = {
      recipient,
      message,
    };

    onSubmit?.(formData);
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const radioOptions = [
    { value: OpinionRecipientEnum.OZP_UZP, label: t('ozpUzp') },
    { value: OpinionRecipientEnum.OPSP, label: t('opsp') },
  ];

  return (
    <Modal
      id="modal-opinion"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      title={t('modalTitle')}
      size="large"
      closeOnEsc
      closeOnOverlayClick
    >
      <div className={styles.modalContent}>
        <div className={styles.radioSection}>
          <Typography variant="Subtitle/Default/Regular" className={styles.sectionLabel}>
            {t('recipientLabel')}
          </Typography>

          <div className={styles.radioGroupWrapper}>
            <RadioGroup
              id="radio-opinion"
              name="opinionRecipient"
              options={radioOptions}
              value={recipient}
              onChange={(value) => setRecipient(value as OpinionRecipient)}
              ariaLabel={t('recipientLabel')}
              className={styles.radioGroupCustom}
            />
          </div>
        </div>

        <Divider variant="dotted" />

        <div className={styles.textareaRow}>
          <Typography variant="Subtitle/Default/Regular" className={styles.textareaLabel}>
            {t('messageLabel')}
          </Typography>
          <Textarea
            id="textarea-opinion-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('messagePlaceholder')}
            rows={5}
          />
        </div>

        <div className={styles.actions}>
          <Button id="button-opinion-cancel" variant="secondary" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button id="button-opinion-submit" variant="primary" onClick={handleSubmit}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
