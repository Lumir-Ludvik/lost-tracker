import { ControllerRenderProps, FieldError } from "react-hook-form";
import {
	TimeInput as NextTimeInput,
	TimeInputProps as NextTimeInputProps
} from "@heroui/react";

type TimeInputProps = NextTimeInputProps & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	field: ControllerRenderProps<any, any>;
	error: FieldError | undefined;
};

export const TimeInput = ({ field, error, ...props }: TimeInputProps) => {
	return (
		<NextTimeInput
			isInvalid={!!error?.message}
			errorMessage={error?.message}
			{...field}
			{...props}
		/>
	);
};
