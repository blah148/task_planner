// Imports react & the useState hook
import React, { useState, useEffect } from 'react';
import './feed.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function TaskFormGuest({ tasks, setTasks, pingNewTask, selectedDate, closePopup }) {

  const [startDate, setStartDate] = useState(new Date());

  const endDate = new Date(startDate.getTime() + 15 * 60000);

  const [taskObject, setTaskObject] = useState({
    start_time: startDate,
    end_time: endDate,
    task_description: "",
    isComplete: false,
    completion_date: null,
    display_none: false,
    visibility: "flex"
  });

  // Update taskObject whenever selectedDate changes
useEffect(() => {
  // Create new date objects for start and end times
  const newStartTime = new Date(selectedDate);
  const newEndTime = new Date(selectedDate);

  // Preserve the time from the current start_time and end_time
  newStartTime.setHours(taskObject.start_time.getHours(), taskObject.start_time.getMinutes());
  newEndTime.setHours(taskObject.end_time.getHours(), taskObject.end_time.getMinutes());

  setTaskObject(prevTaskObject => ({
    ...prevTaskObject,
    start_time: newStartTime,
    end_time: newEndTime
  }));
}, [selectedDate]);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Logic for storing tasks in localStorage
  const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const newTask = { ...taskObject, id: Date.now() }; // Generate a unique ID
  const updatedTasks = [...localTasks, newTask];

  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  setTasks(updatedTasks);
  pingNewTask(prev => !prev);

  if (closePopup) {
    closePopup();
  }
};
  return (
    <form className = "form_create-task" onSubmit={handleSubmit}>
      <input
        name="task_description"
        placeholder="What do you want to get done?"
        onChange={(e) => {
          const description = e.target.value;
          setTaskObject((prevTaskObject) => ({
            ...prevTaskObject,
            task_description: description
            }));
          }}
        className="form_field description"
      />
      <div className="formSubmitBottomRow">
        <div className="datesContainer">
          <DatePicker
            selected={taskObject.start_time}
            onChange={(date) => {
              setStartDate(date);
              setTaskObject((prevTaskObject) => ({
                ...prevTaskObject,
                start_time: date
              }));
            }}
            required
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={1}
            timeCaption="time"
            dateFormat="MMMM d, h:mm aa"
            name="start_time"
            className="form_field time_input start"
            type="time"
          />
          <DatePicker
            selected={taskObject.end_time}
            onChange={(date) => {
              setStartDate(date);
              setTaskObject((prevTaskObject) => ({
                ...prevTaskObject,
                end_time: date
              }));
            }}
            required
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={1}
            timeCaption="time"
            dateFormat="MMMM d, h:mm aa"
            name="end_time"
            className="form_field time_input end"
            type="time"
          />
        </div>
        <button type="submit" className="form_button submit">Add task</button>
      </div>
    </form>
  );
}

export default TaskFormGuest;


