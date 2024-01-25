import React, { useState, useEffect, useRef } from 'react';
import TaskFormGuest from './1_Tasks-Guest';
import './MobileStyling.css'; // Import your stylesheet

const PopupButtonGuest = ({ selectedDate, tasks, setTasks, pingNewTask }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef();

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleClickOutside = (event) => {
    // Check if the click is on the .popup-overlay directly
    if (event.target.classList.contains('popup-overlay')) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    // Attach the listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup the listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button className="mobile_new-task" onClick={togglePopup}>Create new task</button>
      {isPopupVisible && (
        <div className="popup-overlay" ref={popupRef}>
          <TaskFormGuest
            selectedDate={selectedDate}
            tasks={tasks}
            setTasks={setTasks}
            pingNewTask={pingNewTask}
            closePopup={togglePopup} // Pass this function to close the popup on form submit
          />
        </div>
      )}
    </>
  );
};

export default PopupButtonGuest;


