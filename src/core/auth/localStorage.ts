/**
 * Safely parses a JSON string, returning `undefined` if parsing fails.
 *
 * @param value - The JSON string to parse.
 * @returns The parsed value, or `undefined` if parsing fails or value is null/undefined.
 */
const safeParseJson = (value: string | undefined | null) => {
  if (value == null) return undefined;

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

/**
 * Checks if the specified storage type is available in the current environment.
 *
 * @param type - The type of storage ('localStorage', 'sessionStorage', etc.).
 * @returns `true` if storage is available, otherwise `false`.
 */
const storageAvailable = (type: string) => {
  if (typeof window === 'undefined') return false;

  try {
    // @ts-expect-error
    const storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);

    return true;
  } catch (e) {
    console.error(`Storage type '${type}' is not available:`, e);
  }
};

/**
 * Retrieves and parses a value from localStorage by key.
 *
 * @param key - The key to retrieve from localStorage.
 * @returns The parsed value, or `null` if not found or unavailable.
 */
const getFromLocalStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  const data = storageAvailable('localStorage') ? window.localStorage.getItem(key) : null;

  return safeParseJson(data);
};

/**
 * Sets a value in localStorage under the specified key.
 *
 * @param key - The key to set in localStorage.
 * @param value - The value to store (will be stringified).
 */
const setToLocalStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  if (storageAvailable('localStorage')) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

/**
 * Clears all data from localStorage.
 */
const clearLocalStorage = () => {
  if (typeof window === 'undefined') return;
  if (storageAvailable('localStorage')) {
    window.localStorage.clear();
  }
};

/**
 * Dispatches a custom event to notify listeners of a localStorage change.
 *
 * @param key - The key that changed.
 * @param newValue - The new value for the key.
 */
const dispatchLocalStorageEvent = (key: string, newValue: string) => {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('localStorageChange', {
    detail: { key, newValue },
  });
  window.dispatchEvent(event);
};

export {
  clearLocalStorage,
  dispatchLocalStorageEvent,
  getFromLocalStorage,
  safeParseJson,
  setToLocalStorage,
};
