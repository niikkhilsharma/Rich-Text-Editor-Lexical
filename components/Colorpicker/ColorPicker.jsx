/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import "./ColorPicker.css";

export default function ColorPicker({ color, onChange, heading, open = false, isHidden = false }) {
  const [isOpen, setIsOpen] = useState(open);
  const [selectedColor, setSelectedColor] = useState(color || "#3b82f6");
  const pickerRef = useRef(null);

  // Update local state if parent color prop changes
  useEffect(() => {
    if (color) {
      setSelectedColor(color);
    }
  }, [color]);

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const handleColorChangeComplete = (color) => {
    setSelectedColor(color.hex);
    if (onChange) {
      onChange(color.hex);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={pickerRef}>
      {!isHidden && <div className="flex gap-3 items-center justify-start">

        <button
          className="flex gap-3 items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Color picker. Current color is ${selectedColor}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div
            className="h-4 w-8 rounded-sm border border-black"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs text-gray-500 font-medium">{heading}</span>
        </button>
      </div>}


      {isOpen && (
        <div className="picker-dropdown">
          <SketchPicker
            color={selectedColor}
            onChange={handleColorChange}
            onChangeComplete={handleColorChangeComplete}
            disableAlpha={false}
            presetColors={[
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#96CEB4",
              "#FECA57",
              "#FF9FF3",
              "#A29BFE",
              "#222222",
              "#666666",
              "#999999",
              "#CCCCCC",
              "#FFFFFF",
            ]}
          />
        </div>
      )}
    </div>
  );
}
