import "./table-view.scss";
import { useTableContext } from "../../contexts/table-context";
import { Table } from "../../common/components/table/table";
import { useMemo } from "react";

export const TableView = () => {
	const { tables } = useTableContext();

	const { length, keys } = useMemo(() => {
		if (!tables) {
			return {
				length: 0,
				keys: []
			};
		}

		return {
			length: Object.keys(tables).length,
			keys: Object.keys(tables)
		};
	}, [tables]);

	return (
		<div className="table-view">
			{tables &&
				length > 0 &&
				keys.map((tableKey) => (
					<Table key={tableKey} tableKey={tableKey} data={tables[tableKey]} />
				))}

			{length === 0 && (
				<div className="no-tables">
					<h1>No tables found! 😱</h1>
					<h2>Go ahead and create some 😈</h2>
				</div>
			)}
		</div>
	);
};
