'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDebounce } from 'use-debounce';

import { fetchUsers } from '@/core/api/services/getUsers';
import IAdd from '@/core/assets/icons/add.svg';
import IRemove from '@/core/assets/icons/delete_forever.svg';
import Idown from '@/core/assets/icons/icon-arrow-down.svg';
import ISearch from '@/core/assets/icons/searchIcon.svg';
import { useEnv } from '@/core/providers/EnvProvider';
import { Avatar, Input, Text } from '@/design-system/atoms';
import { getRequestCSCUsers } from '@/domains/electronic-requests/api/services/CSC'; // TODO

import styles from './UserSelect.module.css';

/**
 * Represents a user/person for selection.
 *
 * @property id - Unique identifier for the user.
 * @property displayName - Display name of the user.
 * @property mail - Email address of the user.
 * @property mobilePhone - Mobile phone number.
 * @property givenName - Given name (first name).
 * @property surname - Surname (last name).
 * @property jobsite - Optional jobsite or location.
 */
export interface Person {
  id: string;
  displayName: string;
  mail: string;
  mobilePhone: string;
  givenName: string;
  surname: string;
  jobsite?: string;
}

/**
 * Props for the UsersSelect component.
 *
 * @property onSelectsChange - Callback when selected users change.
 * @property initialUsers - Initial selected users.
 * @property roles - Array of role strings for filtering.
 * @property id - Unique identifier for the component.
 * @property isMultiUsers - Whether multiple users can be selected.
 * @property width - Width of the component.
 * @property source - Source for fetching users ('graph' or 'csc').
 * @property disabled - Whether the component is disabled.
 */
interface UsersSelectProps {
  onSelectsChange: (selectedUsers: Person[]) => void;
  initialUsers?: Person[];
  roles?: string[];
  id?: string;
  isMultiUsers?: boolean;
  width?: string | number;
  source?: 'graph' | 'csc';
  disabled?: boolean;
}

/**
 * Internal state for each user search/select input.
 *
 * @property id - Unique identifier for the select input.
 * @property selectedUser - Currently selected user.
 * @property searchQuery - Current search query string.
 */
type UserSearch = { id: number; selectedUser: Person | null; searchQuery: string };

/**
 * UsersSelect component for searching and selecting one or more users.
 *
 * Supports async search, multi-select, user cards, and keyboard accessibility.
 *
 * @param props UsersSelectProps
 * @returns React component
 */

const initialSelects: UserSearch = {
  id: Date.now(),
  selectedUser: null,
  searchQuery: '',
};
const initializeSelects = (initialUsers: Person[]): UserSearch[] => {
  return initialUsers.length > 0
    ? initialUsers.map((user, index) => ({
        id: Date.now() + index,
        selectedUser: user,
        searchQuery: user.displayName,
      }))
    : [initialSelects];
};

export const UsersSelect = ({
  onSelectsChange,
  initialUsers = [],
  roles = [],
  id,
  isMultiUsers = true,
  width,
  source = 'graph',
  disabled = false,
}: UsersSelectProps) => {
  const t = useTranslations('UserSelect');
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const [selects, setSelects] = useState<UserSearch[]>(() => initializeSelects(initialUsers));
  const [users, setUsers] = useState<{ [key: number]: Person[] }>({});
  const [debouncedSelects] = useDebounce(selects, 300);
  const env = useEnv();
  const isInitialized = useRef(false);

  const updateSelectedUsers = useCallback(
    (updatedSelects: typeof selects) => {
      setIsSelected(true);
      const selectedUsers = updatedSelects
        .map((select) => select.selectedUser)
        .filter((user): user is Person => user !== null);
      onSelectsChange(selectedUsers);
    },
    [onSelectsChange],
  );

  useEffect(() => {
    if (!isInitialized.current && initialUsers.length > 0) {
      const enhancedUsers = initialUsers.map((user) => {
        let phoneNumber = user.mobilePhone || '';
        if (!phoneNumber && Array.isArray(user.mobilePhone) && user.mobilePhone.length > 0) {
          phoneNumber = user.mobilePhone[0];
        }

        return {
          ...user,
          displayName: user.displayName || `${user.givenName} ${user.surname}`.trim(),
          givenName: user.givenName || user.displayName?.split(' ')[0] || '',
          surname: user.surname || user.displayName?.split(' ').slice(1).join(' ') || '',
          mail: user.mail || '',
          mobilePhone: phoneNumber,
          jobsite: user.jobsite || '',
        };
      });

      const initialSelects = initializeSelects(enhancedUsers);
      setSelects(initialSelects);
      updateSelectedUsers(initialSelects);
      isInitialized.current = true;
    }
  }, [initialUsers, updateSelectedUsers]);

  const fetchUsersForSelect = useCallback(
    async (searchQuery: string, filterEditors: boolean) => {
      if (searchQuery.length < 3) return [];

      try {
        if (source === 'csc') {
          const response = await getRequestCSCUsers(0, 20, searchQuery);
          if (!response || !response.payload || !response.payload.items) {
            return [];
          }

          return response.payload.items.map(
            (user) =>
              ({
                id: user.id || '',
                displayName: `${user.givenName || ''} ${user.surname || ''}`.trim(),
                mail: user.email || '',
                mobilePhone: user.phoneNumber || '',
                givenName: user.givenName || '',
                surname: user.surname || '',
                jobsite: user.defaultAddress || '',
              }) as Person,
          );
        } else {
          const data = await fetchUsers(searchQuery, filterEditors, env);
          if (!data || !data.value) return [];

          return data.value.map((user) => {
            const match = user.displayName.match(/(.*)\((.*)\)/);
            if (match) {
              user.displayName = match[1].trim();
              user.jobsite = match[2].trim();
            }

            return user as Person;
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);

        return [];
      }
    },
    [env, source],
  );

  useEffect(() => {
    const fetchAndSetUsers = async () => {
      const validSelects = debouncedSelects.filter(
        (select) => !select.selectedUser && select.searchQuery.length >= 3,
      );
      if (validSelects.length === 0) return;

      const filterEditors = roles.includes('editor');

      const results = await Promise.all(
        validSelects.map(async (select) => ({
          id: select.id,
          users: await fetchUsersForSelect(select.searchQuery, filterEditors),
        })),
      );

      const newUsers: { [key: number]: Person[] } = {};
      results.forEach((result) => {
        newUsers[result.id] = (result.users || []) as Person[];
      });

      setUsers(newUsers);
    };

    fetchAndSetUsers();
  }, [debouncedSelects, roles, fetchUsersForSelect]);

  const addSelect = () => {
    const updatedSelects = [...selects, { id: Date.now(), selectedUser: null, searchQuery: '' }];
    setSelects(updatedSelects);
    updateSelectedUsers(updatedSelects);
  };

  const removeSelect = (id: number) => {
    const updatedSelects = selects.filter((select) => select.id !== id);
    setSelects(updatedSelects);
    updateSelectedUsers(updatedSelects);
  };

  const handleInputChange = (id: number, value: string) => {
    if (value.trim() === '') {
      if (selects.length > 1) {
        removeSelect(id);
      } else {
        setSelects([{ id, selectedUser: null, searchQuery: '' }]);
        updateSelectedUsers([{ id, selectedUser: null, searchQuery: '' }]);
        setIsSelected(false);
      }
    } else {
      setSelects((prevSelects) =>
        prevSelects.map((select) =>
          select.id === id ? { ...select, searchQuery: value, selectedUser: null } : select,
        ),
      );
    }
  };
  const handleReturnToInput = (id: number) => {
    const updatedSelects = selects.map((select) =>
      select.id === id ? { ...select, selectedUser: null } : select,
    );
    setSelects(updatedSelects);
  };

  const handleOptionClick = useCallback(
    (id: number, user: Person) => {
      const updatedSelects = selects.map((select) =>
        select.id === id
          ? { ...select, selectedUser: user, searchQuery: user.displayName }
          : select,
      );
      setSelects(updatedSelects);
      updateSelectedUsers(updatedSelects);
    },
    [selects, updateSelectedUsers],
  );

  const handleKeyDown = useCallback(
    (id: number) => (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();

        const availableUsers = users[id] || [];
        const firstAvailableUser = availableUsers.find(
          (user) => !selects.some((s) => s.selectedUser?.mail === user.mail),
        );

        if (firstAvailableUser) {
          handleOptionClick(id, firstAvailableUser);
        }
      }
    },
    [users, selects, handleOptionClick],
  );
  const handleKeyPressReturn = (e: React.KeyboardEvent, selectId: number) => {
    if (e.key === 'Enter') {
      handleReturnToInput(selectId);
    }
  };
  const handleKeyPressDelete = (e: React.KeyboardEvent, selectId: number) => {
    if (e.key === 'Enter') {
      removeSelect(selectId);
    }
  };

  return (
    <div
      className={styles.container}
      style={
        width
          ? ({
              '--user-select-width': typeof width === 'number' ? `${width}px` : width,
            } as React.CSSProperties)
          : undefined
      }
    >
      {selects.map((select, index) => (
        <div key={select.id} className={styles.selectContainer}>
          <div className={styles.inputContainer}>
            {index !== 0 && !disabled && (
              <div className={styles.removeUser}>
                <IRemove
                  id="icon-user-select-remove"
                  data-testid="remove_icon"
                  width={24}
                  height={24}
                  onClick={() => removeSelect(select.id)}
                  onKeyDown={(e: React.KeyboardEvent) => handleKeyPressDelete(e, select.id)}
                  role="button"
                  aria-label={t('removeUser')}
                  tabIndex={0}
                />
              </div>
            )}
            {select.selectedUser ? (
              <div
                className={
                  disabled
                    ? `${styles.selectedCard} ${styles.selectedCardDisabled}`
                    : styles.selectedCard
                }
                {...(!disabled && {
                  onClick: () => handleReturnToInput(select.id),
                  onKeyDown: (e: React.KeyboardEvent) => handleKeyPressReturn(e, select.id),
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': t('selectedUser') + select.selectedUser.displayName,
                })}
                id={
                  roles.length > 0
                    ? `button-selected-card-${roles[0]}-${index}`
                    : `button-selected-card-${index}`
                }
              >
                <div className={styles.userCardSelected}>
                  <div className={styles.selectAvatar}>
                    <Avatar name={select.selectedUser.displayName} />
                  </div>
                  <div className={styles.userInfo}>
                    <Text variant="subtitle" regular>
                      {`${select.selectedUser.givenName} ${select.selectedUser.surname}`.trim()}
                    </Text>
                    <Text variant="caption" className={styles.overflowText}>
                      {select.selectedUser.jobsite || ''}
                    </Text>
                    <Text variant="caption">{select.selectedUser.mobilePhone || ''}</Text>
                    <Text variant="caption">{select.selectedUser.mail || ''}</Text>
                  </div>
                </div>
                <div className={styles.displayIcon}>
                  <Idown
                    id={`icon-${id ?? roles[0] ?? 'user'}-select-arrow-down`}
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            ) : (
              !disabled && (
                <Input
                  type="text"
                  className={styles.input}
                  placeholder={t('choose')}
                  value={select.searchQuery}
                  onChange={(e) => handleInputChange(select.id, e.target.value)}
                  icon={<ISearch width={24} height={24} id={'icon-user-select-search-' + index} />}
                  iconAlign="right"
                  id={
                    roles.length > 0
                      ? `input-user-select-${roles[0]}-${index}`
                      : `input-user-select-search-${index}`
                  }
                  onKeyDown={handleKeyDown(select.id)}
                  ariaLabel={t('searchInput')}
                />
              )
            )}
          </div>
          {!disabled && !select.selectedUser && users[select.id]?.length > 0 && (
            <ul className={styles.optionsList} role="listbox" aria-label={t('userOptions')}>
              {users[select.id].map((user) => {
                const isDisabled = selects.some((s) => s.selectedUser?.mail === user.mail);

                return (
                  <li
                    key={user.mail}
                    className={isDisabled ? styles.disabledOption : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      !isDisabled && handleOptionClick(select.id, user);
                    }}
                    onKeyDown={handleKeyDown(select.id)}
                    role="option"
                    aria-selected={!isDisabled}
                    tabIndex={isDisabled ? -1 : 0}
                  >
                    <div className={styles.userCard}>
                      <Avatar name={user.displayName} />
                      <div className={styles.userInfo}>
                        <Text variant="body" regular>
                          {`${user.givenName} ${user.surname}`.trim()}
                        </Text>
                        <Text variant="caption">{user.jobsite || ''}</Text>
                        <Text variant="caption">{user.mobilePhone || ''}</Text>
                        <Text variant="caption">{user.mail || ''}</Text>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
      {!disabled && isMultiUsers && isSelected && (
        <div
          onClick={addSelect}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addSelect()}
          className={styles.addUser}
          id={
            roles.length > 0 ? `button-selected-add-user-${roles[0]}` : `button-selected-add-user`
          }
          role="button"
          tabIndex={0}
          aria-label={t('addUser')}
        >
          <IAdd
            id={
              id
                ? `icon-user-select-add-${id}`
                : roles.length > 0
                  ? `icon-user-select-add-${roles[0]}`
                  : 'icon-user-select-add-user'
            }
            width={24}
            height={24}
            tabIndex={0}
          />
          {roles.length > 0
            ? t(`new${roles[0][0].toUpperCase() + roles[0].slice(1)}`)
            : t('newUser')}
        </div>
      )}
    </div>
  );
};
