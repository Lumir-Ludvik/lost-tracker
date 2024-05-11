import { useMemo } from "react";
import { TableDataType } from "../../types";
import "./table.scss";
import { Button, Checkbox, useDisclosure } from "@nextui-org/react";
import { useTableContext } from "../../../contexts/table-context";
import { EditTableModal } from "./edit-table-modal/edit-table-modal";

type TableProps = {
	data: TableDataType;
};

export const Table = ({ data }: TableProps) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const { handleCheckBoxChange, resetTable, deleteTable } = useTableContext();

	const generateColumns = useMemo(
		() =>
			data.columns.map((column, columnIndex) => (
				<th
					key={`column-${columnIndex}`}
					style={{
						backgroundColor: column.color
					}}
				>
					{column.name}
				</th>
			)),
		[data.columns]
	);

	const generateRows = useMemo(() => {
		return data.rows.map((row, rowIndex) => (
			<tr key={`row-${rowIndex}`}>
				<td style={{ backgroundColor: row.color }}>{row.name}</td>
				{row.statuses.map((status, statusIndex) => (
					<td key={`chkbox-${statusIndex}`} className="un-checked">
						{row.availableFor.includes(statusIndex) && (
							<Checkbox
								color={status ? "success" : "primary"}
								isSelected={status}
								onChange={(chkbox) =>
									handleCheckBoxChange(data.tableName, rowIndex, statusIndex, chkbox.target.checked)
								}
							/>
						)}
					</td>
				))}
			</tr>
		));
	}, [data.rows, data.tableName, handleCheckBoxChange]);

	return (
		<>
			<div className="custom-table-container">
				<table className="custom-table">
					<thead>
						<tr>
							<th>
								<div className="name-cell">
									<span className="name">{data.tableName}</span>
									<span className="reset">
										Resets on: <span className="reset-time">{data.timeOfReset}</span>
									</span>
								</div>
							</th>
							{generateColumns}
						</tr>
					</thead>
					<tbody>{generateRows}</tbody>
				</table>

				<div className="actions">
					<Button color="danger" onClick={() => deleteTable(data.tableName)}>
						Delete
					</Button>
					<Button color="primary" onClick={onOpen}>
						Edit
					</Button>
					<Button color="warning" onClick={() => resetTable(data.tableName)}>
						Reset
					</Button>
				</div>
			</div>

			<EditTableModal
				tableData={data}
				isOpen={isOpen}
				onClose={onClose}
				onOpenChange={onOpenChange}
			/>
		</>
	);
};
