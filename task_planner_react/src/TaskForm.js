// Imports react & the useState hook
import React, { useState, useEffect } from 'react';
import './index.css';

// Defines the form component, also handling its submission
function TaskForm() {
  
  // Initializes empty strings as the initial field states
    const[tasks, setTasks] = useState([]);

    useEffect(() => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        try {
          // Parse the saved tasks and sort them
          const loadedTasks = JSON.parse(savedTasks);
          const sortedTasks = sortTasks(loadedTasks);
          setTasks(sortedTasks);
        } catch (e) {
          console.error("Error reading tasks from localStorage:", e);
          // Handle the error or reset the localStorage item if necessary
        }
      }
    }, []);


    const[hideCompletedTasks, setHideCompletedTasks] = useState(false);
  
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
        const currentTime = new Date();
        const endTime = new Date(currentTime.getTime() + 15 * 60000); // 15 minutes ahead

        setFormData(prevFormData => ({
          ...prevFormData,
          start_time: getTime(currentTime),
          end_time: getTime(endTime),
        }));
      }, 60000); // Update every minute

      // Clear the interval when the component is unmounted
      return () => clearInterval(interval);
    }, []);

  // Pimp: if form fields are modified, the form useState fields get modified
  const handleChange = (e) => {
    // Spread operator to acknowledge the other fields before or after the target field
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleCheckbox = (index) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map((task, i) =>
        i === index ? { ...task, isComplete: !task.isComplete } : task
      );
      // Save updated tasks to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  };

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
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter((_, i) => i !== index);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save updated tasks to localStorage
      return updatedTasks;
    });
  };


  const convert12hr = fullDate => {
    // i) Parse the 24-hr time in hh:mm format.. 5 chars
    let time_24hr = fullDate.slice(-5);
    if (time_24hr.substr(0,2) > 12) {
      return `${time_24hr.substr(0,2) - 12}:${fullDate.slice(-2)} pm`;
    } else return `${fullDate.slice(-5)} am`;
  }

  const modify_taskVisibility = () => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.isComplete ? {...task, visibility: "none"} : {...task, visibility: "flex"} 
      )
    );
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
      display_none: false,
      visibility: "flex"
    };
    
    setTasks(prevTasks => {
      const updatedTasks = [...prevTasks, taskObject];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save new task
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
        <button type="submit" className="form_button submit">Add task</button>
      </form>
      
      <div className="completedTasks">
        <label
          type="checkbox" 
          className="view_completed-tasks_label"
          for="completion" >View completed tasks</label>
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
                <div className="buffer time">{convert12hr(task.start_time.slice(-5))}</div>
                <div className="buffer time">{convert12hr(task.end_time.slice(-5))}</div>
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
                    
              {/* Edit and Delete buttons */}
              {task.isEditing ? (
                <>
                  <input type="time" className="form_field time_input start" value={task.start_time} onChange={(e) => editTime(index, 'start_time', e.target.value)} />
                  <input type="time" className="form_field time_input end" value={task.end_time} onChange={(e) => editTime(index, 'end_time', e.target.value)} />
                  <input type="text" className="form_field text_input description" value={task.task_description} onChange={(e) => editDescription(index, 'task_description', e.target.value)} />
                  <button onClick={() => toggleEditMode(index)}>Save</button>
                </>
                ) : (
                <>
                  <div className="edit_panel">
                      <button className="edit_button edit" onClick={() => toggleEditMode(index)}>Edit</button>
                      <button className="edit_button delete" onClick={() => rowDeletion(index)} style={{display: task.display_none ? 'none' : 'block'}}>Delete</button>
                  </div> 
                </>
              )}

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
