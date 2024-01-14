// Imports react & the useState hook
import React, { useState } from 'react';
import './index.css';

// Defines the form component, also handling its submission
function TaskForm() {
  
  // Initializes empty strings as the initial field states
    const[tasks, setTasks] = useState([]);
    const[checkboxState, setCheckbox] = useState({is_complete: "No"});
    const[deleteState, rowDeleter] = useState({display_none: '' });
    const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    task_description: '',
  });

  // Pimp: if form fields are modified, the form useState fields get modified
  const handleChange = (e) => {
    // Spread operator to acknowledge the other fields before or after the target field
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (index) => {
    setTasks(prevTasks =>
     // Using the .map() method, the inner function is applied to each item of the array
     // 2 arguments: current task of the .map() process  & its index
     prevTasks.map((task, i) =>
        // Checks if the current index being iterated through matches the target "index"
        // If false: leaves the task as-is
        // If true: it creates a new obj with all the same props of the current task, & toggles the isComplete value on/off
        i === index ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  }; // Updated state: the result of .map() is a new array where one specific task (at "index") has isComplete toggled

  function sortTasks(tasksArray) {
    return tasksArray.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  }


  const editTime = (index, field, value) => {
   const currentDate = new Date().toDateString();
   const newStartTime = `${currentDate} ${value}`;
   setTasks(prevTasks =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, [field]: newStartTime } : task
      )
    );
  }; 

  const editDescription = (index, field, value) => {
    setTasks(prevTasks =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, task_description: value } : task
      )
    );
  };


  const toggleEditMode = (index) => {
    setTasks(prevTasks => {
      // Toggle the editing state and potentially update the task
      let updatedTasks = prevTasks.map((task, i) =>
        i === index ? { ...task, isEditing: !task.isEditing } : task
      );

      // Sort the tasks if we are saving the task
      if (prevTasks[index].isEditing) {
        updatedTasks = sortTasks(updatedTasks);
      }  

      return updatedTasks;
    });
  };
  
  const rowDeletion = (index) => {
    setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
  };

  
  // Asynchronous function for submitting the form data
  const handleSubmit = async (e) => {
   
    //Prevents "default" form submission behaviour aka reload
    e.preventDefault();
   
    // Create values to eventually compare start & end times
    const currentDate = new Date().toDateString();
    const startTime_string = `${currentDate} ${formData.start_time}`;
    const endTime_string = `${currentDate} ${formData.end_time}`;
    
    // Ensure that end-time comes after the start-time
    if (endTime_string <= startTime_string) {
      alert ("Error: end-time should be later than the start-time");
      return
    }
      
    // When handleSubmit is called, store the task details in this task object
    const taskObject = {
      start_time: startTime_string,
      end_time: endTime_string,
      task_description: formData.task_description,
      isComplete: false, // to-do tasks always begin as false
      display_none: false
    };
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, taskObject];
      return sortTasks(updatedTasks);
    });

    setFormData({start_time: '', end_time: '', task_description: ''});

    try { // Make a POST request at the endpoint using JSON in req body

          // fetch(<api_endpoint>, <type of request>, <body_payload_in_json>)
          // Note: the default fetch if unspecified is a GET request
          const response = await fetch('/api/submit-task', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Turns formData obj into JSON string..
            // Difference: keys & strings in double quotes / no fcns or methods
            // If any methods are present or executable code, it's ignored
            body: JSON.stringify(formData)
          });
          // Waits for reply from the server & parses body as json 
          const data = await response.json();
          // Logs the parsed json to the console
          console.log("Client-side: post-attempt complete");

        } catch (error) {
            console.error('Error submitting form:', error);
        }
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
        <button type="submit" className="form_button submit">Submit Task</button>
      </form>

      <div className="header_task-list">
        <h2 className="header_title time">Start time</h2>
        <h2 className="header_title time">End time</h2>
        <h2 className="header_title description">Task description</h2>
      </div>
      
      <div className="buffer_container">
      <div className="buffer_task-list">
        {tasks.map((task, index) => (
          <div key={index} className="buffered_task" style={{opacity: task.isComplete ? 0.5 : 1}} >
            <div className="buffer time">{task.start_time}</div>
            <div className="buffer time">{task.end_time}</div>
            <div className="buffer description">{task.task_description}</div>
            <input
               type="checkbox"
               checked={task.isComplete}
               onChange={() => handleCheckbox(index)}
               className="buffer_is_Complete"
               style={{display: 'none'}}
             />

            {/* Custom label for the checkbox */}
             <label
               className="custom-checkbox"
               onClick={() => handleCheckbox(index)}
               style={{backgroundColor: task.isComplete ? '#b9b9b9' : 'transparent'}}
             ></label>
          </div>
        ))}
        </div>

        <div className="buffer_task-controls">
        {tasks.map((task, index) => (
          <div key={index} className="row_controls">
            {task.isEditing ? (
              <>
                <input type="form_field time_input start" value={task.start_time} onChange={(e) => editTime(index, 'start_time', e.target.value)} />
                <input type="form_field time_input end" value={task.end_time} onChange={(e) => editTime(index, 'end_time', e.target.value)} />
                <input type="form_field text_input description" value={task.task_description} onChange={(e) => editDescription(index, 'task_description', e.target.value)} />
                <button onClick={() => toggleEditMode(index)}>Save</button>
              </>
            ) : (
              <>
                <button className="form_button edit" onClick={() => toggleEditMode(index)}>Edit</button>
                <button className="form_button delete" onClick={() => rowDeletion(index)} style = {{display: task.display_none ? "none" : false }}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
      </div>

    </>
  );
}

// Allows the TaskForm component to be imported into other files
export default TaskForm;
