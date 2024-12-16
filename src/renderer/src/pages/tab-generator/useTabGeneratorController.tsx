import { useForm } from "react-hook-form";
import { emptyTabForm, TabForm } from "../table-generator/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFileDataContext } from "../../contexts/file-data-context";
import { TabType } from "../../common/types";

type UseTabGeneratorControllerProps = {
	tabData?: TabType;
	onSubmitCallback?: () => void;
	triggerSubmit?: boolean;
	triggerSubmitCallback?: (value: boolean) => void;
	triggerReset?: boolean;
	triggerResetCallback?: (value: boolean) => void;
};

export const useTabGeneratorController = ({
	tabData,
	triggerSubmitCallback,
	triggerResetCallback,
	triggerReset,
	triggerSubmit,
	onSubmitCallback
}: UseTabGeneratorControllerProps) => {
	const { saveTab } = useFileDataContext();
	const editEffectCheck = useRef(false);
	const [isEdit, setIsEdit] = useState(false);

	const { control, trigger, handleSubmit, reset } = useForm<TabForm>({
		defaultValues: emptyTabForm
	});

	useEffect(
		function applyDataToEditForm() {
			if (!isEdit && !tabData && !editEffectCheck.current) {
				editEffectCheck.current = false;
				return;
			}

			if (editEffectCheck.current) {
				return;
			}

			reset(tabData);
			setIsEdit(!!tabData);
		},
		[isEdit, reset, tabData]
	);

	const createTab = useCallback(
		async (data: TabForm) => {
			await saveTab(data, tabData?.tabKey);
			reset();
			onSubmitCallback?.();
		},
		[saveTab, tabData?.tabKey, reset, onSubmitCallback]
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

				await handleSubmit(createTab)();
				triggerSubmitCallback?.(false);
			})();
		},
		[createTab, handleSubmit, trigger, triggerSubmit, triggerSubmitCallback]
	);

	useEffect(
		function triggerResetForCustomControls() {
			if (!triggerReset) {
				return;
			}

			reset();
			triggerResetCallback?.(false);
		},
		[reset, triggerReset, triggerResetCallback]
	);

	return {
		isEdit,
		control,
		handleSubmit,
		reset,
		createTab
	};
};
