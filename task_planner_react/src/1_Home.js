import React, {useState, useEffect} from 'react';
import './feed.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';
import Sidebar from './1_Sidebar';
import Menu from './Menu.js';
import TaskRetrieval from './1_Task-Retrieval';
import Loader from './Loader';
import Footer from './Footer';

function HomePage() {

  const [tasks, setTasks] = useState([]);
  const [newTask, pingNewTask] = useState([false]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Formatting the date to remove the time part
  const dateToCompare = new Date(date.setHours(0, 0, 0, 0));
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  if (dateToCompare.getTime() === today.getTime()) {
    return "Today";
  } else if (dateToCompare.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else if (dateToCompare.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    // Return formatted date for other cases
    return dateToCompare.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  }
};
console.log("test to see how many times this renders extra");
  
  return (
    <>
      <div className="desktopOnly">
        <Sidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <div className="feedContainer_Major">
          <div className="feedContainer">
            <div className="taskTools">
              <Loader isLoading={isLoading} />
              <TaskForm selectedDate={selectedDate} tasks={tasks} setTasks={setTasks} pingNewTask={pingNewTask} />
              <div className="task_feed incomplete" style={{ marginTop: "18px" }}>
                <h2 className="task_feed_title">
                  {formatDate(selectedDate)}
                </h2>
                <TaskRetrieval timestampComparison={'start_time'}setIsLoading={setIsLoading} selectedDate={selectedDate} taskStatus={false} tasks={tasks} setTasks={setTasks} newTask={newTask} />
              </div>
              <div className="task_feed complete">
                <h2 className="task_feed_title">Completed tasks</h2>
              </div>
            </div>
            <Menu setTasks={setTasks} />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default HomePage;

