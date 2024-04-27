import { ChangeEvent, useCallback, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./table-generator.scss";
import { Input } from "../../common/components/input/input.tsx";
import { ColorPicker } from "../../common/components/color-picker/color-picker.tsx";
import { Select } from "../../common/components/select/select.tsx";
import { mapFormDataToTableDataType } from "./table-generator-mapper.ts";
import { TableForm } from "./types.ts";
import { useTableContext } from "../../contexts/table-context.tsx";

export const TableGenerator = () => {
  const { saveTable } = useTableContext();

  const [colorPickerState, setColorPickerState] = useState<
    Record<string, boolean>
  >({});

  const { control, handleSubmit, reset } = useForm<TableForm>({
    defaultValues: {
      tableName: "",
      columns: [{ value: "", color: "#ffffff" }],
      rows: [{ value: "", color: "#ffffff" }]
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
            ? appendColumn({ value: "", color: "" })
            : removeColumn(-1);
          break;
        case "row":
          value.trim() ? appendRow({ value: "", color: "" }) : removeRow(-1);
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
              <Select field={field} error={error} />
            )}
          />
        </div>
      </fieldset>

      <fieldset>
        <div className="fieldset-element-container">
          <label>Columns:</label>
          {columnFields.map((column, columnIndex) => (
            <div key={column.id}>
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
                    field={field}
                    error={error}
                    value={field.value}
                    onChange={event => {
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
                  <div>
                    <div
                      className="color-picker-display"
                      style={{
                        backgroundColor: value?.toString() ?? "#ffffff"
                      }}
                      onClick={() => {
                        onColorPickerButtonClick(
                          true,
                          `columns.${columnIndex}.color`
                        );
                      }}
                    />
                    {colorPickerState[`columns.${columnIndex}.color`] && (
                      <ColorPicker
                        color={value}
                        onClose={color => {
                          onChange(color);
                          onColorPickerButtonClick(
                            false,
                            `columns.${columnIndex}.color`
                          );
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

      <fieldset>
        <div className="fieldset-element-container">
          <label>Rows:</label>
          {rowFields.map((row, rowIndex) => (
            <div key={row.id}>
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
                    field={field}
                    error={error}
                    value={field.value}
                    onChange={event => {
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
                  <div>
                    <div
                      className="color-picker-display"
                      style={{
                        backgroundColor: value?.toString() ?? "#ffffff"
                      }}
                      onClick={() => {
                        onColorPickerButtonClick(
                          true,
                          `rows.${rowIndex}.color`
                        );
                      }}
                    />
                    {colorPickerState[`rows.${rowIndex}.color`] && (
                      <ColorPicker
                        color={value}
                        onClose={color => {
                          onChange(color);
                          onColorPickerButtonClick(
                            false,
                            `rows.${rowIndex}.color`
                          );
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
