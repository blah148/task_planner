// Imports react & the useState hook
import React, { useState } from 'react';

// Defines the form component, also handling its submission
function TaskForm() {
  
  // Initializes empty strings as the initial field states
    const[tasks, setTasks] = useState([]);
    const[checkboxState, setCheckbox] = useState({is_complete: "No"});
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


  const handleEditChange = (index, field, value) => {
   const currentDate = new Date().toDateString();
   const newStartTime = `${currentDate} ${value}`;
   setTasks(prevTasks =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, [field]: newStartTime } : task
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
      isComplete: false // to-do tasks always begin as false
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
      <form onSubmit={handleSubmit}>
        <input
          type="time"
          name="start_time"
          value={formData.start_time}
         onChange={handleChange}
        />
        <input
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
        />
        <textarea
          name="task_description"
          value={formData.task_description}
          onChange={handleChange}
        />
        <button type="submit">Submit Task</button>
      </form>


      <div>
        {tasks.map((task, index) => (
          <div key={index} className="task" style={{opacity: task.isComplete ? 0.5 : 1}} >
            <div>Start time: {task.start_time}</div>
            <div>End time: {task.end_time}</div>
            <div>Description: {task.task_description}</div>
            <input
              type="checkbox"
              value={checkboxState.is_complete}
              onChange={() => handleCheckbox(index)}
            />
          </div>
        ))}<div>
        {tasks.map((task, index) => (
          <div key={index} className="task">
            {task.isEditing ? (
              <>
                <input type="time" value={task.start_time} onChange={(e) => handleEditChange(index, 'start_time', e.target.value)} />
                <input type="time" value={task.end_time} onChange={(e) => handleEditChange(index, 'end_time', e.target.value)} />
                <input type="text" value={task.task_description} onChange={(e) => handleEditChange(index, 'task_description', e.target.value)} />
                <button onClick={() => toggleEditMode(index)}>Save</button>
              </>
            ) : (
              <>
                <div>Start time: {task.start_time}</div>
                <div>End time: {task.end_time}</div>
                <div>Description: {task.task_description}</div>
                <button onClick={() => toggleEditMode(index)}>Edit</button>
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
