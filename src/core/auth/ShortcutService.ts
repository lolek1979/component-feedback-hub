/**
 * Represents an action triggered by a keyboard shortcut.
 */
type ShortcutAction = () => void;

/**
 * Defines a keyboard shortcut with an action and default shortcut key.
 */
export type KeyboardShortcut = {
  actionId: string;
  action: ShortcutAction;
  defaultShortcut: string;
};

/**
 * Defines a custom shortcut mapping for an action.
 */
export type CustomShortcut = {
  actionId: string;
  shortcut: string;
};

/**
 * Represents a set of shortcuts mapped to actions.
 */
export interface ShortcutSet {
  [key: string]: ShortcutAction;
}

/**
 * Service for managing keyboard shortcuts in the application.
 *
 * Handles registration, unregistration, and custom mapping of shortcuts.
 * Listens for keydown events and triggers associated actions.
 *
 * @example
 * ShortcutService.registerShortcuts([
 *   { actionId: 'save', action: () => save(), defaultShortcut: 'ctrl+s' }
 * ]);
 *
 * @see {@link KeyboardShortcut}
 * @see {@link CustomShortcut}
 * @see {@link ShortcutSet}
 */
class ShortcutService {
  private customShortcuts: CustomShortcut[] = [];
  private shortcuts: ShortcutSet = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initializes the shortcut service by adding a keydown event listener.
   * @internal
   */
  private initialize() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Handles keydown events and triggers the corresponding shortcut action.
   * Ignores events from input and textarea elements.
   * @param event - The keyboard event.
   * @internal
   */
  private handleKeydown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    const key = `${event.ctrlKey ? 'ctrl+' : ''}${event.altKey ? 'alt+' : ''}${event.shiftKey ? 'shift+' : ''}${event.key}`;

    if (this.shortcuts[key]) {
      event.preventDefault();
      this.shortcuts[key]();
    }
  };

  /**
   * Sets custom shortcuts for actions.
   * @param shortcuts - Array of custom shortcuts.
   */
  public setCustomShortcuts(shortcuts: CustomShortcut[]) {
    this.customShortcuts = shortcuts;
  }

  /**
   * Registers a set of keyboard shortcuts.
   * Custom shortcuts override default shortcuts if provided.
   * @param newShortcutsSet - Array of keyboard shortcuts to register.
   */
  public registerShortcuts(newShortcutsSet: KeyboardShortcut[]) {
    this.shortcuts = {
      ...this.shortcuts,
      ...newShortcutsSet.reduce((acc, shortcut) => {
        const customShortcut = this.customShortcuts.find((cs) => cs.actionId === shortcut.actionId);
        const key = customShortcut ? customShortcut.shortcut : shortcut.defaultShortcut;
        acc[key] = shortcut.action;

        return acc;
      }, {} as ShortcutSet),
    };
  }

  /**
   * Unregisters a set of keyboard shortcuts.
   * @param set - Array of keyboard shortcuts to unregister.
   */
  public unregisterShortcuts(set: KeyboardShortcut[]) {
    set.forEach((shortcut) => {
      const customShortcut = this.customShortcuts.find((cs) => cs.actionId === shortcut.actionId);
      const key = customShortcut ? customShortcut.shortcut : shortcut.defaultShortcut;
      delete this.shortcuts[key];
    });
  }
}

/**
 * Singleton instance of {@link ShortcutService}.
 */
export default new ShortcutService();
