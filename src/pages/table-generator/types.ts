import { Days } from "../../common/types";

export type ElementType = {
  value: string;
  color?: string;
};

export type TableForm = {
  tableName: string;
  timeOfReset: Days;
  columns: ElementType[];
  rows: ElementType[];
};
