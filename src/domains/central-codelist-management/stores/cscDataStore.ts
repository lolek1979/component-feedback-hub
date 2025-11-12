import { create } from 'zustand';

type ActionType = 'add' | 'update' | 'delete';
export interface RowValues {
  [key: string]: string | number | Date | null;
}
export interface RowAction {
  type: ActionType;
  rowId: number;
  payload: {
    values: RowValues | number;
  };
}
interface CSCDataStore {
  actions: RowAction[];
  addAction: (action: RowAction) => void;
  resetState: () => void;
  updateDates: () => void;
}

/**
 * Zustand store for managing CSC data actions.
 *
 * @remarks
 * This store maintains a list of actions and provides methods to add new actions or clear all actions.
 * When adding an action, if the last action with the same `rowId` is of type 'update' and the new action is also of type 'update',
 * it replaces the previous action instead of adding a new one.
 *
 * @returns
 * - `actions`: Array of action objects.
 * - `addAction(action)`: Adds a new action or replaces the last 'update' action for the same `rowId`.
 * - `resetState()`: Clears all actions from the store.
 */
export const useCSCDataStore = create<CSCDataStore>((set) => ({
  actions: [],
  addAction: (action) =>
    set((state) => {
      let actions = [...state.actions];
      if (action.type === 'add') {
        actions = actions.filter((a) => {
          const isDuplicateAdd = a.type === 'add' && a.rowId === action.rowId;

          return !isDuplicateAdd;
        });
        actions.push(action);
      } else if (action.type === 'update') {
        const lastIndex = [...actions].reverse().findIndex((a) => a.rowId === action.rowId);
        const absoluteIndex = lastIndex === -1 ? -1 : actions.length - 1 - lastIndex;

        if (absoluteIndex !== -1 && actions[absoluteIndex].type === 'update') {
          actions[absoluteIndex] = action;
        } else {
          actions.push(action);
        }
      } else {
        actions.push(action);
      }

      return { actions };
    }),

  updateDates: () =>
    set((state) => {
      const DateRgx = /^\d{1,2}[.\-/]\d{1,2}[.\-/]\d{4}$/;

      const actions = state.actions.map((action) => {
        if (action.type !== 'update' || typeof action.payload.values === 'number') {
          return action;
        }

        const values = action.payload.values as RowValues;
        const next: RowValues = { ...values };
        let changed = false;

        for (const key of Object.keys(next)) {
          const val = next[key];
          if (typeof val === 'string' && DateRgx.test(val.trim())) {
            const [day, month, year] = val.trim().split(/[.\-/]/);
            const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            next[key] = iso;
            changed = true;
          }
        }

        return changed ? { ...action, payload: { ...action.payload, values: next } } : action;
      });

      return { actions };
    }),

  resetState: () =>
    set(() => ({
      actions: [],
    })),
}));
