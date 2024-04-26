import { Days, DaysSort, DaysSortType } from "../../types";
import React from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";

type SelectProps = React.SelectHTMLAttributes<unknown> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  error: FieldError | undefined;
};

export const Select = ({ field, error, ...props }: SelectProps) => {
  return (
    <div className={`select ${error && "invalid"}`}>
      <select
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        {...props}
      >
        {Object.keys(Days)
          .filter(key => isNaN(Number(key)))
          .sort(
            (a, b) =>
              DaysSort.indexOf(a as DaysSortType) -
              DaysSort.indexOf(b as DaysSortType)
          )
          .map(day => (
            <option key={`time-of-reset-${day}`}>{day}</option>
          ))}
      </select>
      {error && <p>{error.message}</p>}
    </div>
  );
};
