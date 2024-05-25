import { Time } from "@internationalized/date";

export type RowDataType = {
	name: string;
	statuses: boolean[];
	color?: string;
	availableFor: number[];
};

export type ColumnDataType = {
	name: string;
	color?: string;
};

export type TableDataType = {
	isNewlyAdded: boolean;
	resetAt: number | null;
	tableName: string;
	dayOfReset: DayOfResetType;
	timeOfReset: Time;
	rows: RowDataType[];
	columns: ColumnDataType[];
};

export const DaysSort = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
] as const;
export type DaysSortType = (typeof DaysSort)[number];

export enum Days {
	Sunday,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday
}

export type DayOfResetType = Days | "always" | "never";

export type TimeTableType = {
	tableKey: string;
	dayOfReset: DayOfResetType;
};
