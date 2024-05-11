import { DayOfResetType, TableDataType } from "../../common/types";
import { DEFAULT_TABLE_COLOR, DEFAULT_TIME_OF_RESET } from "../../common/constants";

export type ColumnElementType = {
	value: string;
	color?: string;
};

export type RowElementType = ColumnElementType & {
	availableFor: string;
};

export type TableForm = {
	resetAt: number | null;
	tableName: string;
	timeOfReset: DayOfResetType;
	columns: ColumnElementType[];
	rows: RowElementType[];
};

export type TypeOfInput = "row" | "column";

export type TableGeneratorProps = {
	tableData?: TableDataType;
	onSubmitCallback?: () => void;
	hasCustomActions?: boolean;
	triggerSubmit?: boolean;
	triggerSubmitCallback?: (value: boolean) => void;
	triggerReset?: boolean;
	triggerResetCallback?: (value: boolean) => void;
};

export const emptyForm: TableForm = {
	resetAt: new Date().getTime(),
	tableName: "",
	timeOfReset: DEFAULT_TIME_OF_RESET,
	columns: [{ value: "", color: DEFAULT_TABLE_COLOR }],
	rows: [{ value: "", color: DEFAULT_TABLE_COLOR, availableFor: "" }]
};
