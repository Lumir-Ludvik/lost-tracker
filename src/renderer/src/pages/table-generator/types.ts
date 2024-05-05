import { Days } from "../../common/types";

export type ColumnElementType = {
	value: string;
	color?: string;
};

export type RowElementType = ColumnElementType & {
	availableFor: number[];
};

export type TableForm = {
	tableName: string;
	timeOfReset: Days | "always";
	columns: ColumnElementType[];
	rows: RowElementType[];
};
