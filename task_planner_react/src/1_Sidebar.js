import React, { useState } from 'react';
import Loader from './Loader'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Sidebar ({ selectedDate, setSelectedDate }) {
    
    function dayOfTheWeek(date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }

    function dateOfTheWeek(date) {
      return date.getDate().toString();
    }


  return (
    <div className="sidebarBody">
      <div className="sidebar header">
        <a href="/" className="sitename">2Dooz.Today</a>
      </div>
      <div className="sidebar restOfBody">
        <p className="day">{dayOfTheWeek(selectedDate)}</p>
        <p className="date">{dateOfTheWeek(selectedDate)}</p>
      </div>
      <div className="calendarContainer">
        <DatePicker
          inline
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
    </div>
  )

}

export default Sidebar;
