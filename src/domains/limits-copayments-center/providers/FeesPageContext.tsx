'use client';

import type { PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Fees page state and actions exposed by the context.
 *
 * @property actions - Functions to update fees page state.
 * @property state - Current state values.
 */
interface FeesPageState {
  actions: {
    /**
     * Triggers a reset of the fees page to initial search form state.
     */
    triggerFeesPageReset: () => void;
  };
  state: {
    /** Counter that increments when fees page should reset. */
    feesPageResetTrigger: number;
  };
}

/**
 * React context for fees page state and actions.
 *
 * @see {@link FeesPageState}
 */
const FeesPageContext = createContext<FeesPageState | undefined>(undefined);

/**
 * Custom hook to access the fees page context.
 *
 * Throws an error if used outside of {@link FeesPageProvider}.
 *
 * @returns The {@link FeesPageState} context value.
 *
 * @throws Error if used outside of {@link FeesPageProvider}.
 *
 * @example
 * const { state, actions } = useFeesPageContext();
 */
export const useFeesPageContext = () => {
  const context = useContext(FeesPageContext);
  if (!context) {
    throw new Error('useFeesPageContext must be used within a FeesPageProvider');
  }

  return context;
};

/**
 * Provider component for the fees page context.
 *
 * Wraps children and provides state and actions for managing the fees page reset trigger.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <FeesPageProvider>
 *   <FeesPage />
 * </FeesPageProvider>
 */
export const FeesPageProvider = ({ children }: PropsWithChildren) => {
  const [feesPageResetTrigger, setFeesPageResetTrigger] = useState<number>(0);

  const triggerFeesPageReset = () => {
    setFeesPageResetTrigger((prev) => prev + 1);
  };

  const feesPageContextValue = useMemo(
    () => ({
      actions: { triggerFeesPageReset },
      state: { feesPageResetTrigger },
    }),
    [feesPageResetTrigger],
  );

  return (
    <FeesPageContext.Provider value={feesPageContextValue}>{children}</FeesPageContext.Provider>
  );
};
