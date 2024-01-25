import React, { useState, useEffect } from 'react';
import './feed.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const moment = require('moment-timezone');

function TaskRetrievalGuest ({ checkboxUpdate, setCheckboxUpdate, taskStatus, tasks, setTasks, newTask, setIsLoading, selectedDate, timestampComparison }) {

  const [loadingStarted, setLoadingStarted] = useState(null);
  const [isHovering, setIsHovering] = useState({});
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    let loadingStarted = Date.now();
    setIsLoading(true);

    // Fetch tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Filter tasks based on selectedDate
    const localStartOfDay = moment(selectedDate).startOf('day');
    const localEndOfDay = moment(selectedDate).endOf('day');
    
    const filteredTasks = storedTasks.filter(task => {
      const taskStartTime = moment(task[timestampComparison]);
      return taskStartTime.isBetween(localStartOfDay, localEndOfDay, undefined, '[]'); // Inclusive range
    });

    setTasks(filteredTasks);
    sortTasks(filteredTasks);

    // Handling the loading state
    const loadingDuration = Date.now() - loadingStarted;
    const minLoadingTime = 600;
    if (loadingDuration < minLoadingTime) {
      setTimeout(() => setIsLoading(false), minLoadingTime - loadingDuration);
    } else {
      setIsLoading(false);
    }
  }, [checkboxUpdate, newTask, selectedDate]);

    const getBackgroundColor = (taskId, taskStatus) => {
        if (taskStatus) {
            return isHovering[taskId] ? 'transparent' : '#1cc5cb';
        } else {
            return isHovering[taskId] ? '#1cc5cb' : 'transparent';
        }
    };

const handleCheckbox = id => {
  // Retrieve tasks from localStorage
  const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Update the isComplete status of the task with the given id
  // and set completion_date if isComplete is being set to true
  const updatedTasks = localTasks.map(task => {
    if (task.id === id) {
      const updatedTask = {
        ...task, 
        isComplete: !task.isComplete
      };

      if (!task.isComplete) {
        updatedTask.completion_date = new Date().toISOString();
      }

      return updatedTask;
    } 
    return task;
  });

  // Save the updated tasks back to localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Update the state to reflect the changes
  setTasks(updatedTasks);

  // Trigger any additional updates if required
  setCheckboxUpdate(prev => !prev);
};

    useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function sortTasks(tasksArray) {
    return tasksArray.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }
  
const rowDeletion = id => {
  // Record start time of loading
  let loadingStarted = Date.now();
  setIsLoading(true);

  // Retrieve tasks from localStorage
  const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Filter out the task with the given id
  const updatedTasks = localTasks.filter(task => task.id !== id);

  // Save the updated tasks array back to localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));

  // Update the state to reflect the changes
  setTasks(updatedTasks);

  // Calculate loading duration and update loading state appropriately
  const loadingDuration = Date.now() - loadingStarted;
  const minLoadingTime = 450;
  if (loadingDuration < minLoadingTime) {
    setTimeout(() => setIsLoading(false), minLoadingTime - loadingDuration);
  } else {
    setIsLoading(false);
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
        {tasks.filter(task => task.isComplete === taskStatus).map((task, index) => {
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
                  {isMobileView ? (
                  // Mobile label
                  <label
                    className="custom-checkbox"
                    onClick={() => handleCheckbox(task.id)}
                    onMouseEnter={() => setIsHovering({ ...isHovering, [task.id]: true })}
                    onMouseLeave={() => setIsHovering({ ...isHovering, [task.id]: false })}
                    style={{ backgroundColor: getBackgroundColor(task.id, taskStatus) }}
                  ></label>
                ) : (
                  // Desktop label
                  <label
                    className={`custom-checkbox ${taskStatus ? 'task-complete' : 'task-incomplete'}`}
                    onClick={() => handleCheckbox(task.id)}
                    style={{ backgroundColor: taskStatus === false ? 'transparent' : '#1cc5cb' }}
                  ></label>
                )}
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

export default TaskRetrievalGuest;


