import React, { useState, useEffect } from 'react';
import './feed.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TaskRetrieval({ tasks, setTasks }) {
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/fetchtasks', {
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
      }
    };

    fetchTasks();
  }, []); // The empty dependency array ensures this runs only once on component mount

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
      setTasks(tasks.filter((task) => task.id !== id));
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

    return `${month} ${day}, ${year} ${hours}:${minutesStr} ${ampm}`;
  }

  return (
    <div className="task_table">
      <div className="header_task-list">
        <h2 className="header_title time">Start time</h2>
        <h2 className="header_title time">End time</h2>
        <h2 className="header_title description">Task description</h2>
      </div>

      <div className="buffer_container">
        <div className="buffer_task-list">
          {tasks.map((task, index) => {
            if (!task.is_complete) {
              return (
                <div
                  key={index}
                  className="row_item buffered_task"
                  style={{
                    opacity: task.isComplete ? 0.5 : 1,
                    display: "flex"
                  }}
                >
                  <div className="buffer time">
                    {convertIsoTo12HourFormat(task.start_time)}
                  </div>
                  <div className="buffer time">
                    {convertIsoTo12HourFormat(task.end_time)}
                  </div>
                  <div className="buffer description">{task.task_description}</div>
                  <input
                    type="checkbox"
                    checked={task.isComplete}
                    onChange={() => handleCheckbox(task.id)}
                    className="buffer_is_Complete"
                    style={{ display: 'none' }}
                  />
                  {/* Custom label for the checkbox */}
                  <label
                    className="custom-checkbox"
                    onClick={() => handleCheckbox(task.id)}
                    style={{ backgroundColor: task.isComplete ? '#b9b9b9' : 'transparent' }}
                  ></label>

                  {/* Edit and Delete buttons */}
                  <div className="edit_panel">
                    <button
                      className="edit_button delete"
                      onClick={() => rowDeletion(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
            return null; // Don't render if task is complete
          })}
        </div>
      </div>
    </div>
  );
}

export default TaskRetrieval;

