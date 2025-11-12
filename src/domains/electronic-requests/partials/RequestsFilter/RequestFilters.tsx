'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useDebounce } from 'use-debounce';

import CloseIcon from '@/core/assets/icons/icon-close.svg';
import SearchIcon from '@/core/assets/icons/icon-search.svg';
import { Button, FieldLabel, Input, Option, Select, Text, Toggle } from '@/design-system/atoms';
import { validateMaxLength } from '@/domain-central-codelist-management/api/services/utils';

import { WFState } from '../../api/services/types';
import styles from './RequestFilters.module.css';

interface RequestFiltersProps {
  showClosedRequests: boolean;
  onShowClosedRequestsChange: (checked: boolean) => void;
  t: (key: string) => string;
  userOptions?: Array<{ id: string; name: string }>;
  recipientOptions?: Array<{ id: string; name: string }>;
  approverOptions?: Array<{ id: string; name: string }>;
  costCenterOptions?: Array<{ id: string; name: string }>;
}

const RequestFilters = ({
  showClosedRequests,
  onShowClosedRequestsChange,
  t,
  userOptions = [],
  recipientOptions = [],
  approverOptions = [],
  costCenterOptions = [],
}: RequestFiltersProps) => {
  const [fullText, setFullText] = useQueryState('fullText');
  const [searchInputValue, setSearchInputValue] = useState(fullText || '');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [responsibleUserId, setResponsibleUserId] = useQueryState('responsibleUserId');
  const [requestStatusCode, setRequestStatusCode] = useQueryState('requestStatusCode');

  const [stateFilter, setStateFilter] = useQueryState('stateFilter', {
    parse: (value) => value as WFState,
    serialize: (value) => value,
  });
  const [recipient, setRecipient] = useQueryState('recipient');
  const [approverFilter, setApproverFilter] = useQueryState('approver');
  const [costCenterFilter, setCostCenterFilter] = useQueryState('costCenter');

  const [debouncedSearchValue] = useDebounce(searchInputValue, 500);

  const validateSearchInput = useCallback(
    (value: string) => {
      if (!validateMaxLength(value, 30)) {
        return t('searchMaxLengthError');
      }

      return null;
    },
    [t],
  );

  React.useEffect(() => {
    const error = validateSearchInput(debouncedSearchValue);
    if (!error) {
      setFullText(debouncedSearchValue || null);
    }
  }, [debouncedSearchValue, validateSearchInput, setFullText]);

  const handleFullTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInputValue(value);

      const error = validateSearchInput(value);
      setSearchError(error);
    },
    [validateSearchInput],
  );

  const handleReset = useCallback(() => {
    setSearchInputValue('');
    setFullText(null);
    setResponsibleUserId(null);
    setStateFilter(null);
    setRecipient(null);
    setApproverFilter(null);
    setCostCenterFilter(null);
    if (showClosedRequests) {
      onShowClosedRequestsChange(false);
    }
  }, [
    setFullText,
    setResponsibleUserId,
    setStateFilter,
    setRecipient,
    setApproverFilter,
    setCostCenterFilter,
    showClosedRequests,
    onShowClosedRequestsChange,
  ]);

  const statusOptions = useMemo(() => {
    return [
      { value: 'Draft', label: t('status.inProgress') },
      { value: 'PendingApprove1', label: t('status.inReview') },
      { value: 'Withdrawn', label: t('status.withdrawn') },
    ];
  }, [t]);

  const isAnyFilterActive =
    !!fullText ||
    !!responsibleUserId ||
    !!stateFilter ||
    !!recipient ||
    !!approverFilter ||
    !!costCenterFilter;

  const handleStatusChange = useCallback(
    (value: string) => {
      if (value) {
        setStateFilter(value as WFState);
      } else {
        setStateFilter(null);
      }
    },
    [setStateFilter],
  );

  const handleClosedRequestsToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onShowClosedRequestsChange(e.target.checked);
      if (!e.target.checked && requestStatusCode?.toLowerCase() === 'closed') {
        setRequestStatusCode(null);
      }
    },
    [onShowClosedRequestsChange, requestStatusCode, setRequestStatusCode],
  );

  return (
    <div className={styles.requestFilters} role="search">
      <div className={styles.filterContainer}>
        <div className={styles.firstRow}>
          <div className={styles.filterCell} data-testid="request-input-fullText">
            <FieldLabel
              text={t('labels.search')}
              htmlFor="request-input-fullText"
              color="var(--text-primary)"
            />
            <Input
              type="search"
              id="request-input-fullText"
              placeholder={t('searchPlaceholder')}
              value={searchInputValue}
              onChange={handleFullTextChange}
              ariaLabel={t('searchPlaceholder')}
              aria-describedby="search-description"
              secondaryIcon={
                <SearchIcon
                  id="icon-search-insurance-search"
                  role="button"
                  aria-label={t('labels.search')}
                />
              }
              iconAlign="right"
              maxLength={30}
              isError={!!searchError}
              helperText={searchError}
            />
          </div>
          <div className={styles.filterCell} data-testid="requests-select-responsibleUser">
            <FieldLabel
              text={t('labels.requester')}
              htmlFor="requests-select-responsibleUser"
              color="var(--text-primary)"
            />
            <Select
              id="requests-select-responsibleUser"
              aria-label={t('requesterPlaceholder')}
              aria-describedby="requester-filter-description"
              placeholder={t('requesterPlaceholder')}
              value={responsibleUserId ?? ''}
              onChange={(value) => {
                setResponsibleUserId(value || null);
              }}
            >
              <Option value="">{t('all')}</Option>
              {userOptions.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterCell} data-testid="requests-select-recipient">
            <FieldLabel
              text={t('labels.recipient')}
              htmlFor="requests-select-recipient"
              color="var(--text-primary)"
            />
            <Select
              id="requests-select-recipient"
              aria-label={t('recipientPlaceholder')}
              aria-describedby="recipient-filter-description"
              placeholder={t('recipientPlaceholder')}
              value={recipient || ''}
              onChange={(value) => {
                setRecipient(value || null);
              }}
            >
              <Option value="">{t('all')}</Option>
              {recipientOptions.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterCell} data-testid="requests-select-approver">
            <FieldLabel
              text={t('labels.approver')}
              htmlFor="requests-select-approver"
              color="var(--text-primary)"
            />
            <Select
              id="requests-select-approver"
              aria-label={t('approverPlaceholder')}
              aria-describedby="approver-filter-description"
              placeholder={t('approverPlaceholder')}
              value={approverFilter || ''}
              onChange={(value) => {
                setApproverFilter(value || null);
              }}
            >
              <Option value="">{t('all')}</Option>
              {approverOptions.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.secondRow}>
          <div className={styles.filterCell} data-testid="requests-select-costCenter">
            <FieldLabel
              text={t('labels.costCenter')}
              htmlFor="requests-select-costCenter"
              color="var(--text-primary)"
            />
            <Select
              id="requests-select-costCenter"
              aria-label={t('costCenterPlaceholder')}
              aria-describedby="cost-center-filter-description"
              placeholder={t('costCenterPlaceholder')}
              value={costCenterFilter || ''}
              onChange={(value) => {
                setCostCenterFilter(value || null);
              }}
            >
              <Option value="">{t('all')}</Option>
              {costCenterOptions.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterCell} data-testid="request-select-status">
            <FieldLabel
              text={t('labels.status')}
              htmlFor="request-select-status"
              color="var(--text-primary)"
            />
            <Select
              id="request-select-status"
              aria-label={t('statusPlaceholder')}
              aria-describedby="status-filter-description"
              placeholder={t('statusPlaceholder')}
              value={stateFilter ?? ''}
              onChange={handleStatusChange}
            >
              <Option value="">{t('all')}</Option>
              {statusOptions.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>
          <div className={styles.filterCell}>
            <div className={styles.extraFilterCell}>
              {isAnyFilterActive && (
                <div className={styles.resetFilterCell}>
                  <Button
                    id="button-filter-menu-reset"
                    onClick={handleReset}
                    variant="tertiary"
                    icon={<CloseIcon id="icon-filter-menu-reset" />}
                    iconAlign="left"
                    size="small"
                    aria-label={t('resetFilter')}
                    aria-describedby="reset-filter-description"
                  >
                    <Text variant="subtitle" selectable={false}>
                      {t('resetFilter')}
                    </Text>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.toggleFilterCell}>
            <div className={styles.toggleContainer}>
              <Text variant="subtitle" regular selectable={false} id="toggle-label">
                {t('showClosedRequests')}
              </Text>
              <Toggle
                checked={showClosedRequests}
                onChange={handleClosedRequestsToggle}
                label={t('showClosedRequests')}
                id="toggle-requests-form-show-closed"
                aria-labelledby="toggle-label"
                aria-describedby="toggle-description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestFilters;
