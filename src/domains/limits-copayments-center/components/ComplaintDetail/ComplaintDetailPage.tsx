'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Divider } from '@/design-system/atoms';

import { COMPLAINT_HANDLERS, COMPLAINT_TYPES, useComplaintStore } from '../../stores/useComplaintStore';
import { ComplaintHeader } from '../ComplaintHeader';
import { ComplaintsStepper } from '../ComplaintsStepper';
import { ComplaintSubjectStep } from './steps/ComplaintSubjectStep/ComplaintSubjectStep';
import { ComplaintTypeStep } from './steps/ComplaintTypeStep/ComplaintTypeStep';
import { ConsentStep } from './steps/ConsentStep/ConsentStep';
import { GeneralComplaintForm } from './steps/GeneralComplaintForm';
import { PersonalInfoStep } from './steps/PeronalInfoStep/PersonalInfoStep';
import styles from './ComplaintDetailPage.module.css';
interface ComplaintDetailPageProps {
  complaintId: string;
}

export const ComplaintDetailPage = ({ complaintId }: ComplaintDetailPageProps) => {
  const t = useTranslations('KDPPage.complaintsTab');
  const router = useRouter();
  const { nextStep, previousStep, currentStep, formData } = useComplaintStore();

  // Mock data - replace with real data from API
  const mockUserData = {
    firstName: 'Jan',
    lastName: 'Novák',
    insuranceNum: '1202115678',
    limit: 5000,
    hasToPayTotal: 2500,
  };

  // Mock complaint data - replace with real data from API
  const mockComplaintData = {
    status: 'registered' as const,
    isDraft: true, // Change to true to show draft actions
  };

  const steps = [
    { label: 'Typ reklamace', isActive: currentStep === 0 },
    { label: 'Předmět reklamace', isActive: currentStep === 1 },
    { label: 'Osobní údaje', isActive: currentStep === 2 },
    { label: 'Souhlas pojištěnce', isActive: currentStep === 3 },
  ];

  const handleBreadcrumbClick = () => {
    router.back();
  };
  const handleReview = () => {
    //TODO: BE LOGIC
    if (formData.complaintHandler === COMPLAINT_HANDLERS.CLIENT_DESK ) {
      router.push(`${complaintId}/vyporadani`);
    } else {
      router.push('/limity-a-doplatky');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ComplaintTypeStep />;
      case 1:
        if (formData.complaintType === COMPLAINT_TYPES.GENERAL) {
          return (
            <GeneralComplaintForm
              onBack={previousStep}
              onContinue={(data) => {
                alert(JSON.stringify(data));
                nextStep();
              }}
            />
          );
        }

        return <ComplaintSubjectStep />;
      case 2:
        return <PersonalInfoStep />;
      case 3:
        return <ConsentStep />;
      default:
        return <ComplaintTypeStep />;
    }
  };

  return (
    <>
      {/* Result Header */}
      <div className={styles.resultHeaderContainer}>
        <ComplaintHeader
          complaintId={complaintId}
          insuranceNum={mockUserData.insuranceNum}
          showBreadcrumbs
          breadcrumbTitle={t('breadcrumbTitle')}
          onBreadcrumbClick={handleBreadcrumbClick}
          complaintStatus={mockComplaintData.status}
          isDraft={mockComplaintData.isDraft}
          onApprove={() => console.warn('Approve')}
          onRequestOpinion={() => console.warn('Request Opinion')}
          onReject={() => console.warn('Reject')}
          onSubmitForReview={handleReview}
          onCancel={() => router.back()}
          currentStep={currentStep}
        />
      </div>
      <Divider />

      {/* Content */}
      <div className={styles.contentContainer}>
        <ComplaintsStepper steps={steps} />
        {renderStepContent()}
      </div>
    </>
  );
};
