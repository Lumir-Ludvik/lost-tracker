import { useLocalStorage } from "./useLocalStorage.tsx";
import { useCallback } from "react";
import { TableDataType } from "../common/types";

export const useResetTable = () => {
  const { getFromStorage, saveToStorage } = useLocalStorage();

  const resetTable = useCallback(
    (name: string) => {
      const data = getFromStorage(name);

      if (!data) {
        console.error(
          "No such table exists in localStorage. Check your table name"
        );
        return;
      }

      const table: TableDataType = JSON.parse(data);
      const nextTable = { ...table };

      nextTable.rows = table.rows.map(row => ({
        ...row,
        statuses: row.statuses.map(() => false)
      }));

      saveToStorage(name, nextTable);
      return nextTable;
    },
    [getFromStorage, saveToStorage]
  );

  return {
    resetTable
  };
};
