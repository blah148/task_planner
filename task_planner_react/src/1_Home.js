import React from 'react';
import './feed.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';
import Sidebar from './1_Sidebar';
import Menu from './Menu.js';

function HomePage({ isLoggedIn, setIsLoggedIn, tasks, setTasks }) {
  
  return (
    <>
        <Sidebar />
        <div className="homeBanner">
          <div style={{ marginTop: "18px" }}>
            {/* Pass tasks and setTasks to TaskForm */}
            <TaskForm isLoggedIn={isLoggedIn} tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
        <Menu isLoggedIn={isLoggedIn} setTasks={setTasks} />
    </>
  );
}

export default HomePage;

