import React, { useState, useEffect } from 'react';
import './feed.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskRetrieval({ checkboxUpdate, setCheckboxUpdate, taskStatus, tasks, setTasks, newTask, setIsLoading, selectedDate, timestampComparison }) {

  const [loadingStarted, setLoadingStarted] = useState(null);
  const [isHovering, setIsHovering] = useState({});
  const [tempStyle, setTempStyle] = useState({});

  useEffect(() => {
  let loadingStarted; // Define loadingStarted in the higher scope

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      loadingStarted = Date.now(); // Assign a value to loadingStarted
      const response = await fetch(`/fetch-tasks/${timestampComparison}/${selectedDate}`, {
        method: 'GET',
        credentials: 'include' // Ensures that cookies are sent with the request
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks); // Update the tasks state with the fetched data
        sortTasks(data.tasks); // Make sure you have the sortTasks function defined
      } else {
        console.error('Failed to fetch tasks');
        // Handle failure to fetch tasks here
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Handle errors in fetching tasks here
    } finally {
      const loadingDuration = Date.now() - loadingStarted;
      const minLoadingTime = 600;
      if (loadingDuration < minLoadingTime) {
        setTimeout(() => setIsLoading(false), minLoadingTime - loadingDuration);
      } else {
        setIsLoading(false);
      }
    }
  };

  fetchTasks();
}, [checkboxUpdate, newTask, selectedDate]);

    const getBackgroundColor = (taskId, taskStatus) => {
        if (taskStatus) {
            return isHovering[taskId] ? 'transparent' : '#1cc5cb';
        } else {
            return isHovering[taskId] ? '#1cc5cb' : 'transparent';
        }
    };

  const handleCheckbox = async id => {
    try {
      const response = await axios.patch(`/tasks/toggleComplete/${id}`);
      if (response.status === 200) {
        setTasks(prevTasks =>
          prevTasks.map(item =>
            item.id === id ? { ...item, isComplete: response.data.isComplete } : item
          )
        );

        setCheckboxUpdate(prev => !prev);
      }
    } catch (error) {
      console.error('Error toggling is_complete', error);
    }
  };

  function sortTasks(tasksArray) {
    return tasksArray.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }
  
  const rowDeletion = async (id) => {
    let loadingStarted = Date.now();  // Record start time of loading
    setIsLoading(true);  // Set loading state to true

    try {
      const response = await axios.delete(`/tasks/delete/${id}`);
      if (response.status === 200) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
      // Handle other response statuses if needed
    } catch (error) {
      console.error('Error deleting task:', error);
      // Handle errors in deleting task
    } finally {
      const loadingDuration = Date.now() - loadingStarted;
      const minLoadingTime = 450;
      if (loadingDuration < minLoadingTime) {
        setTimeout(() => setIsLoading(false), minLoadingTime - loadingDuration);
      } else {
        setIsLoading(false);
      }
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

    return `${hours}:${minutesStr} ${ampm}`;
  }

  return (
    <div className="task_table">
      <div className="buffer_task-list">
        {tasks.filter(task => task.is_complete === taskStatus).map((task, index) => {
            return (
              <div
                key={task.id}
                className="row_item buffered_task"
                style={{ opacity: task.is_complete === true ? 0.6 : 1}}
              > 
                <div className="columnsContainer">
                  <input
                    type="checkbox"
                    checked={task.isComplete}
                    onChange={() => handleCheckbox(task.id)}
                    className="buffer_is_Complete"
                  />
                    <label
                        key={task.id}
                        className="custom-checkbox"
                        onClick={() => handleCheckbox(task.id)}
                        onMouseEnter={() => setIsHovering({ ...isHovering, [task.id]: true })}
                        onMouseLeave={() => setIsHovering({ ...isHovering, [task.id]: false })}
                        style={{ backgroundColor: getBackgroundColor(task.id, taskStatus) }}
                    ></label>
                  <div className="taskInformation">
                    <div className="buffer description">{task.task_description}</div>  
                    <div className="bottomRow">
                      <div className="buffer time">
                        {convertIsoTo12HourFormat(task.start_time)}
                      </div>
                      <div className="timespan"> to </div>
                      <div className="buffer time">
                        {convertIsoTo12HourFormat(task.end_time)}
                      </div>
                      <button
                        className="edit_button delete"
                        onClick={() => rowDeletion(task.id)}
                        >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}

export default TaskRetrieval;

