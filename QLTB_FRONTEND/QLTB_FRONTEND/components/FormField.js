import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

const FormField = ({
  label,
  value,
  options,
  onChange,
  id,
  isDropdown = false,
  typeInput = "text",
  disabled = false,
  required = true,
  hidden = false,
  placeholder = ""
}) => {
  let valueInput;
  if (value !== null && value !== undefined || value == 0) {
      valueInput = value; 
  } else {
    valueInput = "";
  }

  return (
  <div className="md:field col-12 md:col-6">
    <label className="font-bold text-sm md:my-2 my-1 block" htmlFor={id}>
      {label} {required && <span className="text-red-500">(*)</span>}
    </label>
    {isDropdown ? (
      <Dropdown
        filter
        placeholder={`Chọn ${label.toLowerCase()}`}
        id={id}
        name={id}
        value={value}
        optionValue="id"
        optionLabel="name"
        options={options}
        onChange={onChange}
        className="w-full"
        disabled={disabled}
      />
    ) : (
      <InputText
        type={typeInput}
        placeholder={ placeholder ? `${placeholder}` : `Nhập ${label.toLowerCase()}`}
        id={id}
        name={id}
        value={valueInput}
        onChange={onChange}
        className="w-full"
        disabled={disabled}
        hidden={hidden}
      />
    )}
  </div>
)};

export default FormField;