import { Controller } from "react-hook-form";
import { Input } from "../../common/components/input/input";
import { useTabGeneratorController } from "./useTabGeneratorController";
import { Button } from "@nextui-org/react";
import "./tab-generator.scss";
import { TabType } from "../../common/types";

type TabGeneratorProps = {
	tabData?: TabType;
	onSubmitCallback?: () => void;
	hasCustomActions?: boolean;
	triggerSubmit?: boolean;
	triggerSubmitCallback?: (value: boolean) => void;
	triggerReset?: boolean;
	triggerResetCallback?: (value: boolean) => void;
};

export const TabGenerator = ({
	tabData,
	onSubmitCallback,
	triggerSubmit,
	triggerSubmitCallback,
	triggerReset,
	triggerResetCallback,
	hasCustomActions
}: TabGeneratorProps) => {
	const { isEdit, handleSubmit, reset, createTab, control } = useTabGeneratorController({
		tabData,
		onSubmitCallback,
		triggerSubmit,
		triggerSubmitCallback,
		triggerReset,
		triggerResetCallback
	});

	return (
		<form className="tab-generator" onSubmit={handleSubmit(createTab)}>
			<Controller
				name="tabName"
				control={control}
				rules={{
					required: { value: true, message: "This field is required" }
				}}
				render={({ field, fieldState: { error } }) => (
					<Input label="Game name:" field={field} error={error} value={field.value} />
				)}
			/>

			{!hasCustomActions && (
				<div className="flex gap-4">
					<Button color="primary" type="submit">
						{isEdit ? "Edit" : "Create"} Game
					</Button>
					<Button color="secondary" type="button" onClick={() => reset()}>
						Reset form
					</Button>
				</div>
			)}
		</form>
	);
};
