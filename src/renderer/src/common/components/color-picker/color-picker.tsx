import { HexColorPicker } from "react-colorful";
import { useRef } from "react";
import { DEFAULT_TABLE_COLOR } from "@renderer/common/constants";
import useClickOutside from "@renderer/hooks/useClickOuside";
import "./color-picker.scss";

type ColorPickerProps = {
	onChange: (color: string) => void;
	onClose: () => void;
	color: string | undefined;
};

export const ColorPicker = ({ onChange, onClose, color }: ColorPickerProps) => {
	const popover = useRef<HTMLDivElement>(null);

	useClickOutside(popover, onClose);

	return (
		<div className="picker">
			<div className="popover" ref={popover}>
				<HexColorPicker color={color ?? DEFAULT_TABLE_COLOR} onChange={onChange} />
			</div>
		</div>
	);
};
