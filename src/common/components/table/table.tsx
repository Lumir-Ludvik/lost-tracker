import {useCallback, useEffect, useMemo, useState} from "react";
import {TableDataType, TimeTableType} from "../../types";
import "./table.scss";
import {useLocalStorage} from "../../../hooks/useLocalStorage.tsx";
import {useResetTable} from "../../../hooks/useResetTable.tsx";

type TableProps = {
    name: string;
    data: TableDataType
    timeTable: TimeTableType
}

export const Table = ({name, data, timeTable}: TableProps) => {
    const {saveToStorage, getFromStorage} = useLocalStorage();
    const {resetTable} = useResetTable()

    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const refreshAfterReset = useCallback(() => {
        const data = getFromStorage(name);

        if (!data) {
            console.error("No such table exists in localStorage. Check your table name");
            return;
        }

        const table = JSON.parse(data);

        setTableData(table);
    }, [getFromStorage, name])

    useEffect(() => {
        if (timeTable.dayOfReset === "always") {
            const ret = resetTable(name)
            if (ret) {
                setTableData(ret);
            }
        }

        const today = new Date().getDay();

        if (today === timeTable.dayOfReset) {
            const ret = resetTable(name)
            if (ret) {
                setTableData(ret);
            }
        }

    }, [name, refreshAfterReset, resetTable, timeTable])


    useEffect(() => {
        const data = getFromStorage(name);

        if (data) {
            setTableData(JSON.parse(data));
        }
    }, [getFromStorage, name])

    const onCheckboxChange = useCallback((rowIndex: number, statusIndex: number, change: boolean) => {
        const nextData = {...tableData}
        nextData.rows[rowIndex].statuses[statusIndex] = change;

        setTableData(nextData);
        saveToStorage(name, nextData);
    }, [tableData, saveToStorage, name])

    const generateColumns = useMemo(() => tableData.columns.map((column, columnIndex) => <th
        key={`column-${columnIndex}`}>{column}</th>), [tableData.columns]);

    const generateRows = useMemo(() => {
        return tableData.rows.map((row, rowIndex) =>
            <tr key={`row-${rowIndex}`}>
                <td>{row.name}</td>
                {row.statuses.map((status, statusIndex) =>
                    <td key={`chkbox-${statusIndex}`} className={status ? "checked" : "un-checked"}>
                        <input type="checkbox" checked={status}
                               onChange={(chkbox) => onCheckboxChange(rowIndex, statusIndex, chkbox.target.checked)}/>
                    </td>)}
            </tr>
        )
    }, [tableData.rows, onCheckboxChange])


    return <table className="custom-table">
        <thead>
        <tr>
            <th>{name}</th>
            {generateColumns}
        </tr>
        </thead>
        <tbody>
        {generateRows}
        </tbody>
    </table>
}
