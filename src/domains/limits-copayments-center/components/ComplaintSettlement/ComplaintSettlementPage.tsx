'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Divider, FieldLabel, Input, Textarea } from '@/design-system/atoms';

import { useUserInfo } from '../../stores';
import {
  COMPLAINT_TYPES,
  settlementResultType,
  useComplaintStore,
} from '../../stores/useComplaintStore';
import { ComplaintHeader } from '../ComplaintHeader';
import { FormActionCard } from '../FormActionCard';
import { RadioGroupSection } from '../RadioGroupSection';
import { ReferenceNumberSection } from '../ReferenceNumberSection';
import styles from './ComplaintSettlementPage.module.css';

import { Typography } from '@/design-system';

interface ComplaintSettlementPageProps {
  complaintId: string;
}

export const ComplaintSettlementPage = ({ complaintId }: ComplaintSettlementPageProps) => {
  const t = useTranslations('KDPPage');
  const router = useRouter();
  const formData = useComplaintStore((state) => state.formData);
  const {
    currentStep,
    setSettlement,
    setSettlementResult,
    setExternalComment,
    setInternalComment,
  } = useComplaintStore();
  const { insuranceNumber } = useUserInfo();

  // Mock complaint data - replace with real data from API
  const mockComplaintData = {
    status: 'registered' as const,
    isDraft: true, // Change to true to show draft actions
  };

  const handleBreadcrumbClick = () => {
    router.back();
  };
  const settlementResult = [
    { label: t('settlementPage.radioApproved'), value: 'approved' },
    { label: t('settlementPage.radioDenied'), value: 'denied' },
  ];
  const handleSend = () => {
    console.warn('Implement BE SEND');
  };

  return (
    <>
      {/* Result Header */}
      <div className={styles.resultHeaderContainer}>
        <ComplaintHeader
          complaintId={complaintId}
          insuranceNum={insuranceNumber ?? ''}
          showBreadcrumbs
          breadcrumbTitle={t('complaintsTab.breadcrumbTitle')}
          onBreadcrumbClick={handleBreadcrumbClick}
          complaintStatus={mockComplaintData.status}
          isDraft={mockComplaintData.isDraft}
          onSubmitForReview={handleSend}
          onCancel={() => router.back()}
          currentStep={currentStep}
          kliprSettlement
        />
      </div>
      <Divider />
      <div className={styles.contentContainer}>
        <RadioGroupSection
          title={t('settlementPage.radioTitle')}
          description={t('settlementPage.radioDescription')}
          radioButton={settlementResult}
          value={formData.settlementResult}
          radioName={'settlementResult'}
          onChange={(value) => setSettlementResult(value as settlementResultType)}
          className={styles.padding}
        />
        <div>
          <FieldLabel text={t('settlementPage.inputLabel')} htmlFor={'input-settlement-amount'} />
          <Input
            disabled={
              formData.complaintType === COMPLAINT_TYPES.INVALID ||
              formData.complaintType === COMPLAINT_TYPES.INSURED_NUMBER_CHANGE
            }
            value={formData.settlement}
            onChange={(e) => setSettlement(e.target.value)}
            currency="Kč"
            type="number"
            id="input-settlement-amount"
          />
        </div>
        <div className={styles.textareaField}>
          <Textarea
            label={t('settlementPage.externalLabel')}
            helperText={t('settlementPage.helperExternal')}
            value={formData.externalComment}
            onChange={(e) => setExternalComment(e.target.value)}
            maxLength={100}
            id="textarea-external-comment"
          />
        </div>
        <div className={styles.textareaField}>
          <Textarea
            label={t('settlementPage.internalLabel')}
            helperText={t('settlementPage.helperInternal')}
            onChange={(e) => setInternalComment(e.target.value)}
            value={formData.internalComment}
            maxLength={100}
            id="textarea-internal-comment"
          />
        </div>
        <Divider variant="subtle" />
        <div>
          <FormActionCard
            variant="secondary"
            title={t('settlementPage.printTitle')}
            description={t('settlementPage.printDescription')}
            buttonLabel={t('settlementPage.printBtn')}
            onClick={() => console.warn('TODO OnClick')}
          />
        </div>
        <Divider variant="subtle" />
        <div>
          <ReferenceNumberSection />
        </div>
        {formData.referenceNumber && (
          <Typography variant="Body/Regular">{t('settlementPage.bottomText')}</Typography>
        )}
      </div>
    </>
  );
};
