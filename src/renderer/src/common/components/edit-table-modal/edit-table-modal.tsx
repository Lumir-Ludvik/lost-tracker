import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from "@nextui-org/react";
import { TableGenerator } from "../../../pages/table-generator/table-generator";
import { TableDataType } from "../../types";
import "./edit-table-modal.scss";
import { useState } from "react";

type EditTableModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: (isOpen: boolean) => void;
	tableData: TableDataType;
};

export const EditTableModal = ({
	isOpen,
	onClose,
	onOpenChange,
	tableData
}: EditTableModalProps) => {
	const [triggerSubmit, setTriggerSubmit] = useState(false);
	const [triggerReset, setTriggerReset] = useState(false);

	return (
		<Modal
			className="edit-table-modal"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			scrollBehavior="inside"
			size="2xl"
		>
			<ModalContent>
				<ModalHeader>Edit {tableData.tableName}</ModalHeader>
				<ModalBody>
					<TableGenerator
						hasCustomActions
						tableData={tableData}
						onSubmitCallback={onClose}
						triggerSubmit={triggerSubmit}
						triggerSubmitCallback={(value) => {
							setTriggerSubmit(value);
							onClose();
						}}
						triggerReset={triggerReset}
						triggerResetCallback={(value) => setTriggerReset(value)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => setTriggerSubmit(true)}>
						Save
					</Button>
					<Button color="secondary" onClick={() => setTriggerReset(true)}>
						Reset
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
