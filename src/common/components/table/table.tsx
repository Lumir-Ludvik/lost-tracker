import { useCallback, useEffect, useMemo, useState } from "react";
import { TableDataType } from "../../types";
import "./table.scss";
import { useLocalStorage } from "../../../hooks/useLocalStorage.tsx";
import { useResetTable } from "../../../hooks/useResetTable.tsx";

type TableProps = {
  data: TableDataType;
};

export const Table = ({ data }: TableProps) => {
  const { saveToStorage, getFromStorage, removeFromStorage } =
    useLocalStorage();
  const { resetTable } = useResetTable();

  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const refreshAfterReset = useCallback(() => {
    const data = getFromStorage(tableData.tableName);

    if (!data) {
      console.error(
        "No such table exists in localStorage. Check your table name"
      );
      return;
    }

    const table = JSON.parse(data);

    setTableData(table);
  }, [getFromStorage, tableData.tableName]);

  useEffect(() => {
    if (tableData.timeOfReset === "always") {
      const ret = resetTable(tableData.tableName);
      if (ret) {
        setTableData(ret);
      }
    }

    const today = new Date().getDay();

    if (today === tableData.timeOfReset) {
      const ret = resetTable(tableData.tableName);
      if (ret) {
        setTableData(ret);
      }
    }
  }, [
    tableData.tableName,
    refreshAfterReset,
    resetTable,
    tableData.timeOfReset
  ]);

  useEffect(() => {
    const data = getFromStorage(tableData.tableName);

    if (data) {
      setTableData(JSON.parse(data));
    }
  }, [getFromStorage, tableData.tableName]);

  const onCheckboxChange = useCallback(
    (rowIndex: number, statusIndex: number, change: boolean) => {
      const nextData = { ...tableData };
      nextData.rows[rowIndex].statuses[statusIndex] = change;

      setTableData(nextData);
      saveToStorage(tableData.tableName, nextData);
    },
    [tableData, saveToStorage]
  );

  const generateColumns = useMemo(
    () =>
      tableData.columns.map((column, columnIndex) => (
        <th
          key={`column-${columnIndex}`}
          style={{
            backgroundColor: column.color
          }}
        >
          {column.name}
        </th>
      )),
    [tableData.columns]
  );

  const generateRows = useMemo(() => {
    return tableData.rows.map((row, rowIndex) => (
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
                onCheckboxChange(rowIndex, statusIndex, chkbox.target.checked)
              }
            />
          </td>
        ))}
      </tr>
    ));
  }, [tableData.rows, onCheckboxChange]);

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>{tableData.tableName}</th>
            {generateColumns}
          </tr>
        </thead>
        <tbody>{generateRows}</tbody>
      </table>

      <div className="actions">
        <button onClick={() => removeFromStorage(tableData.tableName)}>
          Delete
        </button>
        <button onClick={() => resetTable(tableData.tableName)}>Reset</button>
      </div>
    </div>
  );
};
