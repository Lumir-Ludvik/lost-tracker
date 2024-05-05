import { ControllerRenderProps, FieldError } from "react-hook-form";
import { Input as NextInput, InputProps as NextInputProps } from "@nextui-org/react";
import "./input.scss";

export type InputProps = NextInputProps & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	field: ControllerRenderProps<any, any>;
	error: FieldError | undefined;
};

export const Input = ({ field, error, ...props }: InputProps) => {
	return (
		<NextInput isInvalid={!!error?.message} errorMessage={error?.message} {...field} {...props} />
	);
};
