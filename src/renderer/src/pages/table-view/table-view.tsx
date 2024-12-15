import "./table-view.scss";
import { useFileDataContext } from "../../contexts/file-data-context";
import { Table } from "../../common/components/table/table";
import { useMemo, useState } from "react";
import { Button, Card, CardBody, Image, Tab, Tabs } from "@nextui-org/react";
import { Link } from "react-router-dom";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import { ConfirmModal } from "../../common/components/confirm-modal/confirm-modal";
import { ConfirmModalType } from "../../common/types";

type TabDeleteConfirmModalData = {
	tabKey: string;
};

export const TableView = () => {
	const { fileData, deleteTab } = useFileDataContext();

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

		return Object.keys(fileData).map((key) => ({
			tabName: fileData[key].tabName,
			tabKey: key
		}));
	}, [fileData]);

	return (
		<>
			{tabs.length > 0 && (
				<Tabs className="tabs" placement="start">
					{tabs.map((tab) => (
						<Tab
							className="tab"
							key={tab.tabKey}
							title={
								<div className="tab-title">
									<p>{tab.tabName}</p>
									<div>
										<Button className="delete-tab" color="default" isIconOnly fullWidth={false}>
											<Image
												src={deleteIcon}
												isZoomed
												alt="delete"
												width="24"
												onClick={() =>
													setConfirmModalState((value) => ({
														...value,
														isOpen: true,
														data: { tabKey: tab.tabKey }
													}))
												}
											/>
										</Button>
										<Button className="edit-tab" color="default" isIconOnly>
											<Image src={editIcon} isZoomed alt="edit" width="24" />
										</Button>
									</div>
								</div>
							}
						>
							<Card className="card">
								<CardBody className="card-body">
									<div className="table-view">
										{fileData &&
											Object.keys(fileData[tab.tabKey].tables ?? {}).map((tableKey) => (
												<>
													{fileData[tab.tabKey].tables?.[tableKey] != null && (
														<Table
															key={tableKey}
															tabKey={tab.tabKey}
															tableKey={tableKey}
															data={fileData[tab.tabKey].tables![tableKey]}
														/>
													)}
												</>
											))}

										{Object.keys(fileData?.[tab.tabKey].tables ?? {}).length === 0 && (
											<div className="no-tables">
												<h1>No tables found! 😱</h1>
												<h2>Go ahead and create some 😈</h2>
												<Link to="./table-generator" className="link">
													Go to table generator
												</Link>
												Or delete this Game tab
												<Button color="danger" onClick={() => deleteTab(tab.tabKey)}>
													Delete
												</Button>
											</div>
										)}
									</div>
								</CardBody>
							</Card>
						</Tab>
					))}
				</Tabs>
			)}

			{tabs.length === 0 && (
				<div className="no-tabs">
					<h1>No games found! 😥</h1>
					<Link to="./tab-generator" className="link">
						Go to Game generator
					</Link>
				</div>
			)}

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
		</>
	);
};
