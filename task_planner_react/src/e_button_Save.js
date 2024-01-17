// SaveButton.js
import React from 'react';
import axios from 'axios';

const SaveButton = ({ tasks }) => {
  const handleSaveTasks = async () => {
    try {
      await axios.post('/api/saveTasks', { tasks });
      console.log('Task post request made successfully');
      // Handle any post-save actions, like showing a success message
    } catch (error) {
      console.error('Error saving tasks:', error);
      // Handle errors, such as displaying an error message
    }
  };

  return (
    <button onClick={handleSaveTasks}>Save Tasks</button>
  );
};

export default SaveButton;

