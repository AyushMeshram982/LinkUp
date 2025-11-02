import React, { useState, useEffect } from "react";
import "../styles/Cal.css";

const DatePicker = ({ value, onChange, onClear }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) return new Date(value).getMonth();
    return new Date().getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    if (value) return new Date(value).getFullYear();
    return new Date().getFullYear();
  });

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const handleDateClick = (day) => {
    const formatted = `${day.toString().padStart(2,"0")} ${months[currentMonth]} ${currentYear}`;
    if (onChange) onChange(formatted);
    setShowCalendar(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) onClear();
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  // Update currentMonth/year if value changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date)) {
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
      }
    }
  }, [value]);

  return (
    <div className="date-picker-container">
      <div className={`date-display ${value ? "with-box" : ""}`} onClick={toggleCalendar}>
        {value ? (
          <>
            <span className="selected-text">{value}</span>
            <button className="clear-btn" onClick={handleClear}>✕</button>
          </>
        ) : (
          <>
            <span>Date</span>
            <span className="calendar-icon">📅</span>
          </>
        )}
      </div>

      <div className={`calendar-wrapper ${showCalendar ? "open" : "closed"}`}>
        {showCalendar && (
          <div className="calendar-popup">
            <div className="calendar-header">
              <button onClick={prevMonth}>&lt;</button>
              <span>{months[currentMonth]} {currentYear}</span>
              <button onClick={nextMonth}>&gt;</button>
            </div>

            <div className="calendar-grid">
              {daysOfWeek.map(d => (
                <div key={d} className="day-name">{d}</div>
              ))}

              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="empty"></div>
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <div
                  key={day}
                  className={`day ${
                    value?.startsWith(day.toString().padStart(2,"0")) &&
                    value.includes(months[currentMonth]) &&
                    value.includes(currentYear.toString())
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;