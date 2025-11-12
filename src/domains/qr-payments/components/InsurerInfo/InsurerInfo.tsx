'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Divider, Text } from '@/design-system/atoms';

import { useClientStore } from '../../stores/clientStore';
import ClientInfoCard from './partials/ClientInfoCard';
import styles from './InsurerInfo.module.css';

/**
 * Represents an address used for the insurer.
 */
export type Address = {
  /**
   * Type of the address (e.g., permanent, mailing).
   */
  addressType: string;

  /**
   * Street name.
   */
  street: string;

  /**
   * ZIP/postal code.
   */
  zip: string;

  /**
   * City name.
   */
  city: string;

  /**
   * House number (optional).
   */
  houseNumber?: string | null;
};

/**
 * Props for the `InsurerInfo` component.
 */
interface InsurerInfoProps {
  /**
   * Permanent address of the insurer.
   */
  permAdress: Address;

  /**
   * Optional mailing address of the insurer.
   */
  mailAdress?: Address;
}

/**
 * Displays insurer information including name, SSN, and address selection.
 * Allows toggling between permanent and mailing address if both are provided.
 *
 * @param permAdress - The permanent address of the insurer.
 * @param mailAdress - Optional mailing address of the insurer.
 * @returns A React component rendering insurer details and address selection.
 */
export const InsurerInfo = ({ permAdress, mailAdress }: InsurerInfoProps) => {
  const t = useTranslations('QRCodes.InsurerInfo');
  const clientName = useClientStore((state) => state.insurer.name);
  const insuranceNum = useClientStore((state) => state.insurer.ssn);

  const [selectedAdress, setSelectedAddress] = useState<'perm' | 'mail'>(
    mailAdress ? 'mail' : 'perm',
  );

  /**
   * Constructs the insurer info object for the store.
   *
   * @param adress - The selected address.
   * @returns An object containing insurer details.
   */
  const getInsurerInfo = useCallback(
    (adress: Address) => {
      return {
        ssn: insuranceNum,
        name: clientName,
        addressType: adress.addressType,
      };
    },
    [clientName, insuranceNum],
  );

  useEffect(() => {
    const selectedAddressData = selectedAdress === 'perm' ? permAdress : mailAdress;

    if (selectedAddressData) {
      useClientStore.getState().setInsurer(getInsurerInfo(selectedAddressData));
    }
  }, [selectedAdress, permAdress, mailAdress, getInsurerInfo]);

  return (
    <div className={styles.container}>
      <Divider variant="subtle" />
      <div>
        <Text variant="headline">{clientName}</Text>
        <Text variant="subtitle">
          {useClientStore.getState().payerType === '2' ? t('ssn') : t('ico')}
          {insuranceNum}
        </Text>
      </div>
      <div className={styles.cardContainer}>
        <ClientInfoCard
          adress={permAdress}
          selected={selectedAdress === 'perm'}
          radioName="insurer-address"
          radioId="radio-insurerinfo-perm-adress"
          radioLabel={t('permanentAddress')}
          onRadioChange={() => setSelectedAddress('perm')}
        />
        {mailAdress && (
          <ClientInfoCard
            selected={selectedAdress === 'mail'}
            adress={mailAdress}
            radioName="insurer-address"
            radioId="radio-insurerinfo-mail-adress"
            radioLabel={t('mailAdress')}
            onRadioChange={() => setSelectedAddress('mail')}
          />
        )}
      </div>
    </div>
  );
};
