'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { getFromLocalStorage, setToLocalStorage } from '@/core/auth/localStorage';

/**
 * Context value type for theme.
 *
 * @property isDark - Indicates if dark mode is enabled.
 * @property setIsDark - Function to set dark mode.
 */
interface ThemeContextProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}

/**
 * React context for theme state.
 *
 * @see {@link ThemeProvider}
 * @see {@link useTheme}
 */
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * Provider component for theme state.
 *
 * Manages dark mode state, persists preference in localStorage, and toggles the 'dark' class on the body element.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 *
 * @see {@link useTheme}
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const storedTheme = getFromLocalStorage('isDarkTheme');
    if (storedTheme !== undefined) return storedTheme === true;

    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  });

  useEffect(() => {
    setToLocalStorage('isDarkTheme', isDark);
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  return <ThemeContext.Provider value={{ isDark, setIsDark }}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to access theme context.
 *
 * Throws an error if used outside of {@link ThemeProvider}.
 *
 * @returns The {@link ThemeContextProps} context value.
 *
 * @throws Error if used outside of {@link ThemeProvider}.
 *
 * @example
 * const { isDark, setIsDark } = useTheme();
 */
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
