'use client';

import { useEffect, useState } from 'react';
import { parseAsFloat, useQueryState } from 'nuqs';

import { Input } from '@/design-system/atoms';

const WaivedAmountInput = () => {
  const [waivedAmount, setWaivedAmount] = useQueryState(
    'waivedAmount',
    parseAsFloat.withDefault(0),
  );
  const [inputValue, setInputValue] = useState<string>(waivedAmount.toString());

  useEffect(() => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue) && parsedValue !== waivedAmount) {
      setWaivedAmount(parsedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    if (!isNaN(waivedAmount)) {
      setInputValue(waivedAmount.toString());
    }
  }, [waivedAmount]);

  return (
    <Input
      id="draft-control-discussion-result"
      currency="Kč"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default WaivedAmountInput;
