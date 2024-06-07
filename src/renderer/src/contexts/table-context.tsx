import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react";
import { TableDataType } from "../common/types";
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
	}, []);

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
			await writeToFileAsync(JSON.stringify(nextState));
		},
		[tables, writeToFileAsync]
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
				if (
					table.isNewlyAdded &&
					tableResetAt.getDate() === now.getDate() &&
					tableResetAt.getMonth() === now.getMonth()
				) {
					continue;
				}

				const shouldResetToday =
					(tableResetAt.getDate() !== now.getDate() ||
						(tableResetAt.getDate() === now.getDate() &&
							tableResetAt.getMonth() != now.getMonth())) &&
					// "5" == 5
					(table.dayOfReset == now.getDay() || table.dayOfReset === "always");

				if (
					(shouldResetToday && tableResetAt.getHours() > table.timeOfReset.hour) ||
					(tableResetAt.getHours() === table.timeOfReset.hour &&
						tableResetAt.getMinutes() >= table.timeOfReset.minute)
				) {
					if (tables[tableKey].tableName === "Daily ") {
						console.log("UFO Reset!", tables[tableKey]);
						console.log("UFO Reset! time now", now);
						console.log("UFO Reset! time in table", tableResetAt);
						console.log("UFO Reset! shouldResetToday", shouldResetToday);
					}
					const clearedTable = reset(tables[tableKey]);
					await updateState(tableKey, clearedTable, now.getTime(), true);
				}
			}
		},
		[reset, tables, updateState]
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

	// public:
	const resetTable = useCallback(
		async (tableKey: string) => {
			const clearedTable = reset(tables[tableKey]);
			await updateState(tableKey, clearedTable, new Date().getTime());
		},
		[reset, tables, updateState]
	);

	const deleteTable = useCallback(
		async (tableKey: string) => {
			await updateState(tableKey, null);
		},
		[updateState]
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
		[tables, writeToFileAsync]
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
		[tables, writeToFileAsync]
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
