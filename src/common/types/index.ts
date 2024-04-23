export type RowDataType = {
  name: string;
  statuses: boolean[];
};

export type TableDataType = {
  rows: RowDataType[];
  columns: string[];
};

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
