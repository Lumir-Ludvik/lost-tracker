import React from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import "./input.scss";

type InputProps = React.InputHTMLAttributes<unknown> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>;
  error: FieldError | undefined;
};

export const Input = ({ field, error, ...props }: InputProps) => {
  return (
    <div className={`input ${error && "invalid"}`}>
      <input {...field} {...props} />
      {error && <p>{error.message}</p>}
    </div>
  );
};
