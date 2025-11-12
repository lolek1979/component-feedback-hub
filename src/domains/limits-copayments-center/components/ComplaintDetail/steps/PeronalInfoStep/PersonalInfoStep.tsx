import { useTranslations } from 'next-intl';

import { Button } from '@/design-system/atoms';
import { useUserInfoStore } from '@/domains/limits-copayments-center/stores';

import { communicationAddressType, useComplaintStore } from '../../../../stores/useComplaintStore';
import { ClientTable } from '../../../ClientTable';
import { FormActionCard } from '../../../FormActionCard';
import { RadioGroupSection } from '../../../RadioGroupSection';
import styles from './PersonalInfoStep.module.css';

export const PersonalInfoStep = () => {
  const t = useTranslations('KDPPage.PersonalStep');
  const { formData, nextStep, previousStep } = useComplaintStore();
  const { userInfo, applicant } = useUserInfoStore();

  const handleContinue = () => {
    nextStep();
  };
  const handlePrevious = () => {
    previousStep();
  };
  const communicationLabels = [
    { label: t('address'), value: 'address' },
    { label: t('dataBox'), value: 'dataBox' },
  ];

  return (
    <div className={styles.stepContainer}>
      {userInfo && (
        <ClientTable
          data={{
            firstName: userInfo.userData.firstName,
            surname: userInfo.userData.lastName,
            applicant: applicant,
            mobilePhone: userInfo.userData.phones.find((phone) => phone.primary)?.number ?? '',
            countryCode: userInfo.userData.phones.find((phone) => phone.primary)?.country ?? '',
            email: userInfo?.userData?.emails?.find((email) => email.primary)?.address ?? '-',
            bankAccount: {
              accountNumber: userInfo?.userData?.bankAccounts[0]?.accountNumber ?? ' ',
              bankCode: userInfo?.userData?.bankAccounts[0]?.bankCode ?? ' ',
            },
            address: {
              street: userInfo.userData.addresses.find((address) => address.primary)?.street ?? '-',
              city: userInfo.userData.addresses.find((address) => address.primary)?.city ?? '-',
              zip: userInfo.userData.addresses.find((address) => address.primary)?.zip ?? '-',
              houseNumber:
                userInfo.userData.addresses.find((address) => address.primary)?.houseNumber ?? '',
            },
            dataBox: userInfo?.userData?.dataBoxes?.find((data) => data.primary)?.idDS ?? '-',
          }}
        />
      )}

      <div>
        <FormActionCard
          title={t('reloadTitle')}
          description={t('reloadDescription')}
          buttonLabel={t('reloadBtn')}
          onClick={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>

      <div>
        <RadioGroupSection
          title={t('comsTitle')}
          description={t('comsDescription')}
          radioButton={communicationLabels}
          value={formData.communicationAddress}
          radioName={'communication'}
          onChange={(e) =>
            useComplaintStore.getState().setCommunicationAdress(e as communicationAddressType)
          }
        />
      </div>

      <div className={styles.btnGroup}>
        <Button
          id="button-complaint-back"
          variant="secondary"
          onClick={handlePrevious}
          className={styles.continueButton}
        >
          {t('back')}
        </Button>
        <Button
          id="button-complaint-continue"
          variant="primary"
          onClick={handleContinue}
          disabled={!formData.complaintType}
          className={styles.continueButton}
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  );
};
