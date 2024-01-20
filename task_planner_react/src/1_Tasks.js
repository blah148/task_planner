// Imports react & the useState hook
import React, { useState, useEffect } from 'react';
import './index.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function TaskForm({ isLoggedIn, setIsLoggedIn, tasks, setTasks }) {

  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const response = await fetch('/fetchtasks', {
                method: 'GET',
                credentials: 'include' // Ensures that cookies are sent with the request
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.tasks);
                setTasks(data.tasks); // Update the tasks state with the fetched data
                sortTasks(data.tasks);
            } else {
                console.error('Failed to fetch tasks');
                // Handle failure to fetch tasks here
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // Handle errors in fetching tasks here
        }
    };

    fetchTasks();
  }, []); // The empty dependency array ensures this runs only once on component mount

  const[hideCompletedTasks, setHideCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('hideCompletedTasks');
    return saved === null ? false : JSON.parse(saved);
  });

  useEffect (() => {
    localStorage.setItem('hideCompletedTasks', JSON.stringify(hideCompletedTasks));
  }, [hideCompletedTasks]);

  const [lastUserInteractionTime, setLastUserInteractionTime] = useState(Date.now());
  
  const [startDate, setStartDate] = useState(new Date());

  const [taskObject, setTaskObject] = useState({
    start_time: new Date(),
    end_time: new Date(),
    task_description: "",
    isComplete: false,
    display_none: false,
    visibility: "flex"
  });

  const handleCheckbox = async (id, isComplete) => {
    try {
      await axios.patch(`/tasks/toggleComplete/${id}/${isComplete}`);
      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item.id === id ? { ...item, isComplete: !item.isComplete } : item
        )
      );
    } catch (error) {
      console.error('Error toggling is_complete', error);
    }
  };

  function sortTasks(tasksArray) {
    return tasksArray.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }


  const rowDeletion = async (id) => {
    try {
      const response = await axios.delete(`/tasks/delete/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  function convertIsoTo12HourFormat(isoString) {
    const date = new Date(isoString);

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${month} ${day}, ${year} ${hours}:${minutesStr}${ampm}`;
  }



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
      return sortTasks(updatedTasks);
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
      
      <div className="completedTasks">
        <label
          type="checkbox" 
          className="view_completed-tasks_label"
          htmlFor="completion" >Hide completed tasks</label>
        <input
          type="checkbox"
          id="completion"
          onChange={() => setHideCompletedTasks(prevState => !prevState)}
          className=""
        />
      </div>

      <div className="task_table">
          <div className="header_task-list">
            <h2 className="header_title time">Start time</h2>
            <h2 className="header_title time">End time</h2>
            <h2 className="header_title description">Task description</h2>
          </div>
          
          <div className="buffer_container">
          <div className="buffer_task-list">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="row_item buffered_task"
                style={{
                  opacity: task.isComplete ? 0.5 : 1,
                  display: task.isComplete && hideCompletedTasks ? "none" : "flex"
                }}
              > 
                <div className="buffer time">{convertIsoTo12HourFormat(task.start_time)}</div>
                <div className="buffer time">{convertIsoTo12HourFormat(task.end_time)}</div>
                <div className="buffer description">{task.task_description}</div>
                <input
                   type="checkbox"
                   checked={task.isComplete}
                   onChange={() => handleCheckbox(task.id)}
                   className="buffer_is_Complete"
                   style={{display: 'none'}}
                 />
                {/* Custom label for the checkbox */}
                 <label
                   className="custom-checkbox"
                   onClick={() => handleCheckbox(task.id)}
                   style={{backgroundColor: task.isComplete ? '#b9b9b9' : 'transparent'}}
                 ></label>
                    
              {/* Edit and Delete buttons */}
                  <div className="edit_panel">
                      <button className="edit_button delete" onClick={() => rowDeletion(task.id)} style={{display: task.display_none ? 'none' : 'block'}}>Delete</button>
                  </div> 

              </div>
            ))}
            </div>
        </div>
      </div>

    </>
  );
}

// Allows the TaskForm component to be imported into other files
export default TaskForm;
