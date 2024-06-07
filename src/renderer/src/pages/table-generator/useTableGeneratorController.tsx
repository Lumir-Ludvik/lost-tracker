import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnElementType, emptyForm, RowElementType, TableForm, TypeOfInput } from "./types";
import { mapFormDataToTableDataType, mapTableDataTypeToFormData } from "./table-generator-mapper";
import { Days, DaysSort, DaysSortType, TableDataType } from "../../common/types";
import { useTableContext } from "../../contexts/table-context";
import { SelectOptions } from "../../common/components/select/select";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { DEFAULT_TABLE_COLOR } from "../../common/constants";

const DEFAULT_COLUMN: ColumnElementType = { value: "", color: DEFAULT_TABLE_COLOR };
const DEFAULT_ROW: RowElementType = {
	value: "",
	color: DEFAULT_TABLE_COLOR,
	availableFor: "",
	statuses: []
};

type UseTableGeneratorControllerProps = {
	tableKey?: string;
	tableData?: TableDataType;
	onSubmitCallback?: () => void;
	triggerSubmit?: boolean;
	triggerSubmitCallback?: (value: boolean) => void;
	triggerReset?: boolean;
	triggerResetCallback?: (value: boolean) => void;
};

export const useTableGeneratorController = ({
	tableKey,
	tableData,
	onSubmitCallback,
	triggerReset,
	triggerSubmit,
	triggerSubmitCallback,
	triggerResetCallback
}: UseTableGeneratorControllerProps) => {
	const { saveTable } = useTableContext();
	const editEffectCheck = useRef(false);
	const tableSavedCheck = useRef(false);

	const [isEdit, setIsEdit] = useState(false);
	const [colorPickerState, setColorPickerState] = useState<Record<string, boolean>>({});
	const [availableColumns, setAvailableColumns] = useState<SelectOptions[]>([]);

	const { control, trigger, handleSubmit, getValues, reset } = useForm<TableForm>({
		defaultValues: emptyForm
	});
	const dayOfResetValue = useWatch({ control, name: "dayOfReset" });

	const {
		fields: columnFields,
		append: appendColumn,
		remove: removeColumn
	} = useFieldArray({
		control,
		name: "columns"
	});

	const {
		fields: rowFields,
		append: appendRow,
		remove: removeRow
	} = useFieldArray({
		control,
		name: "rows"
	});

	useEffect(
		function triggerResetForCustomControls() {
			if (!triggerReset) {
				return;
			}

			reset();
			appendColumn(DEFAULT_COLUMN, { shouldFocus: false });
			appendRow(DEFAULT_ROW, { shouldFocus: false });
			triggerResetCallback?.(false);
		},
		[appendColumn, appendRow, reset, triggerReset, triggerResetCallback]
	);

	const createTable = useCallback(
		async (data: TableForm) => {
			if (tableSavedCheck.current) {
				return;
			}

			await saveTable(mapFormDataToTableDataType(data), isEdit ? tableKey : null);
			reset();
			onSubmitCallback?.();
			tableSavedCheck.current = true;
		},
		[saveTable, isEdit, tableKey, reset, onSubmitCallback]
	);

	useEffect(
		function triggerSubmitForCustomControls() {
			if (!triggerSubmit) {
				return;
			}

			void (async () => {
				const res = await trigger();

				if (!res) {
					return;
				}

				await handleSubmit(createTable)();
				triggerSubmitCallback?.(false);
			})();
		},
		[createTable, handleSubmit, trigger, triggerSubmit, triggerSubmitCallback]
	);

	const availableForColumnsOptions = useCallback(
		(tableData: TableDataType | null = null) => {
			// TODO: add debounce
			const source = tableData ? tableData.columns : getValues("columns");
			const duplicateMap = {};

			const res = source
				.map((column, index: number) => {
					if (duplicateMap[column.value]) {
						return {
							label: `${column.value} (${index + 1})`,
							value: index
						};
					}

					duplicateMap[column.value] = index;

					return {
						label: column.value,
						value: index
					};
				})
				.filter((option) => option.label !== "");

			setAvailableColumns(res);
		},
		[getValues]
	);

	useEffect(
		function applyDataToEditForm() {
			if (!isEdit && !tableData && !editEffectCheck.current) {
				editEffectCheck.current = false;
				return;
			}

			if (editEffectCheck.current) {
				return;
			}

			setIsEdit(!!tableData);
			availableForColumnsOptions(tableData);
			reset(mapTableDataTypeToFormData(tableData!));
			appendColumn(DEFAULT_COLUMN, { shouldFocus: false });
			appendRow(DEFAULT_ROW, { shouldFocus: false });
			editEffectCheck.current = true;
		},
		[availableForColumnsOptions, editEffectCheck, tableData, isEdit, reset, appendColumn, appendRow]
	);

	const handleInputChange = useCallback(
		(
			event: ChangeEvent<unknown>,
			isLast: boolean,
			typeOfInput: TypeOfInput,
			onChange: (...event: unknown[]) => void,
			currentIndex: number
		) => {
			const value = (event.target as HTMLInputElement).value;
			if (!isLast && value) {
				onChange(event);
				availableForColumnsOptions();
				return;
			}

			switch (typeOfInput) {
				case "column":
					value ? appendColumn(DEFAULT_COLUMN, { focusIndex: currentIndex }) : removeColumn(-1);
					break;
				case "row":
					value ? appendRow(DEFAULT_ROW, { focusIndex: currentIndex }) : removeRow(-1);
					break;
			}

			onChange(event);
			availableForColumnsOptions();
		},
		[appendColumn, availableForColumnsOptions, appendRow, removeColumn, removeRow]
	);

	const onColorPickerButtonClick = useCallback(
		(state: boolean, key: string) => {
			const nextState = { ...colorPickerState };
			nextState[key] = state;

			setColorPickerState(nextState);
		},
		[colorPickerState]
	);

	const dayOfResetOptions = useMemo(
		() => [
			{
				value: "never",
				label: "Never"
			},
			{
				value: "always",
				label: "Always"
			},
			...Object.keys(Days)
				.filter((key) => isNaN(Number(key)))
				.sort((a, b) => DaysSort.indexOf(a as DaysSortType) - DaysSort.indexOf(b as DaysSortType))
				.map((day) => ({ value: Days[day], label: day }))
		],
		[]
	);

	return {
		dayOfResetOptions,
		onColorPickerButtonClick,
		handleInputChange,
		availableForColumnsOptions,
		createTable,
		handleSubmit,
		control,
		columnFields,
		rowFields,
		colorPickerState,
		availableColumns,
		reset,
		isEdit,
		dayOfResetValue
	};
};
