import "./table-view.scss";
import { useFileDataContext } from "../../contexts/file-data-context";
import { useDeferredValue, useMemo, useState } from "react";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Image,
	Input,
	Tab,
	Tabs,
	Tooltip,
	useDisclosure
} from "@heroui/react";
import { ConfirmModal } from "../../common/components/confirm-modal/confirm-modal";
import { ConfirmModalType, TabType } from "../../common/types";
import { EditTabModal } from "../tab-generator/edit-tab-modal/edit-tab-modal";
import { GameCard } from "@renderer/pages/table-view/game-card/game-card";
import { EmptyTab } from "@renderer/pages/table-view/empty-tab/empty-tab";
import dotsIcon from "../../assets/icons/dots.svg";

type TabDeleteConfirmModalData = {
	tabKey: string;
};

export const TableView = () => {
	const { fileData, deleteTab } = useFileDataContext();
	const {
		isOpen: isEditTabOpen,
		onOpen: onEditTabOpen,
		onClose: onEditTabClose,
		onOpenChange: onEditTabOpenChange
	} = useDisclosure();

	const [searchInput, setSearchInput] = useState("");
	const deferredSearch = useDeferredValue(searchInput);
	const [editModalState, setEditModalState] = useState<TabType | null>(null);
	const [confirmModalState, setConfirmModalState] = useState<
		ConfirmModalType<TabDeleteConfirmModalData>
	>({
		isOpen: false,
		action: "none"
	});

	const tabs = useMemo(() => {
		if (!fileData) {
			return [];
		}

		return Object.keys(fileData)
			.map((key) => ({
				tabName: fileData[key].tabName,
				tabKey: key
			}))
			.filter((tab) => {
				if (deferredSearch === "") {
					return true;
				}

				return tab.tabName.includes(deferredSearch);
			});
	}, [deferredSearch, fileData]);

	const searchInputJsx = useMemo(() => {
		return (
			<Input
				className="search-input"
				label="Search games"
				value={searchInput}
				onChange={(event) => setSearchInput(event.target.value)}
			/>
		);
	}, [searchInput]);

	return (
		<div className="table-view-container">
			{searchInputJsx}

			{tabs.length > 0 && (
				<Tabs className="tabs" placement="start">
					{tabs.map((tab) => (
						<Tab
							className="tab"
							key={tab.tabKey}
							title={
								<div className="tab-title">
									<Tooltip color="primary" placement="bottom" content={tab.tabName}>
										<p className="tab-title-text">{tab.tabName}</p>
									</Tooltip>

									<Dropdown backdrop="blur">
										<DropdownTrigger>
											<Button className="dropdown-button" variant="flat" isIconOnly color="primary">
												<Image src={dotsIcon} isZoomed alt="edit" width="15" />
											</Button>
										</DropdownTrigger>

										<DropdownMenu aria-label="Static Actions" variant="faded">
											<DropdownItem
												key="edit"
												onPress={() => {
													setEditModalState({
														tabName: tab.tabName,
														tabKey: tab.tabKey
													});
													onEditTabOpen();
												}}
											>
												Edit tab
											</DropdownItem>

											<DropdownItem
												key="delete"
												className="text-danger"
												color="danger"
												onPress={() => {
													setConfirmModalState((value) => ({
														...value,
														isOpen: true,
														data: { tabKey: tab.tabKey }
													}));
												}}
											>
												Delete Tab
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</div>
							}
						>
							<GameCard tab={tab} />
						</Tab>
					))}
				</Tabs>
			)}

			{tabs.length === 0 && <EmptyTab />}

			<ConfirmModal
				isOpen={confirmModalState.isOpen}
				onOpenChange={(isOpen) => setConfirmModalState((value) => ({ ...value, isOpen }))}
				title={"Delete game tab"}
				text={`Are you sure you want to delete this game?`}
				onAccept={async () => {
					if (!confirmModalState.data?.tabKey) {
						return;
					}

					await deleteTab(confirmModalState.data.tabKey);
					setConfirmModalState((value) => ({ ...value, isOpen: false }));
				}}
				onDecline={() => setConfirmModalState((value) => ({ ...value, isOpen: false }))}
			/>

			{editModalState && (
				<EditTabModal
					isOpen={isEditTabOpen}
					onClose={onEditTabClose}
					onOpenChange={onEditTabOpenChange}
					tabData={{ tabName: editModalState.tabName, tabKey: editModalState.tabKey }}
				/>
			)}
		</div>
	);
};
