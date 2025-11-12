'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

/**
 * Context value type for unsaved changes.
 *
 * @property updateUnsavedChanges - Function to update the unsaved changes state.
 * @property hasUnsavedChanges - Indicates if there are unsaved changes.
 */
type UnsavedChangesContextType = {
  updateUnsavedChanges: (value: boolean) => void;
  hasUnsavedChanges: boolean;
};

/**
 * React context for unsaved changes state.
 *
 * @see {@link UnsavedChangesProvider}
 * @see {@link useUnsavedChanges}
 */
const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

/**
 * Provider component for unsaved changes state.
 *
 * Manages the state indicating whether there are unsaved changes in the application.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <UnsavedChangesProvider>
 *   <MyForm />
 * </UnsavedChangesProvider>
 *
 * @see {@link useUnsavedChanges}
 */
export const UnsavedChangesProvider = ({ children }: { children: ReactNode }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateUnsavedChanges = useCallback((value: boolean) => {
    setHasUnsavedChanges(value);
  }, []);

  return (
    <UnsavedChangesContext.Provider value={{ updateUnsavedChanges, hasUnsavedChanges }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

/**
 * Custom hook to access unsaved changes context.
 *
 * Throws an error if used outside of {@link UnsavedChangesProvider}.
 *
 * @returns The {@link UnsavedChangesContextType} context value.
 *
 * @throws Error if used outside of {@link UnsavedChangesProvider}.
 *
 * @example
 * const { hasUnsavedChanges, updateUnsavedChanges } = useUnsavedChanges();
 */
export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within a UnsavedChangesProvider');
  }

  return context;
};
