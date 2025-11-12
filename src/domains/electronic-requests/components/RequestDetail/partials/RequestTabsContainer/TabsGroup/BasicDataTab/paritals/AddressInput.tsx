import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from 'use-debounce';

import { useRequestCSCAddresses } from '@/domains/electronic-requests/api/query';
import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import styles from '../BasicDataTab.module.css';

import { Input, Option, RadioGroup, Select } from '@/design-system';

export const AddressInput = ({
  requestData,
  onUpdate,
}: {
  requestData: RequestDetailModel | null | undefined;
  onUpdate: (address: string) => void;
}) => {
  const t = useTranslations('requests.newRequestModal.fieldsLabels');
  const [addressValue, setAddressValue] = useState(requestData?.deliveryAddress || '');
  const [selectedInputType, setSelectedInputType] = useState<'select' | 'manual'>('select');
  const { data: addressesData } = useRequestCSCAddresses();

  const [debouncedAddress] = useDebounce(addressValue, 1000);

  const addressInputOptions = useMemo(
    () => [
      { value: 'select', label: t('selectAddressLabel') },
      { value: 'manual', label: t('inputAddressLabel') },
    ],
    [t],
  );

  useEffect(() => {
    if (selectedInputType === 'manual' && debouncedAddress !== requestData?.deliveryAddress) {
      onUpdate(debouncedAddress);
    }
  }, [debouncedAddress, selectedInputType, requestData?.deliveryAddress, onUpdate]);

  const handleManualAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressValue(e.target.value);
  }, []);

  const handleSelectAddressChange = useCallback(
    (value: string) => {
      setAddressValue(value);
      onUpdate(value);
    },
    [onUpdate],
  );

  const handleInputTypeChange = useCallback((value: string) => {
    setSelectedInputType(value as 'select' | 'manual');
  }, []);

  return (
    <div className={styles.inputContainer}>
      <RadioGroup
        options={addressInputOptions}
        name={'addressInputType'}
        onChange={handleInputTypeChange}
        defaultValue={selectedInputType}
        className={styles.radioGroup}
        horizontal
        id="radio-group-address-select"
      />

      {selectedInputType === 'manual' ? (
        <Input id="address" value={addressValue} onChange={handleManualAddressChange} width={493} />
      ) : (
        <Select
          id="request-select-address"
          value={addressValue}
          onChange={handleSelectAddressChange}
          width={493}
        >
          {addressesData?.payload.items.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.description}
            </Option>
          )) ?? (
            <Option key="loading" value="">
              Loading...
            </Option>
          )}
        </Select>
      )}
    </div>
  );
};
