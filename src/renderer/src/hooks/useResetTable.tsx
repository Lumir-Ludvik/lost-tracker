import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useResetTable = () => {
	const { getFromStorage, saveToStorage } = useLocalStorage();

	const resetTable = useCallback(
		(name: string) => {
			const data = getFromStorage(name);

			if (!data) {
				console.error(
					`Table called ${name} does not exists in localStorage. Check your table name`
				);
				return;
			}

			const nextTable = { ...data };

			nextTable.rows = data.rows.map((row) => ({
				...row,
				statuses: row.statuses.map(() => false)
			}));

			saveToStorage(nextTable);
			return nextTable;
		},
		[getFromStorage, saveToStorage]
	);

	return {
		resetTable
	};
};
