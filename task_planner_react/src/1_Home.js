import React from 'react';
import './feed.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';
import Sidebar from './1_Sidebar';
import Menu from './Menu.js';
import TaskRetrieval from './1_Task-Retrieval';

function HomePage({ tasks, setTasks }) {
  
  return (
    <>
        <Sidebar />
        <div className="homeBanner">
          <div style={{ marginTop: "18px" }}>
            <TaskForm tasks={tasks} setTasks={setTasks} />
            <TaskRetrieval tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
        <Menu setTasks={setTasks} />
    </>
  );
}

export default HomePage;

