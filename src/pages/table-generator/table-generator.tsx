import { ChangeEvent, useCallback } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./table-generator.scss";
import { Input } from "../../common/components/input/input.tsx";
import { SketchPicker } from "react-color";

type ElementType = {
  value: string;
  color?: string;
  displayColorPicker: boolean;
};

type TableForm = {
  tableName: string;
  columns: ElementType[];
  rows: ElementType[];
};

export const TableGenerator = () => {
  const { control, handleSubmit } = useForm<TableForm>({
    defaultValues: {
      tableName: "",
      columns: [{ value: "", color: "", displayColorPicker: false }],
      rows: [{ value: "", color: "", displayColorPicker: false }]
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

  const createTable = useCallback(data => {
    debugger;
  }, []);

  const handleInputChange = useCallback(
    (
      event: ChangeEvent<unknown>,
      isLast: boolean,
      typeOfInput: "row" | "column",
      onChange: (...event: unknown[]) => void
    ) => {
      const value = (event.target as HTMLInputElement).value;

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
              <Input field={field} error={error} value={field.value.trim()} />
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
                    value={field.value.value?.trim()}
                    onChange={event => {
                      handleInputChange(
                        event,
                        columnIndex + 1 === columnFields.length,
                        "column",
                        field.onChange
                      );
                    }}
                  />
                  <div
                    className="color-picker-display"
                    style={{ backgroundColor: field.value.color }}
                    onClick={() =>
                      columnUpdate(columnIndex, {
                        ...field.value,
                        displayColorPicker: true
                      })
                    }
                  />
                  {field.value.displayColorPicker && (
                    <div className="color-picker-container">
                      <div
                        className="color-picker-close-div"
                        onClick={() =>
                          columnUpdate(columnIndex, {
                            ...field.value,
                            displayColorPicker: false
                          })
                        }
                      />
                      <SketchPicker
                        color={field.value.color}
                        onChange={color =>
                          columnUpdate(columnIndex, {
                            ...field.value,
                            color: color.hex
                          })
                        }
                      />
                    </div>
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
                    value={field.value.value?.trim()}
                    onChange={event => {
                      handleInputChange(
                        event,
                        rowIndex + 1 === rowFields.length,
                        "row",
                        field.onChange
                      );
                    }}
                  />
                  <div
                    className="color-picker-display"
                    style={{ backgroundColor: field.value.color }}
                    onClick={() =>
                      rowUpdate(rowIndex, {
                        ...field.value,
                        displayColorPicker: true
                      })
                    }
                  />
                  {field.value.displayColorPicker && (
                    <div className="color-picker-container">
                      <div
                        className="color-picker-close-div"
                        onClick={() =>
                          rowUpdate(rowIndex, {
                            ...field.value,
                            displayColorPicker: false
                          })
                        }
                      />
                      <SketchPicker
                        color={field.value.color}
                        onChange={color =>
                          rowUpdate(rowIndex, {
                            ...field.value,
                            color: color.hex
                          })
                        }
                      />
                    </div>
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
