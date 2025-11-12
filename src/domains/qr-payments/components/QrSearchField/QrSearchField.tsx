'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import IconCopy from '@/core/assets/icons/content_copy.svg';
import { SegmentedControl } from '@/design-system/atoms/SegmentedControl';
import { toast } from '@/design-system/molecules/Toast';

import { getClientInfo } from '../../api/services/getClientInfo';
import { getCompanyInfo, getCompanyInfoResponse } from '../../api/services/getCompanyInfo';
import { useClientStore } from '../../stores/clientStore';
import { usePaymentDetailsStore } from '../../stores/paymentStore';
import { Address } from '../InsurerInfo';
import styles from './QrSearchField.module.css';

import { Button, SearchInsuranceForm } from '@/design-system';

/**
 * Props for the QrSearchField component.
 */
export interface QrSearchFieldProps {
  /**
   * Sets the primary address.
   * @param add - Address object to set as primary.
   */
  setPrimAdress: (add: Address) => void;

  /**
   * Sets the secondary address.
   * @param add - Address object or undefined to clear.
   */
  setSecAdress: (add: Address | undefined) => void;

  /**
   * Indicates whether the form is currently submitting.
   */
  isSubmitting: boolean;

  /**
   * Sets the submitting state.
   * @param value - Boolean indicating submission status.
   */
  setIsSubmitting: (value: boolean) => void;
}

/**
 * Component for searching client or company information via QR code input.
 * Allows selection between individual (FO) and company (PO) search modes.
 *
 * @param setPrimAdress - Function to set the primary address.
 * @param setSecAdress - Function to set the secondary address.
 * @param isSubmitting - Boolean indicating if a submission is in progress.
 * @param setIsSubmitting - Function to update the submission state.
 */

export const QrSearchField = ({
  setPrimAdress,
  setSecAdress,
  isSubmitting,
  setIsSubmitting,
}: QrSearchFieldProps) => {
  const t = useTranslations('');
  const [ssn, setSsn] = useState('');
  const [selectedValue, setSelectedValue] = useState<'1' | '2'>('2');

  useEffect(() => {
    useClientStore.getState().setPayerType(selectedValue);
  }, [selectedValue]);

  const onSubmit = async (ssn: string) => {
    if (!ssn) return;
    const reset = { addressType: '', street: '', zip: '', houseNumber: null, city: '' };
    useClientStore.getState().resetStates();
    usePaymentDetailsStore.getState().resetStates();
    setPrimAdress(reset);
    setSecAdress(undefined);

    try {
      setIsSubmitting(true);

      if (selectedValue === '2') {
        const response = await getClientInfo({ ssn: ssn });
        useClientStore.getState().setInsurer({
          ssn: response.insuranceNumber,
          name: response.firstName + ' ' + response.lastName,
          addressType: '',
        });
        useClientStore.getState().setLocalOffice(response.localOffice);
        response.addresses.map((adress) => {
          if (
            adress.addressType === 'E' ||
            adress.addressType === 'B' ||
            response.addresses.length === 1
          ) {
            const add = {
              addressType: adress.addressType,
              street: adress.street,
              zip: adress.zip,
              houseNumber: adress.houseNumber,
              city: adress.city,
            };
            setPrimAdress(add);
          } else if (adress.addressType === 'A') {
            const add = {
              addressType: adress.addressType,
              street: adress.street,
              zip: adress.zip,
              houseNumber: adress.houseNumber,
              city: adress.city,
            };
            setSecAdress(add);
          }
        });
      } else {
        const response = await getCompanyInfo({ ico: ssn });
        const insurer = Array.isArray(response)
          ? (response.find((item) => item.role === '1') as getCompanyInfoResponse)
          : response;
        if (insurer) {
          useClientStore.getState().setInsurer({
            ssn: insurer.ico + insurer.orgUnit,
            name: insurer.businessName,
            addressType: '',
          });
          useClientStore.getState().setLocalOffice(insurer.localOffice);
          insurer.addresses.forEach((address: Address) => {
            const add = {
              addressType: address.addressType,
              street: address.street,
              zip: address.zip,
              houseNumber: address.houseNumber,
              city: address.city,
            };

            if (address.addressType === 'M1' || insurer.addresses.length === 1) {
              setPrimAdress(add);
            } else if (address.addressType === 'M2') {
              setSecAdress(add);
            }
          });
        }
      }
    } catch {
      toast.error(t('common.insuredPersonNotFound'));
    }
    setIsSubmitting(false);
    setSsn(ssn);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ssn);
      if (selectedValue === '2') {
        toast.success(t('common.copySsnMessage'), { id: `toast-qr-copy-sssn` });
      } else toast.success(t('common.copyIcoMessage'), { id: `toast-qr-copy-sssn` });
    } catch {
      toast.error(t('common.copySsnError'));
    }
  };
  const values = [
    [
      { label: t('QRCodes.fo'), value: '2' },
      { label: t('QRCodes.po'), value: '1' },
    ],
  ];

  return (
    <div className={styles.container}>
      <div className={styles.controlWrapper}>
        <SegmentedControl
          options={values}
          setSelectedValue={(item: string) => setSelectedValue(item as '1' | '2')}
        />
      </div>

      <div className={styles.searchContainer}>
        <div>
          <SearchInsuranceForm
            label={selectedValue === '2' ? t('QRCodes.labelFo') : t('QRCodes.labelPo')}
            placeholder={selectedValue === '2' ? t('QRCodes.labelFo') : t('QRCodes.labelPo')}
            setSsnNumber={setSsn}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isPayerNum
          />
        </div>
        <div>
          {ssn && (
            <Button
              id="button-qrsearch-search-ssn"
              variant="tertiary"
              size="medium"
              icon={<IconCopy width={24} height={24} id="icon-qrsearch-search-ssn" />}
              onClick={handleCopy}
            >
              {t('QRCodes.copySSN')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
