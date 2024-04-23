import { Table } from "../../common/components/table/table.tsx";
import {
  characterTableDefault,
  daily,
  dailyTask,
  oneTimeTask,
  taskDataDefault
} from "../../common/constants";
import { Days } from "../../common/types";
import { useResetTable } from "../../hooks/useResetTable.tsx";
import { useState } from "react";
import "./table-view.scss";

export const TableView = () => {
  const [charTable, setCharTable] = useState(characterTableDefault);
  const { resetTable } = useResetTable();

  return (
    <>
      <div>
        <Table
          name={"x3 per CH"}
          data={charTable}
          timeTable={{ tableKey: "x3 per CH", dayOfReset: Days.Wednesday }}
        />
        <button
          onClick={() => {
            const res = resetTable("x3 per CH");
            if (res) {
              setCharTable(res);
            }
          }}
        >
          Reset Char
        </button>
      </div>

      <Table
        name={"Task"}
        data={taskDataDefault}
        timeTable={{ tableKey: "Task", dayOfReset: Days.Wednesday }}
      />

      <Table
        name={"1-T Task"}
        data={oneTimeTask}
        timeTable={{ tableKey: "1-T Task", dayOfReset: Days.Wednesday }}
      />

      <Table
        name={"Daily"}
        data={daily}
        timeTable={{ tableKey: "Daily", dayOfReset: Days.Wednesday }}
      />

      <Table
        name={"Daily Task"}
        data={dailyTask}
        timeTable={{ tableKey: "Daily Task", dayOfReset: Days.Wednesday }}
      />
    </>
  );
};
