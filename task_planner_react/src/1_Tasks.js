// Imports react & the useState hook
import React, { useState, useEffect } from 'react';
import './index.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


function TaskForm({ isLoggedIn, setIsLoggedIn, tasks, setTasks }) {

  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const response = await fetch('/fetch-tasks', {
                method: 'GET',
                credentials: 'include' // Ensures that cookies are sent with the request
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.tasks);
                setTasks(data.tasks); // Update the tasks state with the fetched data
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
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLastUserInteractionTime(Date.now());
  };

  const getTimeWithOffset = (offsetMinutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + offsetMinutes); // Add the offset
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

    // Helper function to format a Date object into a "HH:mm" string
  const getTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Initializes the form state with the current time
  const [formData, setFormData] = useState({
    start_time: getTimeWithOffset(0),
    end_time: getTimeWithOffset(15),
    task_description: '',
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastUserInteractionTime > 180000) { // 180000 milliseconds = 3 minutes
        setFormData(prevFormData => ({
          ...prevFormData,
          start_time: getTimeWithOffset(0),
          end_time: getTimeWithOffset(15),
        }));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastUserInteractionTime]);

  const handleCheckbox = async (id) => {
    try {
      await axios.patch(`/tasks/toggleComplete/${id}`);
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

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  } 

  // Asynchronous function for submitting the form data
  const handleSubmit = async (e) => {
   
    //Prevents "default" form submission behaviour aka reload
    e.preventDefault();
   
    // Create values to eventually compare start & end times
    const currentDate = new Date().toDateString();
    console.log(formData.start_time);
    const startTime_string = `${currentDate} ${formData.start_time}`;
    let endTime_string = `${currentDate} ${formData.end_time}`;
    // Ensure that end-time comes after the start-time
    if (endTime_string <= startTime_string) {
      let nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      let tmrw = nextDay.toDateString();
      endTime_string = `${tmrw} ${formData.end_time}`;
    }
      
    // When handleSubmit is called, store the task details in this task object
    const taskObject = {
      start_time: startTime_string,
      end_time: endTime_string,
      task_description: formData.task_description,
      isComplete: false, // to-do tasks always begin as false
      display_none: false,
      visibility: "flex"
    };

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

    // Resets form data to have the current times
    setFormData({
      ...formData,
      start_time: getTimeWithOffset(0),
      end_time: getTimeWithOffset(15),
      task_description: '', // Clear task description as well
    });

  };
  
  return (
    <>  
      <form className = "form_create-task" onSubmit={handleSubmit}>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          className="form_field time_input start"
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          className="form_field time_input end"
        />
        <textarea
          name="task_description"
          value={formData.task_description}
          onChange={handleChange}
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
