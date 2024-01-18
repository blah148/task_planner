import React from 'react';
import './index.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';

function HomePage({ isLoggedIn, setIsLoggedIn, tasks, setTasks }) {
  
  return (
    <div className="homeBanner">
      <h1 className="h1_home">the Task Planner App</h1>
      <p>Create tasks on-the-fly</p>
      <div style={{ marginTop: "18px" }}>
        {/* Pass tasks and setTasks to TaskForm */}
        <TaskForm isLoggedIn={isLoggedIn} tasks={tasks} setTasks={setTasks} />
        <LoginButton />
        <LogoutButton setTasks={setTasks} />
      </div>
    </div>
  );
}

export default HomePage;

