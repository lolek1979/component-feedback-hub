'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { fetchAllUsers } from '@/core/api/services/getAllUsers';
import { ISearch } from '@/core/assets/icons';
import { FieldLabel, Input, Option, Select } from '@/design-system/atoms';
import { DatePicker } from '@/design-system/molecules';

import { QuerySelect } from '../QuerySelect';
import { AuditListFilterProps, FilterChange } from './types/FilterChange';
import styles from './AuditListFilter.module.css';

/**
 * This component renders a filter interface for an audit list page.
 * It includes date pickers for selecting a date range, input fields for searching by entity ID and identity ID,
 *
 * @param {AuditListFilterProps} auditListFilterProps - The properties for the AuditListFilter component.
 * @param {Date | null} [auditListFilterProps.initialFromDate] - Initial value for the "from" date picker.
 * @param {Date | null} [auditListFilterProps.initialToDate] - Initial value for the "to" date picker.
 * @param {string | null} [auditListFilterProps.initialIdOrEntityIdOrSessionId] - Initial value for the entity ID search input.
 * @param {string | null} [auditListFilterProps.initialIdentityId] - Initial value for the identity ID search input.
 * @param {string | null} [auditListFilterProps.initialSuccess] - Initial value for the success filter.
 * @returns
 */
export const AuditListFilter = (auditListFilterProps: AuditListFilterProps) => {
  const [params, setParams] = useState<FilterChange>({
    fromDate: auditListFilterProps.initialFromDate ?? null,
    toDate: auditListFilterProps.initialToDate ?? null,
    idOrEntityIdOrSessionId: auditListFilterProps.idOrEntityIdOrSessionId ?? null,
    identityId: auditListFilterProps.initialIdentityId ?? null,
    success: auditListFilterProps.initialSuccess ?? null,
  });
  const th = useTranslations('AuditPage.headers');
  const tf = useTranslations('AuditPage.filter');
  const t = useTranslations('AuditPage');
  let nextUserLink: string | null = null; // Initialize nextUserLink to null
  let userQuery: string = ''; // Initialize query to an empty string
  let latestUsersResult: any | null = null; // Initialize usersResult to null

  // Effect to call the onFilterChange callback whenever params change
  useEffect(() => {
    auditListFilterProps.onFilterChange(params);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Function to handle changes in the "from" date picker
  function handleFromDateChange(selectedDate: Date | null): void {
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(0, 0, 0, 0);
      setParams((prev) => ({
        ...prev,
        fromDate: date,
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        fromDate: null,
      }));
    }
  }

  // Function to handle the change of the "to" date in the date picker
  function handleToDateChange(selectedDate: Date | null): void {
    if (selectedDate) {
      const date = new Date(selectedDate);
      date.setHours(23, 59, 59, 999); // Set to end of the day in UTC
      setParams((prev) => ({
        ...prev,
        toDate: date,
      }));
    } else {
      setParams((prev) => ({
        ...prev,
        toDate: null,
      }));
    }
  }

  function handleIdOrEntityIdOrSessionIdSearch(event: React.ChangeEvent<HTMLInputElement>): void {
    setParams((prev) => ({
      ...prev,
      idOrEntityIdOrSessionId: event.target.value,
    }));
  }

  function handleIdentityIdSearch(user: Item | null): void {
    setParams((prev) => ({
      ...prev,
      identityId: user ? user.code : null,
    }));
  }

  function handleSuccessChange(value: string): void {
    setParams((prev) => ({
      ...prev,
      success: value,
    }));
  }

  // Define the Item interface for QuerySelect options
  interface Item {
    code: string;
    description: string;
  }

  //Adapter for QuerySelect to fetch users
  const fetchUserItems = useCallback(async (query: string, page: number): Promise<Item[]> => {
    if (query !== userQuery) {
      nextUserLink = null; // Reset nextUserLink if the query changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
      userQuery = query; // Update the current query
    } else {
      //do not fetch next data, if nextLink is null and usersResult is not empty - the latest page is already fetched
      if (nextUserLink === null && latestUsersResult) {
        return []; // Return empty array if no next link
      }
    }

    const result = await fetchAllUsers(query, nextUserLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    latestUsersResult = result; // Store the result for future reference

    // eslint-disable-next-line react-hooks/exhaustive-deps
    nextUserLink = result?.['@odata.nextLink'] || null;

    if (!result) return [];

    return result.value.map((user) => ({
      code: user.id,
      description: `${user.displayName}`,
    }));
  }, []);

  const getOptionLabel = (item: Item | null) => `${item ? item.description : ''}`;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <FieldLabel
          text={tf('idOrEntityOrSession')}
          htmlFor={'input-audit-list-filter-entity'}
        ></FieldLabel>
        <Input
          type="search"
          id={'input-audit-list-filter-entity'}
          value={params.idOrEntityIdOrSessionId ?? ''}
          placeholder={tf('idOrEntityOrSession')}
          onChange={handleIdOrEntityIdOrSessionIdSearch}
          iconAlign="right"
          secondaryIcon={<ISearch />}
        ></Input>
      </div>
      <div className={styles.item}>
        <FieldLabel text={tf('identityId')} htmlFor={'identityId'}></FieldLabel>
        <QuerySelect<Item>
          fetchItems={fetchUserItems}
          getOptionLabel={getOptionLabel}
          onChange={handleIdentityIdSearch}
          placeholder={tf('identityId')}
          debounceDelay={300}
          initialValue={params.identityId ?? ''}
          id={'query-select-audit-list-filter-identity-id'}
        />
      </div>
      <div className={styles.item}>
        <FieldLabel text={tf('from')} htmlFor={'date-picker-audit-list-filter-from'}></FieldLabel>
        <DatePicker
          onDateChange={handleFromDateChange}
          id={'date-picker-audit-list-filter-from'}
          placeholder={tf('from')}
          hasPopoverCalendar={true}
          initialDate={params.fromDate}
        />
      </div>
      <div className={styles.item}>
        <FieldLabel text={tf('to')} htmlFor={'date-picker-audit-list-filter-to'}></FieldLabel>
        <DatePicker
          onDateChange={handleToDateChange}
          id={'date-picker-audit-list-filter-to'}
          placeholder={tf('to')}
          hasPopoverCalendar={true}
          initialDate={params.toDate}
        />
      </div>
      <div className={styles.item}>
        <FieldLabel text={th('success')} htmlFor={'select-audit-list-filter-success'}></FieldLabel>
        <Select
          placeholder={th('success')}
          id="select-audit-list-filter-success"
          onChange={handleSuccessChange}
          value={params.success ?? '-'}
        >
          <Option value="-">{tf('successAll')}</Option>
          <Option value="true">{t('success')}</Option>
          <Option value="false">{t('failure')}</Option>
        </Select>
      </div>
    </div>
  );
};
