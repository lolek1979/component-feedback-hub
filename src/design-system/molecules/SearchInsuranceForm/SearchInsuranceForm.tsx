'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import CloseIcon from '@/core/assets/icons/icon-close.svg';
import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { validateSocialSecurityNumber } from '@/core/utils/validateSSN';
import { FieldLabel, HelperText, Input, Spinner } from '@/design-system/atoms';

import styles from './SearchInsuranceForm.module.css';

/**
 * Props for the SearchInsuranceForm component.
 *
 * @property onSubmit - Callback when the form is submitted with the insurance number.
 * @property isSubmitting - Whether the form is in submitting/loading state.
 * @property setSsnNumber - Optional callback to set the SSN number externally.
 * @property label - Label for the input field.
 */
interface SearchInsuranceFormProps {
  onSubmit: (insuranceNum: string) => void;
  isSubmitting: boolean;
  setSsnNumber?: (insuranceNum: string) => void;
  label: string;
  placeholder?: string;
  isPayerNum?: boolean;
}

/**
 * SearchInsuranceForm component for entering and validating an insurance/social security number.
 *
 * Renders an input field with validation, clear and search icons, and helper messages.
 *
 * @param props SearchInsuranceFormProps
 * @returns React component
 */
export const SearchInsuranceForm = ({
  onSubmit,
  isSubmitting = false,
  setSsnNumber,
  label,
  placeholder,
  isPayerNum = false,
}: SearchInsuranceFormProps) => {
  const t = useTranslations('SearchInsuranceForm');
  const [isValid, setIsValid] = useState<boolean | null>(true);
  const [showValidation, setShowValidation] = useState<boolean>(true);
  const [insuranceNum, setInsuranceNum] = useState<string>('');
  const [isLegacyNumber, setIsLegacyNumber] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value.replace(/[^\d]/g, '').slice(0, 10);

    setInsuranceNum(value);
    setSsnNumber && setSsnNumber(value);
    setShowValidation(true);

    if (!value) {
      setIsValid(true);
      setIsLegacyNumber(false);

      return;
    }

    const year = parseInt(value.slice(0, 2));
    if (isPayerNum && value.length > 9) {
      setIsValid(true);
    } else if (value.length === 9) {
      const valid = validateSocialSecurityNumber(value);
      setIsValid(valid);
      setIsLegacyNumber(year <= 54);
    } else if (value.length === 10) {
      const valid = validateSocialSecurityNumber(value);
      setIsValid(valid);
      setIsLegacyNumber(false);
    } else {
      setIsValid(false);
      setIsLegacyNumber(false);
    }
  };

  const onSubmitForm = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isValid) {
      onSubmit(insuranceNum);
      setShowValidation(false);
    }
  };

  const BottomMessage = ({ className }: { className?: string }) => {
    if (!showValidation) return null;

    if (isPayerNum && insuranceNum.length > 0 && !isValid) {
      return (
        <HelperText
          id="message-search-length-error"
          text={t('lengthError')}
          variant="error"
          className={className}
        />
      );
    }

    if (isValid && isLegacyNumber && insuranceNum.length > 0 && !isPayerNum) {
      return (
        <div className={styles.messages}>
          <HelperText
            id="message-search-insurance-legacy"
            text={t('legacyNumberWarning')}
            variant="warning"
            className={className}
          />
          <HelperText
            id="message-search-insurance-success-1"
            text={t('successMessage')}
            variant="success"
            className={className}
          />
        </div>
      );
    }
    if (!isValid && insuranceNum.length > 0 && !isPayerNum) {
      return (
        <HelperText
          id="message-search-insurance-error"
          text={t('errorMessage')}
          variant="error"
          className={className}
        />
      );
    }
    if (isValid && insuranceNum.length > 0 && !isPayerNum) {
      return (
        <HelperText
          id="message-search-insurance-success-2"
          text={t('successMessage')}
          variant="success"
          className={className}
        />
      );
    }

    return null;
  };

  return (
    <form
      onSubmit={onSubmitForm}
      className={styles.insurence}
      data-testid="form"
      role="form"
      aria-label={t('formLabel')}
    >
      <FieldLabel text={label} htmlFor={'input-insurance-form-ssn'} />
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        id="input-insurance-form-ssn"
        placeholder={placeholder ?? t('placeholder')}
        value={insuranceNum}
        onChange={handleChange}
        disabled={isSubmitting}
        isError={!isValid}
        maxLength={10}
        ariaLabel={t('inputLabel')}
        icon={
          insuranceNum !== '' && (
            <CloseIcon
              id="icon-search-insurance-close"
              role="button"
              aria-label={t('clear')}
              onClick={() => {
                setInsuranceNum('');
                onSubmit('');
                setSsnNumber && setSsnNumber('');
              }}
              style={{ cursor: 'pointer' }}
            />
          )
        }
        secondaryIcon={
          isSubmitting ? (
            <Spinner width={24} height={24} />
          ) : (
            <SearchIcon
              id="icon-search-insurance-search"
              onClick={onSubmitForm}
              role="button"
              aria-label={t('search')}
            />
          )
        }
        iconAlign="right"
      />
      <div className={styles.bottomContainer}>
        <BottomMessage className={styles.bottomMessage} />
      </div>
    </form>
  );
};
