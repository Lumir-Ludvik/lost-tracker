import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from "@nextui-org/react";

type ConfirmModalProps = {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	title: string;
	text: string;
	onAccept: () => void;
	onDecline: () => void;
};
export const ConfirmModal = ({
	isOpen,
	onOpenChange,
	onAccept,
	onDecline,
	title,
	text
}: ConfirmModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
			<ModalContent>
				<ModalHeader>{title}</ModalHeader>
				<ModalBody>{text}</ModalBody>
				<ModalFooter>
					<Button color="success" onClick={onAccept}>
						Accept
					</Button>
					<Button color="danger" onClick={onDecline}>
						Decline
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
