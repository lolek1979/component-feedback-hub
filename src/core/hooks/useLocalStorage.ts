'use client';

import { useEffect, useState } from 'react';

import { dispatchLocalStorageEvent } from '@/core';

/**
 * Custom React hook for managing a boolean value in localStorage with state synchronization.
 *
 * Synchronizes state across browser tabs and within the same tab using custom events.
 *
 * @param key - The localStorage key to use.
 * @param defaultValue - The default value if no value is stored.
 * @returns A tuple containing the current value and a setter function.
 *
 * @example
 * const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
 * setDarkMode(true);
 */
export const useLocalStorage = (key: string, defaultValue: boolean) => {
  const [value, setValue] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  // Update state when local storage changes (cross-tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(event.newValue ? JSON.parse(event.newValue) : defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, defaultValue]);

  // Update state when local storage changes (same-tab)
  useEffect(() => {
    const handleLocalStorageChange = (event: CustomEvent) => {
      if (event.detail.key === key) {
        setValue(event.detail.newValue ? JSON.parse(event.detail.newValue) : defaultValue);
      }
    };

    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener);

    return () => {
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener);
    };
  }, [key, defaultValue]);

  /**
   * Sets the value in localStorage and updates state.
   *
   * @param newValue - The new boolean value to store.
   */
  const setLocalStorageValue = (newValue: boolean) => {
    const stringValue = JSON.stringify(newValue);
    localStorage.setItem(key, stringValue);
    dispatchLocalStorageEvent(key, stringValue);
    setValue(newValue);
  };

  return [value, setLocalStorageValue] as const;
};
