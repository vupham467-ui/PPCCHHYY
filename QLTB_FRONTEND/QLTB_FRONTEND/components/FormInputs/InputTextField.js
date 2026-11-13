import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const InputTextField = React.memo(
  ({ 
    label, 
    name, 
    value, 
    onChange, 
    error, 
    type = "text", 
    disabled = false, 
    placeholder, 
    required, 
    divClassName,
    labelClassName = "font-bold text-sm mb-1 block",
    textarea = false,      //xác định có dùng textarea hay không
    rows = 2              // số dòng mặc định cho textarea
  }) => {
    const stick = required ? <span style={{ color: "red" }}>(*)</span> : "";

    return (
      <div className={divClassName}>
        <label htmlFor={name} className={labelClassName}>
          {label} {stick}
        </label>

        {textarea ? (
          <InputTextarea
            id={name}
            name={name}
            className="w-full"
            value={value}
            disabled={disabled}
            placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
            rows={rows}
            autoResize
            onChange={onChange}
          />
        ) : (
          <InputText
            id={name}
            name={name}
            className="w-full"
            type={type}
            value={value}
            disabled={disabled}
            placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
            onChange={onChange}
          />
        )}

        {error && <small className="p-error">{error}</small>}
      </div>
    );
  }
);

InputTextField.displayName = "InputTextField";

export default InputTextField;
