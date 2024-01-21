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
          <div className="task_feed incomplete" style={{ marginTop: "18px" }}>
            <TaskForm tasks={tasks} setTasks={setTasks} />
            <h2 className="task_feed_title">Incomplete tasks</h2>
            <TaskRetrieval is_complete={true} tasks={tasks} setTasks={setTasks} />
          </div>
          <div className="task_feed complete">
            <h2 className="task_feed_title">Completed tasks</h2>
            <TaskRetrieval is_complete={false} tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
        <Menu setTasks={setTasks} />
    </>
  );
}

export default HomePage;

