'use client';

import React, { useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { Input, Option, Select } from '@/design-system/atoms';

import { useAdminProcessStatuses, useAdminProcessUsers } from '../../api';
import styles from './ProcessesList.module.css';

const ProcessListFilter = () => {
  const t = useTranslations('administrativeProceedings.filter');
  const { data: adminProcessStatuses } = useAdminProcessStatuses();
  const { data: adminProcessUsers } = useAdminProcessUsers();
  const [fullText, setFullText] = useQueryState('fullText');
  const [responsibleUserId, setResponsibleUserId] = useQueryState('responsibleUserId');
  const [adminProcessStatusCode, setAdminProcessStatusCode] =
    useQueryState('adminProcessStatusCode');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleFullTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setFullText(value || null);
      }, 300);
    },
    [setFullText],
  );

  return (
    <aside className={styles.filterContainer}>
      <div className={styles.filterCell} data-testid="adminProcess-input-fullText">
        <Input
          type="search"
          id="adminProcess-input-fullText"
          placeholder={t('fullTextPlaceholder')}
          defaultValue={fullText || ''}
          onChange={handleFullTextChange}
          ariaLabel={t('fullTextAriaLabel')}
          secondaryIcon={<SearchIcon id="icon-search-insurance-search" role="button" />}
          iconAlign="right"
        />
      </div>
      <div className={styles.filterCell} data-testid="adminProcess-select-status">
        <Select
          id="adminProcess-select-status"
          aria-label={t('adminProcessStatusCodeAriaLabel')}
          placeholder={t('adminProcessStatusCodePlaceholder')}
          defaultValue={adminProcessStatusCode || ''}
          onChange={(value) => {
            setAdminProcessStatusCode(value || null);
          }}
        >
          <Option value="">{t('all')}</Option>
          {adminProcessStatuses &&
            adminProcessStatuses.map((item) => (
              <Option key={String(item.code)} value={String(item.code)}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
      <div className={styles.filterCell} data-testid="adminProcess-select-responsibleUser">
        <Select
          id="adminProcess-select-responsibleUser"
          aria-label={t('responsibleUserIdAriaLabel')}
          placeholder={t('responsibleUserIdPlaceholder')}
          defaultValue={responsibleUserId || ''}
          onChange={(value) => {
            setResponsibleUserId(value || null);
          }}
        >
          <Option value="">{t('all')}</Option>
          {adminProcessUsers &&
            adminProcessUsers.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
    </aside>
  );
};

export default ProcessListFilter;
