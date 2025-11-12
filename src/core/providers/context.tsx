'use client';

import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Application state and actions exposed by the context.
 *
 * @property actions - Functions to update application state.
 * @property state - Current state values.
 */
interface AppState {
  actions: {
    /**
     * Sets whether the side menu is opened.
     * @param isSideMenuOpened - Boolean indicating if the side menu should be opened.
     */
    setIsSideMenuOpened: (isSideMenuOpened: boolean) => void;
  };
  state: {
    /** Indicates if the side menu is currently opened. */
    isSideMenuOpened: boolean;
  };
}

/**
 * React context for application state and actions.
 *
 * @see {@link AppState}
 */
const AppContext = createContext<AppState | undefined>(undefined);

/**
 * Custom hook to access the application context.
 *
 * Throws an error if used outside of {@link AppContextProvider}.
 *
 * @returns The {@link AppState} context value.
 *
 * @throws Error if used outside of {@link AppContextProvider}.
 *
 * @example
 * const { state, actions } = useAppContext();
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

/**
 * Provider component for the application context.
 *
 * Wraps children and provides state and actions for managing the side menu.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <AppContextProvider>
 *   <MyApp />
 * </AppContextProvider>
 */
export const AppContextProvider = ({ children }: PropsWithChildren) => {
  const [isSideMenuOpened, setIsSideMenuOpened] = useState<boolean>(false);

  const appContextValue = useMemo(
    () => ({
      actions: { setIsSideMenuOpened },
      state: { isSideMenuOpened },
    }),
    [isSideMenuOpened],
  );

  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>;
};
