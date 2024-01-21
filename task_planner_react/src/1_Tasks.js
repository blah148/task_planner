// Imports react & the useState hook
import React, { useState, useEffect } from 'react';
import './feed.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function TaskForm({ tasks, setTasks }) {

  const [startDate, setStartDate] = useState(new Date());

  const [taskObject, setTaskObject] = useState({
    start_time: new Date(),
    end_time: new Date(),
    task_description: "",
    isComplete: false,
    display_none: false,
    visibility: "flex"
  });

  // Asynchronous function for submitting the form data
  const handleSubmit = async (e) => {
   
    //Prevents "default" form submission behaviour aka reload
    e.preventDefault();
   
    let taskObject_withId;

    try {
      const response = await axios.post('/tasks/new', taskObject);
      taskObject_withId = {...taskObject, id: response.data.id};
    } catch(error) {
      console.error(error);
    }
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, taskObject_withId];
    });

  };
  
  return (
    <>  
      <form className = "form_create-task" onSubmit={handleSubmit}>
        <DatePicker
          selected={taskObject.start_time}
          onChange={(date) => {
            setStartDate(date);
            setTaskObject((prevTaskObject) => ({
              ...prevTaskObject,
              start_time: date
            }));
          }}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={1}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
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
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={1}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          name="end_time"
          className="form_field time_input end"
          type="time"
        />
        <textarea
          name="task_description"
          onChange={(e) => {
            const description = e.target.value;
            setTaskObject((prevTaskObject) => ({
              ...prevTaskObject,
              task_description: description
              }));
            }}
          className="form_field description"
        />
        <button type="submit" className="form_button submit">Add task</button>
      </form>
    </>
  );
}

export default TaskForm;

