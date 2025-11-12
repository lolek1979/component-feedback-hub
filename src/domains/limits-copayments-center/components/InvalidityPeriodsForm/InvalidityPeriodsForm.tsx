'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { addDays, format, isValid } from 'date-fns';

import DeleteIcon from '@/core/assets/icons/delete_forever.svg';
import { Option } from '@/design-system/atoms/Select';

import styles from './InvalidityPeriodsForm.module.css';

import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  FieldLabel,
  Select,
  Typography,
} from '@/design-system';

interface InvalidityPeriod {
  id: string;
  recognizedFrom: Date | null;
  validUntil: Date | null;
  isOngoing: boolean;
  requiredLimit: string;
}

/**
 * Props for the {@link InvalidityPeriodsForm} component.
 *
 * @property initialPeriods - Initial invalidity periods to display.
 * @property submissionDate - Date when the form is submitted.
 * @property onPeriodsChange - Callback when periods data changes.
 * @property onSubmissionDateChange - Callback when submission date changes.
 */
interface InvalidityPeriodsFormProps {
  initialPeriods?: InvalidityPeriod[];
  submissionDate?: Date | null;
  onPeriodsChange?: (periods: InvalidityPeriod[]) => void;
  onSubmissionDateChange?: (date: Date | null) => void;
}

export const InvalidityPeriodsForm = ({
  initialPeriods = [],
  submissionDate: initialSubmissionDate = null,
  onPeriodsChange,
  onSubmissionDateChange,
}: InvalidityPeriodsFormProps) => {
  const t = useTranslations('InvalidityPeriodsForm');

  const [periods, setPeriods] = useState<InvalidityPeriod[]>(
    initialPeriods.length > 0
      ? initialPeriods
      : [
          {
            id: `period-${initialPeriods.length + 1}`,
            recognizedFrom: null,
            validUntil: null,
            isOngoing: false,
            requiredLimit: '',
          },
        ],
  );

  const [submissionDate, setSubmissionDate] = useState<Date | null>(initialSubmissionDate);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddPeriod = () => {
    const newPeriod: InvalidityPeriod = {
      id: `period-${periods.length + 1}`,
      recognizedFrom: null,
      validUntil: null,
      isOngoing: false,
      requiredLimit: '',
    };

    const updatedPeriods = [...periods, newPeriod];
    setPeriods(updatedPeriods);
    onPeriodsChange?.(updatedPeriods);
  };

  const handleRemovePeriod = (id: string) => {
    const periodIndex = periods.findIndex((p) => p.id === id);
    if (periodIndex === 0) return;

    const updatedPeriods = periods.filter((period) => period.id !== id);
    setPeriods(updatedPeriods);
    onPeriodsChange?.(updatedPeriods);

    const newErrors = { ...errors };
    delete newErrors[id];
    setErrors(newErrors);
  };

  const handlePeriodChange = (
    id: string,
    field: keyof InvalidityPeriod,
    value: Date | null | boolean | string,
  ) => {
    const updatedPeriods = periods.map((period) => {
      if (period.id === id) {
        const updatedPeriod = { ...period, [field]: value };

        if (field === 'isOngoing' && value === true) {
          updatedPeriod.validUntil = null;
        }

        return updatedPeriod;
      }

      return period;
    });

    setPeriods(updatedPeriods);
    onPeriodsChange?.(updatedPeriods);

    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const handleSubmissionDateChange = (date: Date | null) => {
    setSubmissionDate(date);
    onSubmissionDateChange?.(date);
  };

  const getSettlementDeadline = (): string => {
    if (!submissionDate || !isValid(submissionDate)) {
      return '';
    }

    const deadline = addDays(submissionDate, 30);

    return format(deadline, 'dd. MM. yyyy');
  };

  return (
    <div className={styles.container}>
      {/* Invalidity Section */}
      <div className={styles.section}>
        <Typography variant="Headline/Bold">{t('invaliditySectionTitle')}</Typography>

        <Typography variant="Body/Regular">{t('invaliditySectionDescription')}</Typography>

        {periods.map((period, index) => (
          <div key={period.id}>
            <div className={styles.periodRow}>
              <div className={`${styles.fieldGroup} ${styles.fieldGroupRecognizedFrom}`}>
                <FieldLabel
                  text={t('recognizedFromLabel')}
                  htmlFor={`recognized-from-${period.id}`}
                />
                <DatePicker
                  id={`recognized-from-${period.id}`}
                  initialDate={period.recognizedFrom}
                  onDateChange={(date) => handlePeriodChange(period.id, 'recognizedFrom', date)}
                  placeholder="DD. MM. RRRR"
                  hasPopoverCalendar
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.fieldGroupValidUntil}`}>
                <FieldLabel text={t('validUntilLabel')} htmlFor={`valid-until-${period.id}`} />
                <div className={styles.dateWithCheckbox}>
                  <label className={styles.checkboxLabel}>
                    <Checkbox
                      id={`ongoing-${period.id}`}
                      checked={period.isOngoing}
                      onChange={(e) => handlePeriodChange(period.id, 'isOngoing', e.target.checked)}
                    />
                    <Typography variant="Body/Regular" className={styles.checkboxText}>
                      {t('ongoingCheckboxLabel')}
                    </Typography>
                  </label>
                  <DatePicker
                    id={`valid-until-${period.id}`}
                    initialDate={period.validUntil}
                    onDateChange={(date) => handlePeriodChange(period.id, 'validUntil', date)}
                    placeholder="DD. MM. RRRR"
                    hasPopoverCalendar
                    disabled={period.isOngoing}
                  />
                </div>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fieldGroupRequiredLimit}`}>
                <FieldLabel
                  text={t('requiredLimitLabel')}
                  htmlFor={`required-limit-${period.id}`}
                />
                <Select
                  id={`required-limit-${period.id}`}
                  placeholder={t('requiredLimitPlaceholder')}
                  value={period.requiredLimit}
                  onChange={(value) => handlePeriodChange(period.id, 'requiredLimit', value)}
                >
                  <Option value="3-degree-invalid-reason">{t('limitOption3rdDegree')}</Option>
                  <Option value="2-degree-invalid">{t('limitOption2ndDegree')}</Option>
                  <Option value="1-degree-invalid">{t('limitOption1stDegree')}</Option>
                </Select>
              </div>

              {index > 0 && (
                <div className={styles.removeButtonWrapper}>
                  <Button
                    id="remove-period-button"
                    variant="unstyled"
                    onClick={() => handleRemovePeriod(period.id)}
                    ariaLabel={t('removeButtonAriaLabel')}
                  >
                    <DeleteIcon width={24} height={24} id="icon-delete-period" />
                  </Button>
                </div>
              )}
            </div>

            {errors[period.id] && (
              <div className={styles.errorMessage}>
                <Typography variant="Caption/Regular" className={styles.errorText}>
                  {errors[period.id]}
                </Typography>
              </div>
            )}
          </div>
        ))}

        <Button
          id="add-period-button"
          variant="secondary"
          size="medium"
          onClick={handleAddPeriod}
          className={styles.addButton}
        >
          {t('addPeriodButton')}
        </Button>
      </div>

      <Divider variant="subtle" />
      <div className={styles.section}>
        <Typography variant="Headline/Bold">{t('termsSectionTitle')}</Typography>

        <div className={styles.termsGrid}>
          <div className={`${styles.fieldGroup} ${styles.termsFieldSubmission}`}>
            <FieldLabel text={t('submissionDateLabel')} htmlFor="submission-date" required />
            <DatePicker
              id="submission-date"
              initialDate={submissionDate}
              onDateChange={handleSubmissionDateChange}
              placeholder="DD. MM. RRRR"
              hasPopoverCalendar
            />
          </div>

          <div className={`${styles.fieldGroup} ${styles.termsFieldDeadline}`}>
            <FieldLabel text={t('settlementDeadlineLabel')} htmlFor="settlement-deadline" />
            <div className={styles.readonlyField}>
              <Typography variant="Subtitle/Default/Regular">{getSettlementDeadline()}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
