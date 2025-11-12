'use client';

import React, { useEffect, useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { parseAsBoolean, parseAsFloat, useQueryState } from 'nuqs';

import IOpenInNew from '@/core/assets/icons/open_in_new.svg';
import { Button, Checkbox, FieldLabel, Input, Text } from '@/design-system/atoms';
import { Modal } from '@/design-system/molecules';

import styles from './AdminProcessPenaltyCalculationModal.module.css';

interface AdminProcessPenaltyCalculationModalProps {
  insuranceDebt: number;
  penaltyDebt: number;
}

export const AdminProcessPenaltyCalculationModal = (
  props: AdminProcessPenaltyCalculationModalProps,
) => {
  const { penaltyDebt } = props;
  const format = useFormatter();
  const t = useTranslations('administrativeProceedings.penaltyCalculationModal');
  const [isModalOpen, setIsModalOpen] = useQueryState(
    'penaltyCalculation',
    parseAsBoolean.withDefault(false),
  );

  const [, setCalculatedWaivedAmount] = useQueryState('waivedAmount', parseAsFloat.withDefault(0));

  const [diffVariableSymbolChecked, setDiffVariableSymbolChecked] = useState<boolean>(false);
  const [diffVariableSymbolValue, setDiffVariableSymbolValue] = useState<number>(0);
  const [diffVariableSymbolPercentage, setDiffVariableSymbolPercentage] = useState<number>(0);

  const [overpaymentRefundChecked, setOverpaymentRefundChecked] = useState<boolean>(false);
  const [overpaymentRefundValue, setOverpaymentRefundValue] = useState<number>(0);
  const [overpaymentRefundPercentage, setOverpaymentRefundPercentage] = useState<number>(0);

  const [crimeCommittedChecked, setCrimeCommittedChecked] = useState<boolean>(false);
  const [crimeCommittedPercentage, setCrimeCommittedPercentage] = useState<number>(
    crimeCommittedChecked ? 50 : 0,
  );

  const [penaltyAfterPriorityWaiver, setPenaltyAfterPriorityWaiver] = useState<number>(penaltyDebt);
  const [priorityWaiverPercentageSum, setPriorityWaiverPercentageSum] = useState<number>(0);
  /**
   * In POC1 we do not have editable basic and reducer waiver parts, so it will always be 0
   * In the future, this will be editable and calculated based on user input so it should be switch to useState
   */
  const basicWaiverPercentageSum = 0;
  const reducedWaiverPercentageSum = 0;
  const [penaltyAfterPriorityAndBasicWaiver, setPenaltyAfterPriorityAndBasicWaiver] =
    useState<number>(penaltyDebt);
  const [resultingPenalty, setResultingPenalty] = useState<number>(penaltyDebt);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDiffVariableSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setDiffVariableSymbolValue(value);
    if (value < 0 || penaltyDebt === 0) {
      setDiffVariableSymbolValue(0);
      setDiffVariableSymbolPercentage(0);

      return;
    }
    if (value > penaltyDebt) {
      setDiffVariableSymbolValue(penaltyDebt);
      setDiffVariableSymbolPercentage(100);

      return;
    }

    setDiffVariableSymbolPercentage((value / penaltyDebt) * 100);
  };

  const handleOverpaymentRefundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setOverpaymentRefundValue(value);
    if (value < 0 || penaltyDebt === 0) {
      setOverpaymentRefundValue(0);
      setOverpaymentRefundPercentage(0);

      return;
    }
    if (value > penaltyDebt) {
      setOverpaymentRefundValue(penaltyDebt);
      setOverpaymentRefundPercentage(100);

      return;
    }

    setOverpaymentRefundPercentage((value / penaltyDebt) * 100);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const waivedAmount = parseFloat((penaltyDebt - Math.ceil(resultingPenalty)).toFixed(4));
    setCalculatedWaivedAmount(waivedAmount).then(() => {
      handleCloseModal();
    });
  };

  useEffect(() => {
    if (crimeCommittedChecked) {
      setCrimeCommittedPercentage(50);
    } else {
      setCrimeCommittedPercentage(0);
    }
  }, [crimeCommittedChecked]);

  useEffect(() => {
    let priorityWaiverTotalPercentage =
      diffVariableSymbolPercentage + overpaymentRefundPercentage + crimeCommittedPercentage;

    if (priorityWaiverTotalPercentage > 100) {
      priorityWaiverTotalPercentage = 100;
    }

    const waivedAmount = penaltyDebt * (priorityWaiverTotalPercentage / 100);
    const newPenaltyDebt = penaltyDebt - waivedAmount;
    setPriorityWaiverPercentageSum(priorityWaiverTotalPercentage);
    setPenaltyAfterPriorityWaiver(newPenaltyDebt);
  }, [
    diffVariableSymbolPercentage,
    overpaymentRefundPercentage,
    crimeCommittedPercentage,
    penaltyDebt,
  ]);

  useEffect(() => {
    const waivedAmount = penaltyAfterPriorityWaiver * (basicWaiverPercentageSum / 100);
    const newDebt = penaltyAfterPriorityWaiver - waivedAmount;
    setPenaltyAfterPriorityAndBasicWaiver(newDebt);
  }, [penaltyAfterPriorityWaiver, basicWaiverPercentageSum]);

  useEffect(() => {
    const waivedAmount = penaltyAfterPriorityAndBasicWaiver * (reducedWaiverPercentageSum / 100);
    const newDebt = penaltyAfterPriorityAndBasicWaiver - waivedAmount;
    setResultingPenalty(newDebt);
  }, [penaltyAfterPriorityAndBasicWaiver, reducedWaiverPercentageSum]);

  return (
    <>
      <Button
        id="draft-control-OT-decision-calculation"
        variant="secondary"
        icon={<IOpenInNew id="icon-control-OT-decision-calculation" />}
        onClick={handleOpenModal}
      >
        {t('buttonTitle')}
      </Button>

      <Modal
        id="createNewAdminProcess-modal"
        title={t('title')}
        size="xlarge"
        isVisible={isModalOpen}
        setIsVisible={setIsModalOpen}
        closeOnEsc={true}
        onClose={handleCloseModal}
      >
        <form className={styles.penaltyCalculationForm} onSubmit={(e) => handleFormSubmit(e)}>
          <table className={styles.overviewTable}>
            <thead>
              <tr>
                <th>
                  <Text variant="subtitle">{t('prescribedPenalty')}</Text>
                </th>
                <th>
                  <Text variant="subtitle">
                    {format.number(penaltyDebt, {
                      style: 'currency',
                      currency: 'CZK',
                      maximumFractionDigits: penaltyDebt % 1 !== 0 ? 2 : 0,
                    })}
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div>
                    <Text variant="subtitle" regular>
                      {t('penaltyAfterPriorityWaiver')}{' '}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" regular>
                      {t('priorityWaiver')}{' '}
                    </Text>
                  </div>
                </td>
                <td>
                  <div>
                    <Text variant="subtitle">
                      {format.number(penaltyAfterPriorityWaiver, {
                        style: 'currency',
                        currency: 'CZK',
                        maximumFractionDigits: penaltyAfterPriorityWaiver % 1 !== 0 ? 2 : 0,
                      })}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" regular>
                      {format.number(priorityWaiverPercentageSum / 100, {
                        style: 'percent',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                      })}
                    </Text>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <Text variant="subtitle" regular>
                      {t('penaltyAfterPriorityAndBasicWaiver')}{' '}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" regular>
                      {t('basicWaiver')}
                    </Text>
                  </div>
                </td>
                <td>
                  <div>
                    <Text variant="subtitle">
                      {format.number(penaltyAfterPriorityAndBasicWaiver, {
                        style: 'currency',
                        currency: 'CZK',
                        maximumFractionDigits: penaltyAfterPriorityAndBasicWaiver % 1 !== 0 ? 2 : 0,
                      })}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption">
                      {format.number(basicWaiverPercentageSum / 100, {
                        style: 'percent',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                      })}
                    </Text>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <Text variant="subtitle" regular>
                      {t('resultingPenaltyToBePaid')}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption" regular>
                      {t('reducedWaiver')}
                    </Text>
                  </div>
                </td>
                <td>
                  <div>
                    <Text variant="subtitle">
                      {format.number(resultingPenalty, {
                        style: 'currency',
                        currency: 'CZK',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                      })}
                    </Text>
                  </div>
                  <div>
                    <Text variant="caption">
                      {format.number(reducedWaiverPercentageSum / 100, {
                        style: 'percent',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0,
                      })}
                    </Text>
                  </div>
                </td>
              </tr>
              <tr className={styles.summaryRow}>
                <th>
                  <Text variant="subtitle">{t('waivedAmount')}</Text>
                </th>
                <th>
                  <Text variant="subtitle">
                    {format.number(penaltyDebt - resultingPenalty, {
                      style: 'currency',
                      currency: 'CZK',
                      maximumFractionDigits: (penaltyDebt - resultingPenalty) % 1 !== 0 ? 2 : 0,
                    })}
                  </Text>
                </th>
              </tr>
            </tbody>
          </table>

          <table className={styles.calculationTable}>
            <thead>
              <tr>
                <th colSpan={2}>
                  <div>
                    <Text variant="subtitle">{t('selectReasons')}</Text>
                  </div>
                  <div className={styles.subheading}>
                    <Text variant="caption" regular>
                      {t('selectReasonsDescription')}
                    </Text>
                  </div>
                </th>
                <th>
                  <div>
                    {' '}
                    <Text variant="subtitle">{t('amount')}</Text>
                  </div>
                </th>
                <th>
                  <div>
                    {' '}
                    <Text variant="subtitle">{t('rate')}</Text>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Checkbox
                    id="checkbox-differrent-variable-symbol"
                    checked={diffVariableSymbolChecked}
                    onChange={() => setDiffVariableSymbolChecked((prev) => !prev)}
                  />
                </td>
                <td>
                  <FieldLabel
                    text={t('paymentsWithDifferentVariableSymbol')}
                    htmlFor="checkbox-differrent-variable-symbol"
                    className={styles.checkboxLabel}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    id="input-diffVariableSymbol-amount"
                    value={diffVariableSymbolValue.toString()}
                    onChange={handleDiffVariableSymbolChange}
                    disabled={!diffVariableSymbolChecked}
                    currency="Kč"
                  />
                </td>
                <td>
                  <Text variant="subtitle" regular>
                    {format.number(diffVariableSymbolPercentage / 100, {
                      style: 'percent',
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 0,
                    })}
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox
                    id="checkbox-overpayment-refund"
                    checked={overpaymentRefundChecked}
                    onChange={() => setOverpaymentRefundChecked((prev) => !prev)}
                  />
                </td>
                <td>
                  <FieldLabel
                    text={t('refundOfOverpayment')}
                    htmlFor="checkbox-overpayment-refund"
                    className={styles.checkboxLabel}
                  />
                </td>
                <td>
                  <Input
                    type="text"
                    id="input-overpayment-refund-amount"
                    value={overpaymentRefundValue.toString()}
                    onChange={handleOverpaymentRefundChange}
                    disabled={!overpaymentRefundChecked}
                    currency="Kč"
                  />
                </td>
                <td>
                  <Text variant="subtitle" regular>
                    {format.number(overpaymentRefundPercentage / 100, {
                      style: 'percent',
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 0,
                    })}
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Checkbox
                    id="checkbox-crime-committed"
                    checked={crimeCommittedChecked}
                    onChange={() => setCrimeCommittedChecked((prev) => !prev)}
                  />
                </td>
                <td colSpan={2}>
                  <FieldLabel
                    text={t('crimeCommitted')}
                    htmlFor="checkbox-crime-committed"
                    className={styles.checkboxLabel}
                  />
                </td>
                <td>
                  <Text variant="subtitle" regular>
                    {format.number(crimeCommittedPercentage / 100, {
                      style: 'percent',
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 0,
                    })}
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
          <footer className={styles.modalFooter}>
            <div className={styles.buttonGroup}>
              <Button
                id="newAdminCase-button-cancel"
                variant="tertiary"
                onClick={handleCloseModal}
                type="button"
              >
                {t('cancelButton')}
              </Button>
              <Button id="newAdminCase-button-create" variant="primary" type="submit">
                {t('confirmButton')}
              </Button>
            </div>
          </footer>
        </form>
      </Modal>
    </>
  );
};
