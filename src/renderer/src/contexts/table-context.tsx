import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react";
import { TableDataType } from "../common/types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useResetTable } from "../hooks/useResetTable";

type TableContextType = {
	tables: TableDataType[];
	resetTable: (tableName: string) => void;
	deleteTable: (tableName: string) => void;
	saveTable: (data: TableDataType) => void;
	handleCheckBoxChange: (
		tableName: string,
		rowIndex: number,
		statusIndex: number,
		change: boolean
	) => void;
};

// TODO: bette type safety
const TableContext = createContext<TableContextType>({
	tables: []
} as unknown as TableContextType);

export const TableContextProvider = ({ children }: PropsWithChildren) => {
	const { getAll, removeFromStorage, saveToStorage, getFromStorage } = useLocalStorage();
	const { resetTable: reset } = useResetTable();

	const [tables, setTables] = useState<TableDataType[]>([]);

	useEffect(() => {
		setTables(getAll());
	}, [getAll]);

	// private:
	const updateState = useCallback(
		(tableName: string, resetAt: number | null = null) => {
			const nextTable = getFromStorage(tableName);
			const nextState = [...tables];
			const indexOfTable = nextState.findIndex((table) => table.tableName === tableName);

			if (indexOfTable === -1 && !nextTable) {
				console.error(`Cannot update TableContext state. Table called ${tableName} was not found!`);
				return;
			}

			if (nextTable && indexOfTable === -1) {
				setTables([...tables, nextTable]);
				return;
			}

			if (indexOfTable !== -1 && nextTable) {
				nextTable.resetAt = resetAt;
				nextState[indexOfTable] = nextTable;
				setTables(nextState);
				saveToStorage(nextTable);
			}
		},
		[getFromStorage, tables]
	);

	const handleTableResetAtRequestedTime = useCallback(() => {
		const now = new Date();
		const today = now.getDay();

		// if (now.getHours() >= 13) {
		tables.forEach((table) => {
			if (
				now.getHours() >= table.timeOfReset.hour &&
				now.getMinutes() >= table.timeOfReset.minute &&
				((table.resetAt && new Date(table.resetAt).getDay() !== today) || !table.resetAt) &&
				table.dayOfReset !== "never" &&
				(table.dayOfReset === "always" || table.dayOfReset === today)
			) {
				// TODO: implement batchResetTable
				reset(table.tableName);
				updateState(table.tableName, now.getTime());
			}
		});
		// }
	}, [tables, reset, updateState]);

	useEffect(() => {
		const date = new Date();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let interval: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let timeout: any;

		// on startup
		handleTableResetAtRequestedTime();

		// eslint-disable-next-line prefer-const
		timeout = setTimeout(
			() => {
				interval = setInterval(() => {
					handleTableResetAtRequestedTime();
				}, 60_000);
			},
			60 - date.getSeconds() * 1000
		);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [handleTableResetAtRequestedTime]);

	const removeFromState = useCallback(
		(tableName: string) => setTables([...tables].filter((table) => table.tableName !== tableName)),
		[tables]
	);

	// public:
	const resetTable = useCallback(
		(tableName: string) => {
			reset(tableName);
			updateState(tableName);
		},
		[reset, updateState]
	);

	const deleteTable = useCallback(
		(tableName: string) => {
			removeFromStorage(tableName);
			removeFromState(tableName);
		},
		[removeFromStorage, removeFromState]
	);

	const saveTable = useCallback(
		(data: TableDataType) => {
			saveToStorage(data);
			updateState(data.tableName);
		},
		[saveToStorage, updateState]
	);

	const handleCheckBoxChange = useCallback(
		(tableName: string, rowIndex: number, statusIndex: number, change: boolean) => {
			const tableIndex = tables.findIndex((table) => table.tableName === tableName);

			if (tableIndex === -1) {
				console.error(
					`Cannot update state of ${tableName} table because no such table exists in TableContext`
				);
				return;
			}

			const nextTable = { ...tables[tableIndex] };
			nextTable.rows[rowIndex].statuses[statusIndex] = change;

			const nextState = [...tables];
			nextState[tableIndex] = nextTable;

			setTables(nextState);
			saveToStorage(nextTable);
		},
		[saveToStorage, tables]
	);

	return (
		<TableContext.Provider
			value={{
				tables,
				resetTable,
				deleteTable,
				saveTable,
				handleCheckBoxChange
			}}
		>
			{children}
		</TableContext.Provider>
	);
};

export const useTableContext = () => {
	const context = useContext(TableContext);
	if (!context) {
		throw new Error("TableContext must be used within a Provider");
	}

	return context;
};
