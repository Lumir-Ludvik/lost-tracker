import { useCallback } from "react";
import { TableDataType } from "../common/types";

export const useLocalStorage = () => {
  const saveToStorage = useCallback((value: TableDataType) => {
    const data = JSON.stringify(value);

    window.localStorage.setItem(value.tableName, data);
  }, []);

  const getFromStorage = useCallback(
    (key: string): TableDataType | undefined => {
      const table = window.localStorage.getItem(key);
      if (!table) {
        console.error(
          `Table with the name ${key} does not exist in local storage.`
        );
        return;
      }

      return JSON.parse(table);
    },
    []
  );

  const removeFromStorage = useCallback(
    (key: string) => window.localStorage.removeItem(key),
    []
  );

  const clearStorage = useCallback(() => window.localStorage.clear(), []);

  const getAll = useCallback((): TableDataType[] => {
    const all = { ...window.localStorage };

    return Object.keys(all).map(key => JSON.parse(all[key]));
  }, []);

  return {
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    clearStorage,
    getAll
  };
};
