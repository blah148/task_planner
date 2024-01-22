import React from 'react';
import Loader from './Loader'

function Sidebar ({ isLoading }) {
      
    function dayOfTheWeek() {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const date = new Date();
      return days[date.getDay()];
    }

    function dateOfTheWeek() {
      const date = new Date();
      return date.getDate().toString();
    }


  return (
    <div className="sidebarBody">
      <div className="sidebar header">
        <a href="/" className="sitename">2Dooz.Today</a>
      </div>
      <Loader isLoading={isLoading} />
      <div className="sidebar restOfBody">
        <p className="day">{dayOfTheWeek()}</p>
        <p className="date">{dateOfTheWeek()}</p>
      </div>
    </div>
  )

}

export default Sidebar;
