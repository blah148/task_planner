import React, {useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import Menu from './Menu.js';
import './MobileStyling.css';

const DaysCarousel = ({ selectedDate, setSelectedDate }) => {
  const [weekStartDate, setWeekStartDate] = useState(new Date(selectedDate));

  const getWeekStartDate = (date, offset) => {
    let start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + (offset * 7)); // Adjust to the start of the week then add/subtract weeks
    return start;
  };

  const getWeekDates = (startDate) => {
    return Array.from({ length: 7 }).map((_, index) => {
      let day = new Date(startDate);
      day.setDate(day.getDate() + index);
      return day;
    });
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const navigateWeeks = (direction) => {
    const newWeekStartDate = getWeekStartDate(weekStartDate, direction);
    setWeekStartDate(newWeekStartDate);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const weekDates = getWeekDates(weekStartDate);
  return (
    <div className="carouselContainer">
      <button onClick={() => navigateWeeks(-1)} className="weekNavButton">«</button>
      <div className="carousel">
        {weekDates.map((date, index) => {
          const dayLetter = date.toLocaleDateString('default', { weekday: 'short' }).charAt(0);
          const dayNumber = date.getDate();

          return (
            <button
              key={index}
              className={`day ${isSameDay(date, selectedDate) ? 'selected' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              {/* Separate elements for dayLetter and dayNumber */}
              <span className="dayLetter">{dayLetter}</span> {/* E.g., 'M' */}
              <span className="dayNumber">{dayNumber}</span> {/* E.g., '21' */}
            </button>
          );
        })}
      </div>
      <button onClick={() => navigateWeeks(1)} className="weekNavButton">»</button>
    </div>
  );
};

export default DaysCarousel;
