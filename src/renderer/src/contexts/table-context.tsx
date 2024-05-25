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
import { useFileSystem } from "../hooks/useFileSystem";
import { uuidv4 } from "../common/utils";
import { clearTimeout } from "timers";

type TablesType = Record<string, TableDataType>;

type TableContextType = {
	tables: Record<string, TableDataType>;
	resetTable: (tableName: string) => Promise<void>;
	deleteTable: (tableName: string) => void;
	saveTable: (data: TableDataType, tableKey?: string | null) => Promise<void>;
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
	const { writeToFileAsync, readFileAsync } = useFileSystem();
	const { getAll, removeFromStorage, saveToStorage, getFromStorage } = useLocalStorage();
	//TODO: why do I have this hook?
	const { resetTable: reset } = useResetTable();

	const [tables, setTables] = useState<TablesType>({});

	useEffect(() => {
		void (async () => {
			const data = await readFileAsync();
			if (!data) {
				// TODO: toast
				return;
			}

			setTables(JSON.parse(data));
		})();
	}, [getAll]);

	// private:
	const updateState = useCallback(
		async (
			tableKey: string,
			data: TableDataType | null,
			resetAt: number | null = null,
			isNoLongerNew: boolean = false
		) => {
			if (!tables[tableKey]) {
				console.error(
					`Cannot update TableContext state. Table with key ${tableKey} was not found!`
				);
				return;
			}

			let nextState: TablesType = {};

			if (!data) {
				Object.keys(tables)
					.filter((key) => key !== tableKey)
					.forEach((key) => {
						nextState[key] = tables[key];
					});
			} else {
				nextState = { ...tables };
				nextState[tableKey] = {
					...data,
					resetAt,
					isNewlyAdded: isNoLongerNew ? false : data.isNewlyAdded
				};
			}

			setTables(nextState);
			//TODO: implement update to file
			await writeToFileAsync(JSON.stringify(nextState));
		},
		[getFromStorage, tables]
	);

	const handleTableResetAtRequestedTime = useCallback(
		async (now: Date) => {
			for (const tableKey of Object.keys(tables)) {
				const table = tables[tableKey];
				// table never resets
				if (!table.resetAt || table.dayOfReset === "never") {
					continue;
				}

				const tableResetAt = new Date(table.resetAt);

				// newly created table
				if (table.isNewlyAdded && tableResetAt.getDate() === now.getDate()) {
					continue;
				}

				const shouldResetToday =
					tableResetAt.getDate() !== now.getDate() &&
					(table.dayOfReset === tableResetAt.getDay() || table.dayOfReset === "always");

				if (
					(shouldResetToday && tableResetAt.getHours() > table.timeOfReset.hour) ||
					(tableResetAt.getHours() === table.timeOfReset.hour &&
						tableResetAt.getMinutes() >= table.timeOfReset.minute)
				) {
					const clearedTable = reset(tables[tableKey]);
					await updateState(tableKey, clearedTable, now.getTime(), true);
				}
			}
		},
		[tables]
	);

	useEffect(() => {
		const now = new Date();
		const isWholeMinute = now.getSeconds() === 0 || now.getSeconds() === 59;

		let timeout: NodeJS.Timeout;
		let interval: NodeJS.Timeout;

		// first run at the start of the app
		void (async () => await handleTableResetAtRequestedTime(now))();

		if (!isWholeMinute) {
			const timeoutMs = (60 - now.getSeconds()) * 1000;

			timeout = setTimeout(() => {
				void (async () => await handleTableResetAtRequestedTime(now))();

				interval = setInterval(() => {
					void (async () => await handleTableResetAtRequestedTime(now))();
				}, 60_000);
			}, timeoutMs);
		} else {
			interval = setInterval(() => {
				void (async () => await handleTableResetAtRequestedTime(now))();
			}, 60_000);
		}

		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, [handleTableResetAtRequestedTime]);

	const removeFromState = useCallback(
		(removeKey: string) => {
			const nextTables = {};

			Object.keys(tables)
				.filter((tableKey) => tableKey !== removeKey)
				.forEach((key) => {
					nextTables[key] = tables[key];
				});

			setTables(nextTables);
		},
		[tables]
	);

	// public:
	const resetTable = useCallback(
		async (tableKey: string) => {
			const clearedTable = reset(tables[tableKey]);
			await updateState(tableKey, clearedTable, new Date().getTime());
		},
		[reset, updateState]
	);

	const deleteTable = useCallback(
		async (tableKey: string) => {
			await updateState(tableKey, null);
		},
		[removeFromStorage, removeFromState]
	);

	const saveTable = useCallback(
		async (data: TableDataType, tableKey: string | null = null) => {
			void (async () => {
				let nextTables = { ...tables };

				if (tableKey) {
					nextTables[tableKey] = data;
				} else {
					const newKey = uuidv4();
					nextTables = { ...nextTables, [newKey]: data };
				}

				const res = await writeToFileAsync(JSON.stringify(nextTables));
				if (!res) {
					// TODO: add error toast for user
				}

				setTables(nextTables);
			})();
		},
		[saveToStorage, updateState]
	);

	const handleCheckBoxChange = useCallback(
		async (tableKey: string, rowIndex: number, statusIndex: number, change: boolean) => {
			if (!tables[tableKey]) {
				console.error(
					`Cannot update state of table with key ${tableKey} because no such table exists in TableContext`
				);
				return;
			}

			const nextState = { ...tables };
			nextState[tableKey].rows[rowIndex].statuses[statusIndex] = change;

			setTables(nextState);
			await writeToFileAsync(JSON.stringify(nextState));
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
