import { useCallback } from "react";
import { TableDataType } from "../common/types";

export const useResetTable = () => {
	const resetTable = useCallback((table: TableDataType) => {
		const nextTable = { ...table };

		nextTable.rows = table.rows.map((row) => ({
			...row,
			statuses: row.statuses.map(() => false)
		}));

		return nextTable;
	}, []);

	return {
		resetTable
	};
};
