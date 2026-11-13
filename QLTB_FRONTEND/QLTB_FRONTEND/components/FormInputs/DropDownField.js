import React from "react";
import { Dropdown } from "primereact/dropdown";

const DropdownField = React.memo(
  ({ 
    label, 
    name, 
    value, 
    onChange, 
    options = [], 
    optionLabel, 
    optionValue, 
    placeholder, 
    required, 
    error, 
    divClassName,
    labelClassName = "font-bold text-sm mb-1 block",
    disabled = false,
    showClear = true,
    showFilterClear = true
  }) => {
    const stick = required ? <span style={{ color: "red" }}>(*)</span> : null;
    return (
      <div className={divClassName}>
        <label htmlFor={name} className={labelClassName}>
          {label} {stick}
        </label>
        <Dropdown
          id={name}
          name={name}
          className="w-full"
          value={value}
          options={options}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={placeholder || `Chọn ${label.toLowerCase()}`}
          onChange={onChange}
          filter
          showClear={showClear}
          showFilterClear={showFilterClear}
          disabled={disabled}
        />
        {error && <small className="p-error">{error}</small>}
      </div>
    );
  }
);

DropdownField.displayName = "DropdownField";

export default DropdownField;
