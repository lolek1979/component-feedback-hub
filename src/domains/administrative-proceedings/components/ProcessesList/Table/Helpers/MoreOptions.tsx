'use client';

import { useTranslations } from 'next-intl';

import OptionsIcon from '@/core/assets/icons/more_horiz.svg';
import { Button } from '@/design-system/atoms';

import { AdminProcessTableRow } from '../../Columns';

interface RowActionsProps {
  rowData: AdminProcessTableRow;
}

const MoreOptions = (props: RowActionsProps) => {
  const t = useTranslations('administrativeProceedings');

  return (
    <Button id="button-more-options-open" variant="unstyled">
      <span className="sr-only">{t('openMoreOptionsMenu')}</span>
      <OptionsIcon id="icon-more-options-open" width={24} height={24} />
    </Button>
  );
};

export default MoreOptions;
