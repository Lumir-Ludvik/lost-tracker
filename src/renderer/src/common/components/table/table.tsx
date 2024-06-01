import { useMemo, useState } from "react";
import { TableDataType } from "../../types";
import "./table.scss";
import { Button, Checkbox, Image, useDisclosure } from "@nextui-org/react";
import { useTableContext } from "../../../contexts/table-context";
import deleteIcon from "../../../assets/icons/delete.svg";
import editIcon from "../../../assets/icons/edit.svg";
import resetIcon from "../../../assets/icons/reset.svg";
import { EditTableModal } from "../edit-table-modal/edit-table-modal";
import { ConfirmModal } from "../confirm-modal/confirm-modal";
import { generateTimeString, hexToAccessibilityTextHsl } from "../../utils";

type TableProps = {
	data: TableDataType;
	tableKey: string;
};

type ConfirmModalType = {
	isOpen: boolean;
	action: "reset" | "delete" | "none";
};

export const Table = ({ tableKey, data }: TableProps) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const { handleCheckBoxChange, resetTable, deleteTable } = useTableContext();

	const [confirmModalState, setConfirmModalState] = useState<ConfirmModalType>({
		isOpen: false,
		action: "none"
	});

	const generateColumns = useMemo(
		() =>
			data.columns.map((column, columnIndex) => {
				const textColor = hexToAccessibilityTextHsl(column.color ?? "#ffffff");

				return (
					<th
						key={`column-${columnIndex}`}
						style={{
							backgroundColor: column.color,
							color: textColor
						}}
					>
						{column.name}
					</th>
				);
			}),
		[data.columns]
	);

	const generateRows = useMemo(() => {
		return data.rows.map((row, rowIndex) => {
			const textColor = hexToAccessibilityTextHsl(row.color ?? "#ffffff");

			return (
				<tr key={`row-${rowIndex}`}>
					<td style={{ backgroundColor: row.color, color: textColor }}>{row.name}</td>
					{row.statuses.map((status, statusIndex) => (
						<td key={`chkbox-${statusIndex}`} className="un-checked">
							{row.availableFor.includes(statusIndex) && (
								<Checkbox
									className="checkbox"
									color={status ? "success" : "primary"}
									isSelected={status}
									onChange={(chkbox) =>
										handleCheckBoxChange(tableKey, rowIndex, statusIndex, chkbox.target.checked)
									}
								/>
							)}
						</td>
					))}
				</tr>
			);
		});
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
									<div className="reset">
										<span>
											Resets on: <span className="reset-time">{data.dayOfReset}</span>
										</span>
										{data.dayOfReset !== "never" && (
											<span>
												at:
												<span className="reset-time">{generateTimeString(data.timeOfReset)}</span>
											</span>
										)}
									</div>
								</div>
							</th>
							{generateColumns}
						</tr>
					</thead>
					<tbody>{generateRows}</tbody>
				</table>

				<div className="actions">
					<Button
						color="default"
						isIconOnly
						fullWidth={false}
						onClick={() => setConfirmModalState({ action: "delete", isOpen: true })}
					>
						<Image src={deleteIcon} isZoomed alt="delete" width="24" />
					</Button>
					<Button color="default" isIconOnly onClick={onOpen}>
						<Image src={editIcon} isZoomed alt="delete" width="24" />
					</Button>
					<Button
						color="default"
						isIconOnly
						onClick={() => setConfirmModalState({ action: "reset", isOpen: true })}
					>
						<Image src={resetIcon} isZoomed alt="delete" width="24" />
					</Button>
				</div>
			</div>

			<EditTableModal
				tableKey={tableKey}
				tableData={data}
				isOpen={isOpen}
				onClose={onClose}
				onOpenChange={onOpenChange}
			/>

			<ConfirmModal
				isOpen={confirmModalState.isOpen}
				onOpenChange={(isOpen) => setConfirmModalState((value) => ({ ...value, isOpen }))}
				title={`${confirmModalState.action === "delete" ? "Delete" : "Reset"} ${data.tableName}`}
				text={`Are you sure you want to ${confirmModalState.action} table called: ${data.tableName}?`}
				onAccept={() => {
					confirmModalState.action === "delete" ? deleteTable(tableKey) : resetTable(tableKey);
					setConfirmModalState({ action: "none", isOpen: false });
				}}
				onDecline={() => setConfirmModalState((value) => ({ ...value, isOpen: false }))}
			/>
		</>
	);
};
