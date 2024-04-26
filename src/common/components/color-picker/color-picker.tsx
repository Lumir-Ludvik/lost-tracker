import { ColorResult, SketchPicker, SketchPickerProps } from "react-color";
import "./color-picker.scss";
import { useCallback, useDeferredValue, useEffect, useState } from "react";

type ColorPickerProps = Omit<SketchPickerProps, "onChange" | "color"> & {
  color: string;
  onClose: (color: string | undefined) => void;
};

export const ColorPicker = ({ color, onClose }: ColorPickerProps) => {
  const [currentColor, setCurrentColor] = useState<string | undefined>(color);

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  const deferredValue = useDeferredValue(currentColor);

  const handleChange = useCallback((color: ColorResult | undefined) => {
    setCurrentColor(color?.hex);
  }, []);

  return (
    <div className="color-picker-container">
      <div
        className="color-picker-close-div"
        onClick={() => {
          onClose(currentColor);
        }}
      />
      <SketchPicker
        color={deferredValue}
        onChange={pickerColor => handleChange(pickerColor)}
      />
    </div>
  );
};
