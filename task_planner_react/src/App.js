import React from 'react';
import HomePage from './HomePage';
import TaskForm from './TaskForm';
import './App.css'


function App() {
  return (
    <div className="pageContainer">
      <HomePage />
      <div style={{margin: '12px'}}></div>
      <TaskForm />
    </div>
  )
}

export default App;

