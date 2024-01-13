import React, { useState } from 'react';

function TaskForm() {
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    task_description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data); // Handle response
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

export default TaskForm;

