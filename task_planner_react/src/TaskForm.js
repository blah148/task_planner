// Imports react & the useState hook
import React, { useState } from 'react';

// Defines the form component, also handling its submission
function TaskForm() {
  
  // Initializes empty strings as the initial field states
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    task_description: ''
  });

  // Pimp: if form fields are modified, the form useState fields get modified
  const handleChange = (e) => {
    // Spread operator to acknowledge the other fields before or after the target field
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Asynchronous function for submitting the form data
  const handleSubmit = async (e) => {
    //Prevents "default" form submission behaviour aka reload
    e.preventDefault();
    const currentDate = new Date().toDateString();
    const startTime_string = `${currentDate} ${formData.start_time}`;
    const endTime_string = `${currentDate} ${formData.end_time}`;
    console.log("Start: Date format log test");
    console.log(startTime_string);
    console.log(endTime_string);
    if (endTime_string > startTime_string) {
      console.log("Time order is correct");
    }
    else {
      console.log("Time order is incorrect!");
    }

    console.log("End: Date format log test");
  
    if (endTime_string <= startTime_string) {
      alert ("Error: end-time should be later than the start-time");
      return;
    
     }

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
  );
}

// Allows the TaskForm component to be imported into other files
export default TaskForm;

