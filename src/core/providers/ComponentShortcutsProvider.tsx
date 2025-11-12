'use client';

import { ReactNode, useEffect } from 'react';

import ShortcutService, { KeyboardShortcut } from '@/core/auth/ShortcutService';

/**
 * Props for the {@link ComponentShortcutsProvider} component.
 *
 * @property children - React children to be wrapped by the provider.
 * @property shortcuts - Optional array of keyboard shortcuts to register.
 */
interface ComponentShortcutsProviderProps {
  children: ReactNode;
  shortcuts?: KeyboardShortcut[];
}

/**
 * ComponentShortcutsProvider component for registering and unregistering keyboard shortcuts.
 *
 * Registers provided shortcuts on mount and unregisters them on unmount.
 * Wraps its children with shortcut functionality.
 *
 * @param props.children - React children to be wrapped.
 * @param props.shortcuts - Array of keyboard shortcuts to register.
 *
 * @example
 * <ComponentShortcutsProvider shortcuts={[{ key: 'Ctrl+S', action: save }]}>
 *   <App />
 * </ComponentShortcutsProvider>
 */
const ComponentShortcutsProvider = ({ children, shortcuts }: ComponentShortcutsProviderProps) => {
  useEffect(() => {
    if (shortcuts) {
      ShortcutService.registerShortcuts(shortcuts);

      return () => {
        ShortcutService.unregisterShortcuts(shortcuts);
      };
    }
  }, [shortcuts]);

  return <>{children}</>;
};

export default ComponentShortcutsProvider;
