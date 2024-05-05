import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./table-generator.scss";
import { useTableContext } from "../../contexts/table-context";
import { TableForm } from "./types";
import { mapFormDataToTableDataType } from "./table-generator-mapper";
import { Input } from "../../common/components/input/input";
import { Select } from "../../common/components/select/select";
import { ColorPicker } from "../../common/components/color-picker/color-picker";
import { Button } from "@nextui-org/react";
import { Days, DaysSort, DaysSortType } from "../../common/types";

export const TableGenerator = () => {
	const { saveTable } = useTableContext();

	const [colorPickerState, setColorPickerState] = useState<Record<string, boolean>>({});

	const { control, handleSubmit, reset } = useForm<TableForm>({
		defaultValues: {
			tableName: "",
			timeOfReset: "always",
			columns: [{ value: "", color: "#8B0000FF" }],
			rows: [{ value: "", color: "#8B0000FF", availableFor: [] }]
		}
	});

	const {
		fields: columnFields,
		append: appendColumn,
		remove: removeColumn
	} = useFieldArray({
		control,
		name: "columns"
	});

	const {
		fields: rowFields,
		append: appendRow,
		remove: removeRow
	} = useFieldArray({
		control,
		name: "rows"
	});

	const createTable = useCallback(
		(data: TableForm) => {
			saveTable(mapFormDataToTableDataType(data));
			reset();
		},
		[reset, saveTable]
	);

	const handleInputChange = useCallback(
		(
			event: ChangeEvent<unknown>,
			isLast: boolean,
			typeOfInput: "row" | "column",
			onChange: (...event: unknown[]) => void
		) => {
			const value = (event.target as HTMLInputElement).value;
			// TODO: bug when pressing space in an empty newly generated input
			if (!isLast && value.trim()) {
				onChange(event);
				return;
			}

			switch (typeOfInput) {
				case "column":
					value.trim()
						? appendColumn({ value: "", color: "#8B0000FF" }, { shouldFocus: false })
						: removeColumn(-1);
					break;
				case "row":
					value.trim()
						? appendRow({ value: "", color: "#8B0000FF", availableFor: [] }, { shouldFocus: false })
						: removeRow(-1);
					break;
			}

			onChange(event);
		},
		[appendColumn, appendRow, removeColumn, removeRow]
	);

	const onColorPickerButtonClick = useCallback(
		(state: boolean, key: string) => {
			const nextState = { ...colorPickerState };
			nextState[key] = state;

			setColorPickerState(nextState);
		},
		[colorPickerState]
	);

	const dayOfResetOptions = useMemo(
		() => [
			{
				value: "always",
				label: "Always"
			},
			...Object.keys(Days)
				.filter((key) => isNaN(Number(key)))
				.sort((a, b) => DaysSort.indexOf(a as DaysSortType) - DaysSort.indexOf(b as DaysSortType))
				.map((day) => ({ value: day, label: day }))
		],
		[]
	);

	// TODO: this is not responsive for all of the changes in column value maybe add watch
	const availableForColumnsOptions = useMemo(
		() =>
			columnFields
				.map((column, index) => ({
					label: column.value,
					value: index
				}))
				.filter((option) => option.label !== ""),
		[columnFields]
	);

	return (
		<form className="table-generator" onSubmit={handleSubmit(createTable)}>
			<Controller
				name="tableName"
				control={control}
				rules={{
					required: { value: true, message: "This field is required" }
				}}
				render={({ field, fieldState: { error } }) => (
					<Input label="Table name:" field={field} error={error} value={field.value} />
				)}
			/>

			<div>
				<Controller
					name="timeOfReset"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<Select
							label="Day of reset"
							defaultSelectedKeys={["always"]}
							field={field}
							error={error}
							onChange={(event) => {
								field.onChange(event.target.value);
							}}
							options={dayOfResetOptions}
						/>
					)}
				/>
			</div>

			<div className="columns-container">
				<label>Columns:</label>
				<label>Column cell color:</label>

				{columnFields.map((column, columnIndex) => (
					<React.Fragment key={column.id}>
						<Controller
							name={`columns.${columnIndex}.value`}
							control={control}
							// TODO: validation for unique name
							rules={{
								required: {
									value: columnIndex === 0,
									message: "This field is required"
								}
							}}
							render={({ field, fieldState: { error } }) => (
								<Input
									id={`column-name-${columnIndex}`}
									label="Column name:"
									field={field}
									error={error}
									value={field.value}
									onChange={(event) => {
										handleInputChange(
											event,
											columnIndex + 1 === columnFields.length,
											"column",
											field.onChange
										);
									}}
								/>
							)}
						/>
						<Controller
							name={`columns.${columnIndex}.color`}
							control={control}
							render={({ field: { value, onChange } }) => (
								<>
									<div
										className="color-picker-display"
										style={{
											backgroundColor: value?.toString() ?? "#8B0000FF"
										}}
										onClick={() => {
											onColorPickerButtonClick(true, `columns.${columnIndex}.color`);
										}}
									/>
									{colorPickerState[`columns.${columnIndex}.color`] && (
										<ColorPicker
											color={value}
											onClose={(color) => {
												onChange(color);
												onColorPickerButtonClick(false, `columns.${columnIndex}.color`);
											}}
										/>
									)}
								</>
							)}
						/>
					</React.Fragment>
				))}
			</div>

			<div className="rows-container">
				<label className="rows-label">Rows:</label>
				<label className="row-color-label">Row cell color:</label>
				<label className="row-color-label">Available columns:</label>

				{rowFields.map((row, rowIndex) => (
					<React.Fragment key={row.id}>
						<Controller
							name={`rows.${rowIndex}.value`}
							control={control}
							rules={{
								required: {
									value: rowIndex === 0,
									message: "This field is required"
								}
							}}
							render={({ field, fieldState: { error } }) => (
								<Input
									label="Row name"
									field={field}
									error={error}
									value={field.value}
									onChange={(event) => {
										handleInputChange(
											event,
											rowIndex + 1 === rowFields.length,
											"row",
											field.onChange
										);
									}}
								/>
							)}
						/>

						<Controller
							name={`rows.${rowIndex}.color`}
							control={control}
							render={({ field: { value, onChange } }) => (
								<div className="flex justify-center">
									<div
										className="color-picker-display"
										style={{
											backgroundColor: value?.toString() ?? "#8B0000FF"
										}}
										onClick={() => {
											onColorPickerButtonClick(true, `rows.${rowIndex}.color`);
										}}
									/>
									{colorPickerState[`rows.${rowIndex}.color`] && (
										<ColorPicker
											color={value}
											onClose={(color) => {
												onChange(color);
												onColorPickerButtonClick(false, `rows.${rowIndex}.color`);
											}}
										/>
									)}
								</div>
							)}
						/>
						<Controller
							name={`rows.${rowIndex}.availableFor`}
							control={control}
							render={({ field, fieldState: { error } }) => (
								<Select
									selectionMode="multiple"
									label="Available for columns"
									field={field}
									error={error}
									onChange={(event) => {
										field.onChange(event.target.value.split(",").map((value) => Number(value)));
									}}
									disabled={availableForColumnsOptions.length === 0}
									options={availableForColumnsOptions}
								/>
							)}
						/>
					</React.Fragment>
				))}
			</div>
			<div className="flex gap-4">
				<Button color="primary" type="submit">
					Create table
				</Button>
				<Button color="secondary" type="button" onClick={() => reset()}>
					Reset form
				</Button>
			</div>
		</form>
	);
};
