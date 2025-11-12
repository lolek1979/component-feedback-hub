'use client';

import { useFormatter } from 'next-intl';
import { parseAsFloat, useQueryState } from 'nuqs';

import { Text } from '@/design-system/atoms';

interface CalculatedFinalPenaltyProps {
  originalPenalty: number;
}

const CalculatedFinalPenalty = (props: CalculatedFinalPenaltyProps) => {
  const { originalPenalty } = props;
  const format = useFormatter();
  const [waivedAmount] = useQueryState('waivedAmount', parseAsFloat.withDefault(0));

  const finalPenalty = originalPenalty - waivedAmount;

  return (
    <Text variant="body">
      {format.number(finalPenalty, {
        style: 'currency',
        currency: 'CZK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </Text>
  );
};

export default CalculatedFinalPenalty;
