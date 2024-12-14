import "./table-view.scss";
import { useFileDataContext } from "../../contexts/table-context";
import { Table } from "../../common/components/table/table";
import { useMemo } from "react";
import { Button, Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { Link } from "react-router-dom";

export const TableView = () => {
	const { fileData } = useFileDataContext();

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
						<Tab className="tab" key={tab.tabKey} title={tab.tabName}>
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
												<Button color="danger">Delete</Button>
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
		</>
	);
};
