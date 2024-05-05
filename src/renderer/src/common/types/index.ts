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
	tableName: string;
	timeOfReset: Days | "always";
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

export type TimeTableType = {
	tableKey: string;
	dayOfReset: Days | "always";
};
