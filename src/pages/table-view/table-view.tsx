import { useEffect, useState } from "react";
import "./table-view.scss";
import { useLocalStorage } from "../../hooks/useLocalStorage.tsx";
import { TableDataType } from "../../common/types";
import { Table } from "../../common/components/table/table.tsx";

export const TableView = () => {
  const { getAll } = useLocalStorage();

  const [tables, setTables] = useState<TableDataType[]>([]);

  useEffect(() => {
    setTables(getAll());
  }, [getAll]);

  //TODO: add context for table data and functions for reset and delete
  return (
    <div className="table-view">
      {tables.map((table, tableIndex) => (
        <Table key={`table-${tableIndex}`} data={table} />
      ))}
    </div>
  );
};
