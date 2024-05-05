import "./table-view.scss";
import { useTableContext } from "../../contexts/table-context";
import { Table } from "../../common/components/table/table";

export const TableView = () => {
	const { tables } = useTableContext();

	return (
		<div className="table-view">
			{tables.length > 0 &&
				tables.map((table, tableIndex) => <Table key={`table-${tableIndex}`} data={table} />)}

			{tables.length === 0 && (
				<div className="no-tables">
					<h1>No tables found! 😱</h1>
					<h2>Go ahead and create some 😈</h2>
				</div>
			)}
		</div>
	);
};
