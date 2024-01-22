// Imports react & the useState hook
import React, { useState, useEffect } from 'react';
import './feed.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function TaskForm({ tasks, setTasks, pingNewTask, selectedDate}) {

  const [startDate, setStartDate] = useState(new Date());

  const selectedDateOffset = new Date(selectedDate);
  selectedDateOffset.setMinutes(selectedDate.getMinutes() + 15);

  const [taskObject, setTaskObject] = useState({
    start_time: selectedDate,
    end_time: selectedDateOffset,
    task_description: "",
    isComplete: false,
    display_none: false,
    visibility: "flex"
  });

  // Update taskObject whenever selectedDate changes
  useEffect(() => {
    setTaskObject(prevTaskObject => ({
      ...prevTaskObject,
      start_time: selectedDate,
      end_time: new Date(selectedDate.getTime() + 15 * 60000) // 15 minutes later
    }));
  }, [selectedDate]);

  // Asynchronous function for submitting the form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/tasks/new', taskObject);
      const taskObject_withId = { ...taskObject, id: response.data.id };

      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks, taskObject_withId];
        pingNewTask(prev => !prev);
        return updatedTasks; // Return the updated tasks array
      });
    } catch (error) {
      console.error('Error in task submission:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
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

export default TaskForm;

