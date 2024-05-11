import { ColorResult, SketchPicker, SketchPickerProps } from "react-color";
import "./color-picker.scss";
import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";

export type ColorPickerProps = Omit<SketchPickerProps, "onChange" | "color"> & {
	color: string | undefined;
	onClose: (color: string | undefined) => void;
};

export const ColorPicker = ({ color, onClose }: ColorPickerProps) => {
	const [currentColor, setCurrentColor] = useState<string | undefined>(color);
	const sketchRef = useRef(null);

	useEffect(() => {
		setCurrentColor(color);
	}, [color]);

	useEffect(() => {
		if (!sketchRef.current) {
			return;
		}

		(sketchRef.current as HTMLElement)?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const deferredValue = useDeferredValue(currentColor);

	const handleChange = useCallback((color: ColorResult | undefined) => {
		setCurrentColor(color?.hex);
	}, []);

	return (
		<div ref={sketchRef} className="color-picker-container">
			<div
				className="color-picker-close-div"
				onClick={() => {
					onClose(currentColor);
				}}
			/>
			<SketchPicker color={deferredValue} onChange={(pickerColor) => handleChange(pickerColor)} />
		</div>
	);
};
