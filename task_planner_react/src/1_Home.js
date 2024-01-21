import React from 'react';
import './feed.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';
import Sidebar from './1_Sidebar';
import Menu from './Menu.js';
import TaskRetrievalComplete from './1_Task-Retrieval-Complete';
import TaskRetrievalIncomplete from './1_Task-Retrieval-Incomplete';

function HomePage({ tasks, setTasks, completedTasks, setCompletedTasks }) {
  
  return (
    <>
        <Sidebar />
        <div className="homeBanner">
          <div className="task_feed incomplete" style={{ marginTop: "18px" }}>
            <TaskForm tasks={tasks} setTasks={setTasks} />
            <h2 className="task_feed_title">Incomplete tasks</h2>
            <TaskRetrievalIncomplete tasks={tasks} setTasks={setTasks} />
          </div>
          <div className="task_feed complete">
            <h2 className="task_feed_title">Completed tasks</h2>
            <TaskRetrievalComplete completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} />
          </div>
        </div>
        <Menu setTasks={setTasks} />
    </>
  );
}

export default HomePage;

