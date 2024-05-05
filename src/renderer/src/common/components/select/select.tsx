import { ControllerRenderProps, FieldError } from "react-hook-form";
import {
	Select as NextSelect,
	SelectItem,
	SelectProps as NextSelectProps
} from "@nextui-org/react";

export type SelectOptions = {
	label: string;
	value: string | number;
};

type SelectProps = Omit<NextSelectProps, "children"> & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	field: ControllerRenderProps<any, any>;
	error: FieldError | undefined;
	options: SelectOptions[];
};

export const Select = ({ field, error, options, ...props }: SelectProps) => {
	return (
		<NextSelect isInvalid={!!error?.message} errorMessage={error?.message} {...field} {...props}>
			{options.map((option) => (
				<SelectItem key={option.value} value={option.value}>
					{option.label}
				</SelectItem>
			))}
		</NextSelect>
	);
};
