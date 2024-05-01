import { useMemo } from "react";
import { TableDataType } from "../../types";
import "./table.scss";
import { useTableContext } from "../../../contexts/table-context.tsx";

type TableProps = {
  data: TableDataType;
};

export const Table = ({ data }: TableProps) => {
  const { handleCheckBoxChange, resetTable, deleteTable } = useTableContext();

  const generateColumns = useMemo(
    () =>
      data.columns.map((column, columnIndex) => (
        <th
          key={`column-${columnIndex}`}
          style={{
            backgroundColor: column.color
          }}
        >
          {column.name}
        </th>
      )),
    [data.columns]
  );

  const generateRows = useMemo(() => {
    return data.rows.map((row, rowIndex) => (
      <tr key={`row-${rowIndex}`}>
        <td style={{ backgroundColor: row.color }}>{row.name}</td>
        {row.statuses.map((status, statusIndex) => (
          <td
            key={`chkbox-${statusIndex}`}
            className={status ? "checked" : "un-checked"}
          >
            <input
              type="checkbox"
              checked={status}
              onChange={chkbox =>
                handleCheckBoxChange(
                  data.tableName,
                  rowIndex,
                  statusIndex,
                  chkbox.target.checked
                )
              }
            />
          </td>
        ))}
      </tr>
    ));
  }, [data.rows, data.tableName, handleCheckBoxChange]);

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>
              <div className="name-cell">
                <span className="name">{data.tableName}</span>
                <span className="reset">
                  Resets on:{" "}
                  <span className="reset-time">{data.timeOfReset}</span>
                </span>
              </div>
            </th>
            {generateColumns}
          </tr>
        </thead>
        <tbody>{generateRows}</tbody>
      </table>

      <div className="actions">
        <button onClick={() => deleteTable(data.tableName)}>Delete</button>
        <button onClick={() => resetTable(data.tableName)}>Reset</button>
      </div>
    </div>
  );
};
