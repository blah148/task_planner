import React, { useState, useEffect, useRef } from 'react';
import TaskForm from './1_Tasks';
import './MobileStyling.css'; // Import your stylesheet

const PopupButton = ({ selectedDate, tasks, setTasks, pingNewTask }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef();

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  // Function to close the popup when clicking outside of it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
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
      <button onClick={togglePopup}>Open Task Form</button>
      {isPopupVisible && (
        <div className="popup-overlay" ref={popupRef}>
          <TaskForm
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

export default PopupButton;

