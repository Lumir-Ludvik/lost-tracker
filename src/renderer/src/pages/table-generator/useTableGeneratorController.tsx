import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { emptyForm, TableForm, TypeOfInput } from "./types";
import { mapFormDataToTableDataType, mapTableDataTypeToFormData } from "./table-generator-mapper";
import { Days, DaysSort, DaysSortType, TableDataType } from "../../common/types";
import { useTableContext } from "../../contexts/table-context";
import { SelectOptions } from "../../common/components/select/select";
import { useFieldArray, useForm } from "react-hook-form";
import { DEFAULT_TABLE_COLOR } from "../../common/constants";

const DEFAULT_COLUMN = { value: "", color: DEFAULT_TABLE_COLOR };
const DEFAULT_ROW = { value: "", color: DEFAULT_TABLE_COLOR, availableFor: "" };

type UseTableGeneratorControllerProps = {
	tableData?: TableDataType;
	onSubmitCallback?: () => void;
};

export const useTableGeneratorController = ({
	tableData,
	onSubmitCallback
}: UseTableGeneratorControllerProps) => {
	const { saveTable } = useTableContext();
	const editEffectCheck = useRef(false);

	const [isEdit, setIsEdit] = useState(false);
	const [colorPickerState, setColorPickerState] = useState<Record<string, boolean>>({});
	const [availableColumns, setAvailableColumns] = useState<SelectOptions[]>([]);

	useEffect(() => {
		if (!isEdit && !tableData && !editEffectCheck.current) {
			editEffectCheck.current = false;
			return;
		}

		if (editEffectCheck.current) {
			return;
		}

		setIsEdit(!!tableData);
		reset(mapTableDataTypeToFormData(tableData!));
		appendColumn(DEFAULT_COLUMN, { shouldFocus: false });
		appendRow(DEFAULT_ROW, { shouldFocus: false });
		availableForColumnsOptions();
		editEffectCheck.current = true;
	}, []);

	const { control, handleSubmit, getValues, reset } = useForm<TableForm>({
		defaultValues: emptyForm
	});

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

	const createTable = useCallback(
		(data: TableForm) => {
			saveTable(mapFormDataToTableDataType(data));
			reset();
			onSubmitCallback?.();
		},
		[reset, saveTable]
	);

	const availableForColumnsOptions = useCallback(() => {
		// TODO: add debounce
		const res = getValues("columns")
			.map((column, index) => ({
				label: column.value,
				value: index
			}))
			.filter((option) => option.label !== "");

		setAvailableColumns(res);
	}, []);

	const handleInputChange = useCallback(
		(
			event: ChangeEvent<unknown>,
			isLast: boolean,
			typeOfInput: TypeOfInput,
			onChange: (...event: unknown[]) => void
		) => {
			const value = (event.target as HTMLInputElement).value;
			if (!isLast && value) {
				onChange(event);
				availableForColumnsOptions();
				return;
			}

			switch (typeOfInput) {
				case "column":
					value ? appendColumn(DEFAULT_COLUMN, { shouldFocus: false }) : removeColumn(-1);
					break;
				case "row":
					value ? appendRow(DEFAULT_ROW, { shouldFocus: false }) : removeRow(-1);
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
				.map((day) => ({ value: day, label: day }))
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
		isEdit
	};
};
