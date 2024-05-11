import React from "react";
import { Controller } from "react-hook-form";
import "./table-generator.scss";
import { TableGeneratorProps } from "./types";
import { Input } from "../../common/components/input/input";
import { Select } from "../../common/components/select/select";
import { ColorPicker } from "../../common/components/color-picker/color-picker";
import { Button } from "@nextui-org/react";
import { DEFAULT_TABLE_COLOR } from "../../common/constants";
import { useTableGeneratorController } from "./useTableGeneratorController";

export const TableGenerator = ({ tableData, onSubmitCallback }: TableGeneratorProps) => {
	const {
		onColorPickerButtonClick,
		handleInputChange,
		createTable,
		availableForColumnsOptions,
		dayOfResetOptions,
		colorPickerState,
		control,
		columnFields,
		availableColumns,
		reset,
		rowFields,
		handleSubmit,
		isEdit
	} = useTableGeneratorController({ tableData, onSubmitCallback });

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
							defaultSelectedKeys={["never"]}
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
											field.onChange,
											columnIndex
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
											backgroundColor: value?.toString() ?? DEFAULT_TABLE_COLOR
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
											field.onChange,
											rowIndex
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
											backgroundColor: value?.toString() ?? DEFAULT_TABLE_COLOR
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
									selectedKeys={field.value}
									disabled={availableForColumnsOptions.length === 0}
									options={availableColumns}
								/>
							)}
						/>
					</React.Fragment>
				))}
			</div>
			<div className="flex gap-4">
				<Button color="primary" type="submit">
					{isEdit ? "Save" : "Create"} table
				</Button>
				<Button color="secondary" type="button" onClick={() => reset()}>
					Reset form
				</Button>
			</div>
		</form>
	);
};
