import { create } from 'zustand';

import { Field } from '../api/services/patchDraftStructure';

/**
 * Represents an action that can be performed on the structure.
 */
interface Action {
  /** The type of action to perform */
  type: 'add' | 'remove';
  /** The payload containing either a Field object for add operations or a number (index) for remove operations */
  payload: Field | number;
  /** Timestamp when the action was created */
  timestamp: number;
}

/**
 * State interface for the CSC structure store.
 */
interface CscStructureState {
  /** Array of column indexes that have been marked for removal */
  remove: number[];
  /** Array of all actions (add/remove) that have been queued */
  actions: Action[];
  /** Function to add a new column to the structure */
  addColumn: (column: Field) => void;
  /** Function to remove columns by their indexes */
  removeColumns: (indexes: number[]) => void;

  updateAction: (index: number, code: string, defaultValue: string, validations: any[]) => void;
  /** Function to reset the store state to initial values */
  resetState: () => void;
}

/**
 * Zustand store for managing CSC structure modifications.
 *
 * @remarks
 * This store manages the queue of structure modifications (add/remove columns) that will be
 * applied to a code list structure. It maintains both a list of removal indexes and a
 * comprehensive action history with timestamps.
 *
 * When adding a column, any existing 'add' action with the same index is automatically
 * removed to prevent duplicates, ensuring only the most recent version of a column
 * addition is kept.
 *
 * @example
 * ```typescript
 * const { addColumn, removeColumns, actions, resetState } = useCscStructureStore();
 *
 * // Add a new column
 * addColumn({ index: 1, name: 'New Column', ... });
 *
 * // Remove columns by index
 * removeColumns([0, 2]);
 *
 * // Reset all pending actions
 * resetState();
 * ```
 */
export const useCscStructureStore = create<CscStructureState>((set) => ({
  remove: [],
  actions: [],

  /**
   * Adds a new column to the structure.
   *
   * @param column - The field configuration for the new column
   *
   * @remarks
   * If a column with the same index already exists in the actions queue,
   * the previous 'add' action will be removed and replaced with the new one.
   * This prevents duplicate column additions with the same index.
   */
  addColumn: (column) =>
    set((state) => {
      // Filter out any existing 'add' actions with the same index
      const filteredActions = state.actions.filter((action) => {
        if (action.type === 'add') {
          const actionField = action.payload as Field;

          return actionField.index !== column.index;
        }

        return true;
      });

      return {
        actions: [...filteredActions, { type: 'add', payload: column, timestamp: Date.now() }],
      };
    }),
  /**
   * Updates an existing 'add' action for a column by its index.
   *
   * @param index - The index of the column to update
   * @param code - The new code for the column
   * @param defaultValue - The new default value for the column
   * @param validations - The new validations array for the column
   *
   * @remarks
   * Finds the 'add' action with the specified column index in the actions queue and updates its
   * code, default value, and validations. If no matching 'add' action exists, no changes are made.
   */
  updateAction: (index: number, code: string, defaultValue: string, validations: any[]) =>
    set((state) => ({
      actions: state.actions.map((action) => {
        if (action.type === 'add' && (action.payload as Field).index === index) {
          const payload = { ...(action.payload as Field) };
          payload.code = code;
          payload.default = defaultValue;
          payload.validations = validations;

          return {
            ...action,
            payload,
          };
        }

        return action;
      }),
    })),

  /**
   * Removes columns from the structure by their indexes.
   *
   * @param indexes - Array of column indexes to remove
   *
   * @remarks
   * This function adds the indexes to both the `remove` array and creates
   * corresponding 'remove' actions in the actions queue. Each action gets
   * a timestamp for tracking purposes.
   */
  removeColumns: (indexes) =>
    set((state) => ({
      remove: [...state.remove, ...indexes],
      actions: [
        ...state.actions,
        ...indexes.map((idx) => ({
          type: 'remove' as const,
          payload: idx,
          timestamp: Date.now(),
        })),
      ],
    })),

  /**
   * Resets the store to its initial state.
   *
   * @remarks
   * Clears both the `remove` array and the `actions` queue, effectively
   * canceling all pending structure modifications.
   */
  resetState: () => set({ remove: [], actions: [] }),
}));
