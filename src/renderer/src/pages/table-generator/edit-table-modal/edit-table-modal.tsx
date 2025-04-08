import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { TableGenerator } from "../table-generator";
import { TableDataType } from "../../../common/types";
import "./edit-table-modal.scss";
import { useState } from "react";

type EditTableModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: (isOpen: boolean) => void;
	tableKey: string;
	tableData: TableDataType;
};

//TODO: when editing already checked table the statuses reset
export const EditTableModal = ({
	isOpen,
	onClose,
	onOpenChange,
	tableKey,
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
						tableKey={tableKey}
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
					<Button color="primary" onPress={() => setTriggerSubmit(true)}>
						Save
					</Button>
					<Button color="secondary" onPress={() => setTriggerReset(true)}>
						Reset
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
