import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

const AutoCompleteCustom = ({
  items = [],
  placeholder = 'Chọn hoặc nhập…',
  onChange,
  value: externalValue = '',
  field = "name", // field hiển thị khi item là object
}) => {
  const [value, setValue] = useState(externalValue);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setValue(externalValue ?? '');
  }, [externalValue]);

  const search = ({ query }) => {
    const _q = query?.trim().toLowerCase() || "";
    const filtered = _q
      ? items.filter((item) => {
          const label =
            typeof item === "object" ? item[field] : String(item);
          return label.toLowerCase().includes(_q);
        })
      : [...items];

    setSuggestions(filtered);
  };

  const handleChange = (e) => {
    const val =
      typeof e.value === "object"
        ? e.value?.[field] // nếu chọn object → lấy name
        : e.value; // nếu nhập tay → giữ string

    setValue(val);
    onChange?.(val);
  };

  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={search}
      onChange={handleChange}
      placeholder={placeholder}
      dropdown             // hiện nút ▼ mở full danh sách
      forceSelection={false} // cho phép gõ tự do
      field={typeof items[0] === "object" ? field : undefined}
      className="w-full"
    />
  );
};

export default AutoCompleteCustom;
