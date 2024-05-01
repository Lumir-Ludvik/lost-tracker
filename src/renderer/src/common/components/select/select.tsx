import React, { PropsWithChildren } from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";

type SelectProps = React.SelectHTMLAttributes<unknown> &
  PropsWithChildren & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: ControllerRenderProps<any, any>;
    error: FieldError | undefined;
  };

export const Select = ({ field, error, children, ...props }: SelectProps) => {
  return (
    <div className={`select ${error && "invalid"}`}>
      <select {...field} {...props}>
        {children}
      </select>
      {error && <p>{error.message}</p>}
    </div>
  );
};
