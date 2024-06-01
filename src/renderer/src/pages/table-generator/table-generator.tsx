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
import { TimeInput } from "../../common/components/time-input/time-input";

export const TableGenerator = ({
	tableKey,
	tableData,
	onSubmitCallback,
	triggerSubmit,
	triggerSubmitCallback,
	triggerReset,
	triggerResetCallback,
	hasCustomActions
}: TableGeneratorProps) => {
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
		isEdit,
		dayOfResetValue
	} = useTableGeneratorController({
		tableKey,
		tableData,
		onSubmitCallback,
		triggerSubmit,
		triggerSubmitCallback,
		triggerReset,
		triggerResetCallback
	});

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

			<div className="flex gap-3">
				<Controller
					name="dayOfReset"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<Select
							disallowEmptySelection
							label="Day of reset"
							value={field.value}
							selectedKeys={[field.value]}
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
				<Controller
					name="timeOfReset"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<TimeInput
							isDisabled={dayOfResetValue === "never"}
							label="Time of reset"
							field={field}
							error={error}
						/>
					)}
				/>
			</div>

			{/*<Accordion defaultExpandedKeys="all" variant="bordered" selectionMode="multiple">*/}
			{/*	<AccordionItem key="1" title="Columns" className="color-picker-field-container">*/}
			<div style={{ border: "1px solid white", borderRadius: "10px", padding: "1rem" }}>
				columns:
				<div className="columns-container">
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
									<div className="flex flex-col h-full">
										<label className="row-color-label">Row cell color:</label>

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
									</div>
								)}
							/>
						</React.Fragment>
					))}
				</div>
			</div>
			{/*</AccordionItem>*/}
			{/*<AccordionItem key="2" title="Rows" className="color-picker-field-container">*/}
			<div style={{ border: "1px solid white", borderRadius: "10px", padding: "1rem" }}>
				rows:
				<div className="rows-container">
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
									<div className="flex flex-col h-full w-max">
										<label className="row-color-label">Row cell color:</label>

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
										selectedKeys={field.value.split(",")}
										disabled={availableForColumnsOptions.length === 0}
										options={availableColumns}
									/>
								)}
							/>
						</React.Fragment>
					))}
				</div>
			</div>
			{/*	</AccordionItem>*/}
			{/*</Accordion>*/}

			{!hasCustomActions && (
				<div className="flex gap-4">
					<Button color="primary" type="submit">
						{isEdit ? "Save" : "Create"} table
					</Button>
					<Button color="secondary" type="button" onClick={() => reset()}>
						Reset form
					</Button>
				</div>
			)}
		</form>
	);
};
