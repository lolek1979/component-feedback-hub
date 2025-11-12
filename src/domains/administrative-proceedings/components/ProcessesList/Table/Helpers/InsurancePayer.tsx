'use client';

import { useTranslations } from 'next-intl';
import { trim } from 'lodash';

import { Text } from '@/design-system/atoms';
import { InsurancePayerSimpleResponse } from '@/domains/administrative-proceedings/api/services/getAdminProcesses';

import styles from '../../ProcessesList.module.css';

type InsurancePayerProps = InsurancePayerSimpleResponse;

const InsurancePayer = (props: InsurancePayerProps) => {
  const { name, id } = props;
  const t = useTranslations('administrativeProceedings');

  return (
    <div className={styles.payer}>
      <Text regular>{trim(name || '') || t('noDataCellPlaceholder')}</Text>
      <Text regular>
        <small>{id}</small>
      </Text>
    </div>
  );
};

export default InsurancePayer;
