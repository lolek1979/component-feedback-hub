'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { Button, Divider, Input } from '@/design-system/atoms';
import { Modal, RadioGroup, Typography } from '@/design-system/molecules';

import { APPLICANT_NAME_REGEX } from '../../services/utils';
import { useUserInfoStore } from '../../stores';
import styles from './ComplaintsModal.module.css';

const COMPLAINT_TYPE = {
  INSURED: 'insured',
  LEGAL_REPRESENTATIVE: 'legal-representative',
  AUTHORIZED_PERSON: 'authorized-person',
  COURT_APPOINTED_GUARDIAN: 'court-appointed-guardian',
} as const;

type ComplaintType = (typeof COMPLAINT_TYPE)[keyof typeof COMPLAINT_TYPE];

interface ComplaintsModalProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onSubmit?: (data: ComplaintFormData) => void;
}

export interface ComplaintFormData {
  complaintType: ComplaintType;
  applicantName?: string;
}

export const ComplaintsModal = ({ isVisible, setIsVisible, onSubmit }: ComplaintsModalProps) => {
  const t = useTranslations('KDPPage.complaintsTab');
  const router = useRouter();
  const [complaintType, setComplaintType] = useState<ComplaintType>(COMPLAINT_TYPE.INSURED);
  const [applicantName, setApplicantName] = useState('');
  const { setApplicant, userInfo } = useUserInfoStore();

  const handleApplicantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const processedValue = value.replace(APPLICANT_NAME_REGEX, '');
    setApplicantName(processedValue);
    setApplicant(processedValue);
  };

  const handleSubmit = () => {
    if (!showApplicantNameField && userInfo) {
      setApplicant(userInfo.userData.firstName + ' ' + userInfo.userData.lastName);
    }
    const formData: ComplaintFormData = {
      complaintType,
      ...(complaintType !== COMPLAINT_TYPE.INSURED && { applicantName }),
    };

    onSubmit?.(formData);
    setIsVisible(false);

    const complaintId = `RCLD-${Date.now()}`;
    router.push(`/limity-a-doplatky/reklamace/${complaintId}`);
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const showApplicantNameField =
    complaintType === COMPLAINT_TYPE.LEGAL_REPRESENTATIVE ||
    complaintType === COMPLAINT_TYPE.AUTHORIZED_PERSON ||
    complaintType === COMPLAINT_TYPE.COURT_APPOINTED_GUARDIAN;

  const radioOptions = [
    { value: COMPLAINT_TYPE.INSURED, label: t('insuredPerson') },
    { value: COMPLAINT_TYPE.LEGAL_REPRESENTATIVE, label: t('legalRepresentative') },
    { value: COMPLAINT_TYPE.AUTHORIZED_PERSON, label: t('authorizedPerson') },
    { value: COMPLAINT_TYPE.COURT_APPOINTED_GUARDIAN, label: t('courtAppointedGuardian') },
  ];

  return (
    <Modal
      id="modal-complaints"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      title={t('modalTitle')}
      size="large"
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <div className={styles.modalContent}>
        <div className={clsx(styles.contentRow, styles.radioSection)}>
          <Typography variant="Subtitle/Default/Regular" className={styles.sectionLabel}>
            {t('whoSubmitsComplaint')}
          </Typography>

          <div className={styles.radioGroupWrapper}>
            <RadioGroup
              id="radio-complaints"
              name="complaintType"
              options={radioOptions}
              value={complaintType}
              onChange={(value) => setComplaintType(value as ComplaintType)}
              ariaLabel={t('whoSubmitsComplaint')}
              className={styles.radioGroupCustom}
            />
          </div>
        </div>

        {showApplicantNameField && (
          <>
            <Divider variant="dotted" className={styles.dividerSpacing} />
            <div className={clsx(styles.contentRow, styles.inputRow)}>
              <Typography variant="Subtitle/Default/Regular" className={styles.inputLabel}>
                {t('applicantNameLabel')}
              </Typography>
              <Input
                id="input-complaints-applicant-name"
                type="text"
                value={applicantName}
                onChange={handleApplicantNameChange}
                placeholder={t('applicantNamePlaceholder')}
                inputSize="medium"
                maxLength={50}
              />
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Button id="button-complaints-cancel" variant="secondary" onClick={handleCancel}>
            {t('cancel')}
          </Button>
          <Button id="button-complaints-submit" variant="primary" onClick={handleSubmit}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
