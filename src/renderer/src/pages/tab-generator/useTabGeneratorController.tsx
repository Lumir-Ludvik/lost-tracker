import { useForm } from "react-hook-form";
import { emptyTabForm, TabForm } from "../table-generator/types";
import { useCallback } from "react";
import { useFileDataContext } from "../../contexts/file-data-context";

export const useTabGeneratorController = () => {
	const { saveTab } = useFileDataContext();

	const { control, handleSubmit, reset } = useForm<TabForm>({
		defaultValues: emptyTabForm
	});

	const createTab = useCallback(
		async (data: TabForm) => {
			await saveTab(data);
			reset();
		},
		[saveTab, reset]
	);

	return {
		control,
		handleSubmit,
		reset,
		createTab
	};
};
