import { Controller } from "react-hook-form";
import { Input } from "../../common/components/input/input";
import { useTabGeneratorController } from "./useTabGeneratorController";
import { Button } from "@nextui-org/react";
import "./tab-generator.scss";

export const TabGenerator = () => {
	const { handleSubmit, reset, createTab, control } = useTabGeneratorController();

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

			<div className="flex gap-4">
				<Button color="primary" type="submit">
					Create Game
				</Button>
				<Button color="secondary" type="button" onClick={() => reset()}>
					Reset form
				</Button>
			</div>
		</form>
	);
};
