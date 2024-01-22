import React, {useState, useEffect} from 'react';
import './feed.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';
import Sidebar from './1_Sidebar';
import Menu from './Menu.js';
import TaskRetrievalIncomplete from './1_Task-Retrieval-Incomplete';
import Loader from './Loader';

function HomePage() {

  const [tasks, setTasks] = useState([]);
  const [newTask, pingNewTask] = useState([false]);
  const [isLoading, setIsLoading] = useState(false);
  // const [completedTasks, setCompletedTasks] = useState([]);
  
  return (
    <>
        <Sidebar />
        <div className="homeBanner">
          <Loader isLoading={isLoading} />
          <div className="task_feed incomplete" style={{ marginTop: "18px" }}>
            <TaskForm tasks={tasks} setTasks={setTasks} pingNewTask={pingNewTask} />
            <h2 className="task_feed_title">Incomplete tasks</h2>
            <TaskRetrievalIncomplete setIsLoading={setIsLoading} taskStatus={false} tasks={tasks} setTasks={setTasks} newTask={newTask} />
          </div>
          <div className="task_feed complete">
            <h2 className="task_feed_title">Completed tasks</h2>
            <TaskRetrievalIncomplete setIsLoading={setIsLoading} taskStatus={true} tasks={tasks} setTasks={setTasks} />
          </div>
        </div>
        <Menu setTasks={setTasks} />
    </>
  );
}

export default HomePage;

