import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { TableGenerator } from "../../../../pages/table-generator/table-generator";
import { TableDataType } from "../../../types";

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
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="2xl">
			<ModalContent>
				<ModalHeader>Edit {tableData.tableName}</ModalHeader>
				<ModalBody>
					<TableGenerator tableData={tableData} onSubmitCallback={onClose} />
				</ModalBody>
				{/*//TODO: add footer buttons*/}
				<ModalFooter />
			</ModalContent>
		</Modal>
	);
};
