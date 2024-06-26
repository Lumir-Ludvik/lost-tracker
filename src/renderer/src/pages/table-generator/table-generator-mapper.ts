import { TableDataType } from "../../common/types";
import { RowElementType, TableForm } from "./types";

export const mapFormDataToTableDataType = (form: TableForm): TableDataType => {
	const numberOfValidColumns = form.columns.filter((column) => column.value !== "").length;

	return {
		...form,
		rows: form.rows
			.filter((column) => column.value !== "")
			.map((row) => ({
				...row,
				availableFor:
					row.availableFor
						.split(",")
						.filter((parsedAvailable) => parsedAvailable)
						.map((filteredAvailable) => Number(filteredAvailable)) ?? [],
				name: row.value,
				statuses: calculateStatuses(row, numberOfValidColumns),
				color: row.color
			})),
		columns: form.columns
			.filter((column) => column.value !== "")
			.map((column) => ({
				...column,
				name: column.value,
				color: column.color
			}))
	};
};

export const mapTableDataTypeToFormData = (tableData: TableDataType): TableForm => ({
	...tableData,
	tableName: tableData.tableName,
	dayOfReset: tableData.dayOfReset,
	columns: tableData.columns.map((column) => ({
		value: column.name,
		color: column.color
	})),
	rows: tableData.rows.map((row) => ({
		value: row.name,
		color: row.color,
		availableFor: row.availableFor.join(","),
		statuses: row.statuses
	}))
});

const calculateStatuses = (row: RowElementType, numberOfValidColumns: number): boolean[] => {
	let statuses = row.statuses;

	if (numberOfValidColumns === statuses.length) {
		return statuses;
	}

	if (numberOfValidColumns > statuses.length) {
		statuses = [
			...row.statuses,
			...new Array(numberOfValidColumns - row.statuses.length).fill(false)
		];
	}

	if (statuses.length > numberOfValidColumns) {
		statuses = statuses.splice(0, numberOfValidColumns);
	}

	return statuses;
};
