import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { TabType } from "../../../common/types";
import { TabGenerator } from "../tab-generator";

type EditTabModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: (isOpen: boolean) => void;
	tabData: TabType;
};

export const EditTabModal = ({ isOpen, onClose, onOpenChange, tabData }: EditTabModalProps) => {
	const [triggerSubmit, setTriggerSubmit] = useState(false);
	const [triggerReset, setTriggerReset] = useState(false);

	return (
		<Modal
			className="edit-tab-modal"
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			scrollBehavior="inside"
			size="2xl"
		>
			<ModalContent>
				<ModalHeader>Edit {tabData.tabName}</ModalHeader>
				<ModalBody>
					<TabGenerator
						hasCustomActions
						tabData={tabData}
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
