import React from "react";
import { Calendar } from "primereact/calendar";
import moment from "moment";

const CalendarField = React.memo(
  ({
    label,
    name,
    value,           
    onChange,       
    required,
    error,
    placeholder,
    showTime = false,
    divClassName,
    labelClassName = "font-bold text-sm mb-1 block",
    disabled = false,
    view = "date",
    dateFormat = "dd/mm/yy",
    dateStringFormat = "HH:mm DD/MM/YYYY",
    limitToToday = true,
  }) => {
    const stick = required ? <span style={{ color: "red" }}>(*)</span> : null;
    const parsedValue = value ? moment(value, dateStringFormat).toDate() : null;
    //Set maxDate nếu limitToToday = true
    const maxDate = limitToToday ? new Date() : undefined;

    return (
      <div className={divClassName}>
        <label htmlFor={name} className={labelClassName}>
          {label} {stick}
        </label>
        <Calendar
          id={name}
          name={name}
          className="w-full"
          value={parsedValue}
          onChange={(e) => {
            // trả về string theo định dạng dateStringFormat
            const formatted = e.value
              ? moment(e.value).format(dateStringFormat)
              : "";
            onChange(formatted);
          }}
          dateFormat={dateFormat}
          view={view}
          disabled={disabled}
          showTime={showTime}
          hourFormat="24"
          maxDate={maxDate}
          showIcon
          placeholder={placeholder || `Chọn ${label.toLowerCase()}`}
        />
        {error && <small className="p-error">{error}</small>}
      </div>
    );
  }
);

CalendarField.displayName = "CalendarField";

export default CalendarField;
