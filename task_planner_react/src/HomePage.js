import React from 'react';
import './index.css';
import TaskForm from './TaskForm.js';
import LogoutButton from './LogoutButton.js';

function HomePage() {
  return (
    <div className="homeBanner">
      <h1 className="h1_home">the Task Planner App</h1>
      <p>Create tasks on-the-fly</p>
      <div style={{ marginTop: "18px" }}>
        <TaskForm />
        <LogoutButton />
      </div>

    </div>
  )
}

export default HomePage;
