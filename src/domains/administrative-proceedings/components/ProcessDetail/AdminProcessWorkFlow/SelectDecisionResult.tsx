'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { parseAsFloat, useQueryState } from 'nuqs';

import { Option, Select } from '@/design-system/atoms';

const decisionValues = {
  fullyGranted: 'fullyGranted',
  partiallyGranted: 'partiallyGranted',
  notGranted: 'notGranted',
} as const;

type DecisionValue = (typeof decisionValues)[keyof typeof decisionValues];

interface SelectDecisionResultProps {
  penaltyDebt: number;
}

const SelectDecisionResult = (props: SelectDecisionResultProps) => {
  const t = useTranslations('administrativeProceedings.workflowSteps');
  const [decisionValue, setDecisionValue] = useState<DecisionValue>(decisionValues.notGranted);
  const [waivedAmount] = useQueryState('waivedAmount', parseAsFloat.withDefault(0));

  const discussionResultOptions = [
    {
      label: t('draftControl.draftDecision.fields.discussionResultOptions.fullyGranted'),
      value: decisionValues.fullyGranted,
    },
    {
      label: t('draftControl.draftDecision.fields.discussionResultOptions.partiallyGranted'),
      value: decisionValues.partiallyGranted,
    },
    {
      label: t('draftControl.draftDecision.fields.discussionResultOptions.notGranted'),
      value: decisionValues.notGranted,
    },
  ];

  const handleDecisionChange = (value: string) => {
    setDecisionValue(value as DecisionValue);
  };

  useEffect(() => {
    if (waivedAmount <= 0 || !waivedAmount) {
      setDecisionValue(decisionValues.notGranted);
    } else if (waivedAmount > 0 && waivedAmount < props.penaltyDebt) {
      setDecisionValue(decisionValues.partiallyGranted);
    } else if (waivedAmount >= props.penaltyDebt) {
      setDecisionValue(decisionValues.fullyGranted);
    }
  }, [props.penaltyDebt, waivedAmount]);

  return (
    <Select
      id="select-decision-switcher"
      value={decisionValue}
      onChange={handleDecisionChange}
      ariaLabel="Select discussion result"
    >
      {discussionResultOptions.map(({ label, value }) => (
        <Option key={value} value={value}>
          {label.toUpperCase()}
        </Option>
      ))}
    </Select>
  );
};

export default SelectDecisionResult;
