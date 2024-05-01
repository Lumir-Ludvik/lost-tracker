import { ChangeEvent, useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./table-generator.scss";

import { Days, DaysSort, DaysSortType } from "../../common/types";
import { useTableContext } from "../../contexts/table-context";
import { TableForm } from "./types";
import { mapFormDataToTableDataType } from "./table-generator-mapper";
import { Input } from "../../common/components/input/input";
import { Select } from "../../common/components/select/select";
import { ColorPicker } from "../../common/components/color-picker/color-picker";

export const TableGenerator = () => {
  const { saveTable } = useTableContext();

  const [colorPickerState, setColorPickerState] = useState<Record<string, boolean>>({});

  const { control, handleSubmit, reset } = useForm<TableForm>({
    defaultValues: {
      tableName: "",
      timeOfReset: "always",
      columns: [{ value: "", color: "#8B0000FF" }],
      rows: [{ value: "", color: "#8B0000FF" }]
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
            ? appendRow({ value: "", color: "#8B0000FF" }, { shouldFocus: false })
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

  return (
    <form className="table-generator" onSubmit={handleSubmit(createTable)}>
      <fieldset>
        <div>
          <label>Table name:</label>
          <Controller
            name="tableName"
            control={control}
            rules={{
              required: { value: true, message: "This field is required" }
            }}
            render={({ field, fieldState: { error } }) => (
              <Input field={field} error={error} value={field.value} />
            )}
          />
        </div>
      </fieldset>

      <fieldset>
        <div>
          <label>Day of reset:</label>
          <Controller
            name="timeOfReset"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                field={field}
                error={error}
                onChange={(event) => {
                  field.onChange((event.currentTarget as HTMLSelectElement).value);
                }}
              >
                <option key={`time-of-reset-always`} value="always">
                  Always
                </option>
                {Object.keys(Days)
                  .filter((key) => isNaN(Number(key)))
                  .sort(
                    (a, b) =>
                      DaysSort.indexOf(a as DaysSortType) - DaysSort.indexOf(b as DaysSortType)
                  )
                  .map((day) => (
                    <option key={`time-of-reset-${day}`} value={day}>
                      {day}
                    </option>
                  ))}
              </Select>
            )}
          />
        </div>
      </fieldset>

      <label>Columns:</label>
      <fieldset>
        <div className="fieldset-element-container">
          {columnFields.map((column, columnIndex) => (
            <div key={column.id} className="fieldset-column">
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
                  <div>
                    <label htmlFor={`column-name-${columnIndex}`}>Column name:</label>
                    <Input
                      id={`column-name-${columnIndex}`}
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
                  </div>
                )}
              />
              <Controller
                name={`columns.${columnIndex}.color`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div>
                    <label>Column cell color:</label>
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
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <label>Rows:</label>
      <fieldset>
        <div className="fieldset-element-container">
          {rowFields.map((row, rowIndex) => (
            <div key={row.id} className="fieldset-row">
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
                  <div>
                    <label>Row name:</label>
                    <Input
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
                  </div>
                )}
              />

              <Controller
                name={`rows.${rowIndex}.color`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div>
                    <label>Row cell color:</label>
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
            </div>
          ))}
        </div>
      </fieldset>
      <button type="submit">Create table</button>
    </form>
  );
};
