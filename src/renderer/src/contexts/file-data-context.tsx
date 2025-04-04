import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from "react";
import {
	FileStructureTablesType,
	FileStructureType,
	GameTabs,
	TableDataType
} from "../common/types";
import { useResetTable } from "../hooks/useResetTable";
import { useFileSystem } from "../hooks/useFileSystem";
import { uuidv4 } from "../common/utils";
import { clearTimeout } from "timers";
import { useLocation } from "react-router";
import { TabForm } from "../pages/table-generator/types";

type TableContextType = {
	saveTab: (data: TabForm, tabKey?: string) => Promise<void>;
	fileData: FileStructureType | null;
	resetTable: (tableKey: string, tabKey: string) => Promise<void>;
	deleteTable: (tabKey: string, tableKey: string) => void;
	saveTable: (data: TableDataType, tableKey?: string | null) => Promise<void>;
	deleteTab: (tabKey: string) => Promise<void>;
	getGameTabs: () => Promise<GameTabs[]>;
	handleCheckBoxChange: (
		tabKey: string,
		tableKey: string,
		rowIndex: number,
		statusIndex: number,
		change: boolean
	) => void;
};

// TODO: bette type safety
const FileDataContext = createContext<TableContextType>({
	tables: []
} as unknown as TableContextType);

export const FileDataContextProvider = ({ children }: PropsWithChildren) => {
	const { writeToFileAsync, readFileAsync } = useFileSystem();
	const location = useLocation();
	//TODO: why do I have this hook?
	const { resetTable: reset } = useResetTable();

	const [localFileData, setLocalFileData] = useState<FileStructureType | null>(null);
	const intervalsCreated = useRef(false);

	const getDataFromFile = useCallback(async (): Promise<FileStructureType | null> => {
		const data = await readFileAsync();

		if (!data) {
			// TODO: toast
			console.warn("Cannot read tables. File is missing!");
			return null;
		}

		return JSON.parse(data);
	}, [readFileAsync]);

	// private:
	useEffect(
		function refreshOnLocationChange() {
			void (async () => {
				const fileData = await getDataFromFile();

				if (!fileData) {
					return;
				}

				setLocalFileData(fileData);
			})();
		},
		[getDataFromFile, location]
	);

	const updateState = useCallback(
		async (nextState: FileStructureType) => {
			const res = await writeToFileAsync(JSON.stringify(nextState));

			if (res) {
				setLocalFileData(nextState);
			}

			return res;
		},
		[writeToFileAsync]
	);

	const updateTablesFile = useCallback(
		async (
			tableKey: string,
			tabKey: string,
			data: TableDataType,
			resetAt: number | null = null,
			isNoLongerNew: boolean = false
		) => {
			const fileData: FileStructureType | null = await getDataFromFile();

			if (!fileData) {
				console.error(`Cannot update TableContext state. Tables.txt is missing!`);
				return;
			}

			let tables = fileData[tabKey].tables;

			if (!tables) {
				tables = {
					[tableKey]: {
						...data,
						resetAt,
						isNewlyAdded: isNoLongerNew ? false : data.isNewlyAdded
					}
				};
			} else {
				tables = {
					...tables,
					[tableKey]: {
						...data,
						resetAt,
						isNewlyAdded: isNoLongerNew ? false : data.isNewlyAdded
					}
				};
			}

			fileData[tabKey].tables = tables;

			const res = await updateState(fileData);
			if (!res) {
				console.error(`Cannot update table with key: ${tableKey}. Writing to tables.txt failed!`);
			}
		},
		[getDataFromFile, updateState]
	);

	const handleTableResetAtRequestedTime = useCallback(async () => {
		const SEVEN_DAYS_IN_MS = 604_800_000;

		const fileData = await getDataFromFile();
		const now = new Date();

		// empty state
		if (!fileData && !localFileData) {
			return;
		}

		if (!fileData) {
			console.error("Failed to reset table. Tables.txt is missing!");
			return;
		}

		for (const tabKey of Object.keys(fileData)) {
			const tab = fileData[tabKey];

			if (!tab.tables) {
				continue;
			}

			for (const tableKey of Object.keys(tab.tables)) {
				const table = tab.tables[tableKey];

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

				const lastResetWasWeekOrMoreAgo =
					now.getTime() >= tableResetAt.getTime() + SEVEN_DAYS_IN_MS;

				const monthsAreDifferentButTheDayIsTheSame =
					tableResetAt.getDate() === now.getDate() && tableResetAt.getMonth() != now.getMonth();

				const isTableResetDayTodayOrAlways =
					table.dayOfReset === now.getDay().toString() || table.dayOfReset === "always";

				const shouldResetToday =
					(tableResetAt.getDate() !== now.getDate() || monthsAreDifferentButTheDayIsTheSame) &&
					isTableResetDayTodayOrAlways;

				const isItTimeDoctorFreeman =
					now.getHours() > table.timeOfReset.hour ||
					(now.getHours() === table.timeOfReset.hour &&
						now.getMinutes() >= table.timeOfReset.minute);

				if ((shouldResetToday || lastResetWasWeekOrMoreAgo) && isItTimeDoctorFreeman) {
					const selectedTable = fileData[tabKey].tables?.[tableKey];

					if (selectedTable) {
						const clearedTable = reset(selectedTable);
						await updateTablesFile(tableKey, tabKey, clearedTable, new Date().getTime(), true);
					}
				}
			}
		}
	}, [getDataFromFile, localFileData, reset, updateTablesFile]);

	const createTableResetInterval = useCallback(
		() =>
			setInterval(() => {
				void (async () => await handleTableResetAtRequestedTime())();
			}, 60_000),
		[handleTableResetAtRequestedTime]
	);

	useEffect(() => {
		// TODO: this is still being called 3x
		if (intervalsCreated.current) {
			return;
		}

		intervalsCreated.current = true;

		const now = new Date();
		const isWholeMinute = now.getSeconds() === 0 || now.getSeconds() === 59;

		let timeout: NodeJS.Timeout;
		let interval: NodeJS.Timeout;

		// first run at the start of the app
		void (async () => await handleTableResetAtRequestedTime())();

		if (!isWholeMinute) {
			const timeoutMs = (60 - now.getSeconds()) * 1000;

			timeout = setTimeout(() => {
				void (async () => await handleTableResetAtRequestedTime())();

				interval = createTableResetInterval();
			}, timeoutMs);
		} else {
			interval = createTableResetInterval();
		}

		return () => {
			intervalsCreated.current = false;
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, [createTableResetInterval, handleTableResetAtRequestedTime]);

	// public:
	const resetTable = useCallback(
		async (tableKey: string, tabKey: string) => {
			const fileData = await getDataFromFile();

			if (!fileData) {
				console.error("Cannot reset table. Tables.txt is missing!");
				return;
			}

			const selectedTable = fileData[tabKey].tables?.[tableKey];

			if (selectedTable) {
				const clearedTable = reset(selectedTable);
				await updateTablesFile(tableKey, tabKey, clearedTable, new Date().getTime());
			}
		},
		[getDataFromFile, reset, updateTablesFile]
	);

	const deleteTable = useCallback(
		async (tabKey: string, tableKey: string) => {
			const fileData = await getDataFromFile();

			if (!fileData) {
				console.error("Cannot delete table. Tables.txt is missing!");
				return;
			}

			const nextTables: FileStructureTablesType = {};
			const tables = fileData[tabKey].tables;

			if (!tables) {
				return;
			}

			Object.keys(tables)
				.filter((key) => key !== tableKey)
				.map((key) => {
					nextTables[key] = tables[key];
				});

			fileData[tabKey].tables = nextTables;

			const res = await updateState(fileData);

			if (!res) {
				console.error("Cannot delete table. Writing to tables.txt failed!");
			}
		},
		[getDataFromFile, updateState]
	);

	const saveTable = useCallback(
		async (data: TableDataType, tableKey: string | undefined | null = null) => {
			void (async () => {
				const fileData = (await getDataFromFile()) ?? {};

				let tables = fileData[data.tabKey].tables;

				if (!tables) {
					tables = {
						[tableKey == null ? uuidv4() : tableKey]: data
					};
				} else {
					tables = {
						...tables,
						[tableKey == null ? uuidv4() : tableKey]: data
					};
				}

				fileData[data.tabKey].tables = tables;

				const res = await updateState(fileData);
				if (!res) {
					// TODO: add error toast for user
					console.error("Failed to save table data! Please try again.");
				}
			})();
		},
		[getDataFromFile, updateState]
	);

	const saveTab = useCallback(
		async (data: TabForm, tabKey?: string) => {
			void (async () => {
				const newKey = uuidv4();
				let nextData = (await getDataFromFile()) ?? {};

				nextData = {
					...nextData,
					[tabKey ? tabKey : newKey]: {
						tabName: data.tabName,
						tables: tabKey ? nextData[tabKey].tables : null
					}
				};

				const res = await updateState(nextData);
				if (!res) {
					// TODO: add error toast for user
					console.error("Failed to create new Game Tab! Please try again.");
				}
			})();
		},
		[getDataFromFile, updateState]
	);

	const handleCheckBoxChange = useCallback(
		async (
			tabKey: string,
			tableKey: string,
			rowIndex: number,
			statusIndex: number,
			change: boolean
		) => {
			const fileData = await getDataFromFile();

			if (!fileData) {
				console.error("Cannot toggle checkbox because tables.txt is missing!");
				return;
			}

			const tables = fileData[tabKey].tables;

			if (!fileData[tabKey].tables?.[tableKey]) {
				console.error(
					`Cannot update state of table with key ${tableKey} because no such table exists in TableContext`
				);
				return;
			}

			const nextState = { ...tables };
			nextState[tableKey].rows[rowIndex].statuses[statusIndex] = change;
			fileData[tabKey].tables = tables;

			const res = await updateState(fileData);
			if (!res) {
				console.error(
					`Cannot toggle checkbox for table with key: ${tableKey}. Writing to tables.txt failed!`
				);
			}
		},
		[getDataFromFile, updateState]
	);

	const getGameTabs = useCallback(async () => {
		const fileData = await getDataFromFile();

		if (!fileData) {
			return [];
		}

		return Object.keys(fileData).map((key) => ({
			name: fileData[key].tabName,
			key: key
		}));
	}, [getDataFromFile]);

	const deleteTab = useCallback(
		async (tabKey: string) => {
			const fileData = await getDataFromFile();

			if (!fileData) {
				console.error("Cannot delete tab. Tables.txt is missing!");
				return;
			}

			const nextFileData: FileStructureType = Object.keys(fileData).reduce((acc, cur) => {
				if (cur !== tabKey) {
					acc[cur] = fileData[cur];
				}

				return acc;
			}, {});

			const res = await updateState(nextFileData);
			if (!res) {
				// TODO: add error toast for user
				console.error("Failed to delete Game Tab! Please try again.");
			}
		},
		[getDataFromFile, updateState]
	);

	return (
		<FileDataContext.Provider
			value={{
				fileData: localFileData,
				resetTable,
				deleteTable,
				saveTable,
				handleCheckBoxChange,
				saveTab,
				getGameTabs,
				deleteTab
			}}
		>
			{children}
		</FileDataContext.Provider>
	);
};

export const useFileDataContext = () => {
	const context = useContext(FileDataContext);
	if (!context) {
		throw new Error("FileDataContext must be used within a Provider");
	}

	return context;
};
