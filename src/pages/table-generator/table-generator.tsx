import { ChangeEvent, useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./table-generator.scss";
import { Input } from "../../common/components/input/input.tsx";
import { ColorPicker } from "../../common/components/color-picker/color-picker.tsx";
import { Select } from "../../common/components/select/select.tsx";
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import { mapFormDataToTableDataType } from "./table-generator-mapper.ts";
import { TableForm } from "./types.ts";

export const TableGenerator = () => {
  const { saveToStorage } = useLocalStorage();

  const { control, handleSubmit, reset } = useForm<TableForm>({
    defaultValues: {
      tableName: "",
      columns: [{ value: "", color: "#ffffff", displayColorPicker: false }],
      rows: [{ value: "", color: "#ffffff", displayColorPicker: false }]
    }
  });

  const {
    update: columnUpdate,
    fields: columnFields,
    append: appendColumn,
    remove: removeColumn
  } = useFieldArray({
    control,
    name: "columns"
  });

  const {
    update: rowUpdate,
    fields: rowFields,
    append: appendRow,
    remove: removeRow
  } = useFieldArray({
    control,
    name: "rows"
  });

  const createTable = useCallback(
    (data: TableForm) => {
      saveToStorage(data.tableName, mapFormDataToTableDataType(data));
      reset();
    },
    [reset, saveToStorage]
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
            ? appendColumn({ value: "", color: "", displayColorPicker: false })
            : removeColumn(-1);
          break;
        case "row":
          value.trim()
            ? appendRow({ value: "", color: "", displayColorPicker: false })
            : removeRow(-1);
          break;
      }

      onChange(event);
    },
    [appendColumn, appendRow, removeColumn, removeRow]
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
            <Controller
              key={column.id}
              name={`columns.${columnIndex}`}
              control={control}
              rules={{
                required: { value: true, message: "This field is required" }
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    field={field}
                    error={error}
                    value={field.value.value}
                    onChange={event => {
                      handleInputChange(
                        event,
                        columnIndex + 1 === columnFields.length,
                        "column",
                        field.onChange
                      );
                    }}
                    onBlur={event => {
                      // TODO: dumb hack. Implement proper solution
                      columnUpdate(columnIndex, {
                        ...field.value,
                        value: (event.target as HTMLInputElement).value
                      });
                      field.onBlur();
                    }}
                  />
                  <div
                    className="color-picker-display"
                    style={{
                      backgroundColor:
                        field.value.color?.toString() ?? "#ffffff"
                    }}
                    onClick={() =>
                      columnUpdate(columnIndex, {
                        ...field.value,
                        displayColorPicker: true
                      })
                    }
                  />
                  {field.value.displayColorPicker && (
                    <ColorPicker
                      color={field.value.color}
                      onClose={color =>
                        columnUpdate(columnIndex, {
                          ...field.value,
                          displayColorPicker: false,
                          color: color
                        })
                      }
                    />
                  )}
                </>
              )}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <div className="fieldset-element-container">
          <label>Rows:</label>
          {rowFields.map((row, rowIndex) => (
            <Controller
              key={row.id}
              name={`rows.${rowIndex}`}
              control={control}
              rules={{
                required: { value: true, message: "This field is required" }
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    field={field}
                    error={error}
                    value={field.value.value}
                    onChange={event => {
                      handleInputChange(
                        event,
                        rowIndex + 1 === rowFields.length,
                        "row",
                        field.onChange
                      );
                    }}
                    onBlur={event => {
                      // TODO: dumb hack. Implement proper solution
                      rowUpdate(rowIndex, {
                        ...field.value,
                        value: (event.target as HTMLInputElement).value
                      });
                      field.onBlur();
                    }}
                  />
                  <div
                    className="color-picker-display"
                    style={{
                      backgroundColor: field.value.color?.toString()
                    }}
                    onClick={() => {
                      console.log("UFO", field.value.value);
                      rowUpdate(rowIndex, {
                        ...field.value,
                        displayColorPicker: true
                      });
                    }}
                  />
                  {field.value.displayColorPicker && (
                    <ColorPicker
                      color={field.value.color}
                      onClose={color => {
                        rowUpdate(rowIndex, {
                          ...field.value,
                          displayColorPicker: false,
                          color
                        });
                      }}
                    />
                  )}
                </>
              )}
            />
          ))}
        </div>
      </fieldset>
      <button type="submit">Create table</button>
    </form>
  );
};
