import React from "react";

export function Slider({ defaultValue = [4], min = 1, max = 20, step = 1, onValueChange, className = "" }) {
  const handleChange = (e) => {
    const val = Number(e.target.value);
    onValueChange && onValueChange([val]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue[0]}
      onChange={handleChange}
      className={className}
    />
  );
}

export default Slider;
