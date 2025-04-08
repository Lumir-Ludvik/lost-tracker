import { Button, Card, CardBody } from "@nextui-org/react";
import { Table } from "@renderer/common/components/table/table";
import { Link } from "react-router-dom";
import { TabType } from "@renderer/common/types";
import { useFileDataContext } from "@renderer/contexts/file-data-context";
import "./game-card.scss";
import { useMemo } from "react";

type GameCardProps = {
	tab: TabType;
};

export const GameCard = ({ tab }: GameCardProps) => {
	const { fileData, deleteTab } = useFileDataContext();

	const noTablesJsx = useMemo(
		() => (
			<div className="no-tables">
				<h1>No tables found! 😱</h1>
				<h2>Go ahead and create some 😈</h2>
				<Link to="./table-generator" className="link">
					Go to table generator
				</Link>
				<p className="delete-tab-text">
					Or delete this Game tab:
					<Button color="danger" onClick={() => deleteTab(tab.tabKey)}>
						Delete
					</Button>
				</p>
			</div>
		),
		[deleteTab, tab.tabKey]
	);

	return (
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

					{Object.keys(fileData?.[tab.tabKey].tables ?? {}).length === 0 && noTablesJsx}
				</div>
			</CardBody>
		</Card>
	);
};
