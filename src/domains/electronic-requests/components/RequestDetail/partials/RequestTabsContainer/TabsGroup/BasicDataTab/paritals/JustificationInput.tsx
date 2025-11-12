import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { RequestDetailModel } from '@/domains/electronic-requests/api/services/types';

import styles from '../BasicDataTab.module.css';

import { Textarea } from '@/design-system';
export const JustificationInput = ({
  requestData,
  onUpdate,
}: {
  requestData: RequestDetailModel | null | undefined;
  onUpdate: (justification: string) => void;
}) => {
  const [justificationValue, setJustificationValue] = useState(requestData?.justification || '');
  const [debouncedJustification] = useDebounce(justificationValue, 1000);

  useEffect(() => {
    if (debouncedJustification !== requestData?.justification) {
      onUpdate(debouncedJustification);
    }
  }, [debouncedJustification, requestData?.justification, onUpdate]);

  const handleJustificationChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJustificationValue(e.target.value);
  }, []);

  return (
    <div className={styles.inputContainer}>
      <Textarea
        id="justification"
        initialValue={justificationValue}
        onChange={handleJustificationChange}
        rows={3}
        width={493}
        maxLength={300}
      />
    </div>
  );
};
