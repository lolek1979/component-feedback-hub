'use client';

import { ReactNode, useEffect } from 'react';

import ShortcutService, { CustomShortcut } from '@/core/auth/ShortcutService';
import allCustomShortcuts from '@/core/lib/definitions/shortcuts.json';

/**
 * Props for {@link KeyboardShortcutsProvider}.
 */
interface ShortcutProviderProps {
  /** React children to render within the provider. */
  children: ReactNode;
}

/**
 * Provider component for registering custom keyboard shortcuts globally.
 *
 * Loads custom shortcut sets from configuration and registers them using {@link ShortcutService}.
 * Intended to wrap the application and provide shortcut functionality.
 *
 * @param props.children - The React children to render within the provider.
 *
 * @example
 * <KeyboardShortcutsProvider>
 *   <App />
 * </KeyboardShortcutsProvider>
 *
 * @see {@link ShortcutService}
 * @see {@link CustomShortcut}
 */
const KeyboardShortcutsProvider = ({ children }: ShortcutProviderProps) => {
  useEffect(() => {
    // Example of switching shortcut sets
    // TODO: Add some logic to determine which shortcut set to use
    const customShortcuts: CustomShortcut[] = allCustomShortcuts.customSet2;

    if (customShortcuts && customShortcuts.length > 0) {
      ShortcutService.setCustomShortcuts(customShortcuts);
    }
  }, []);

  return <>{children}</>;
};

export default KeyboardShortcutsProvider;
