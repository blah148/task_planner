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
import DaysCarousel from './1_Home-mobile';
import './MobileStyling.css';
import DatePicker from "react-datepicker";
import PopupButton from "./PopupButton";
import TabComponent from "./1_HomeMobileTabs";

function HomePage() {

  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [newTask, pingNewTask] = useState([false]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDone, setIsLoadingDone] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('tab1');

  console.log(`this is initially selectedDate.... ${selectedDate}`);

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

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  // Close the calendar if the user clicks outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
    if (isCalendarVisible) {
      const withinCalendarContainer = event.target.closest('.calendarContainer');
      const withinDatePicker = event.target.closest('.react-datepicker');

      if (!withinCalendarContainer || withinDatePicker) {
        // Don't close the calendar if the click is within the .react-datepicker
        return;
        }

      setIsCalendarVisible(false); // Close the calendar in other cases
    }
  };  
    // Add event listener when the component is mounted
    document.addEventListener('mousedown', handleOutsideClick);

    // Remove event listener on cleanup
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCalendarVisible]); // Only re-run the effect if isCalendarVisible changes

    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
return (
  <>
    {window.innerWidth < 768 ? (
      // Mobile View
      <div className={`mobileOnly ${isCalendarVisible ? 'showingCalendar' : ''}`}>
        <Loader isLoading={isLoading} />
        <div className="header_mobile">
          <h2 className="task_feed_title" onClick={toggleCalendar}>
            {formatDate(selectedDate)}
          </h2>
          <Menu setTasks={setTasks} />
        </div>
        {isCalendarVisible && (
          <div className="calendarContainer">
            <DatePicker
              inline
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                toggleCalendar(); // Close the calendar after a date is selected
              }}
            />
          </div>
        )}
        <DaysCarousel selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <PopupButton
          selectedDate={selectedDate}
          tasks={tasks}
          setTasks={setTasks}
          pingNewTask={pingNewTask}
        />
        <div className="tab-component">
          <div className="tab-buttons">
            <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>2 Dooz</button>
            <button onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>Finished tasks</button>
          </div>
          <div className="tab-content">
            {activeTab === 'tab1' && <div className="content">
              <TaskRetrieval timestampComparison={'start_time'} setIsLoading={setIsLoading} selectedDate={selectedDate} taskStatus={false} tasks={tasks} setTasks={setTasks} newTask={newTask} />
            </div>}
            {activeTab === 'tab2' && <div className="content">
              {/* Content for tab 2 */}
            </div>}
          </div>
        </div>
      </div>
    ) : (
      // Desktop View
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
                <TaskRetrieval timestampComparison={'start_time'} setIsLoading={setIsLoading} selectedDate={selectedDate} taskStatus={false} tasks={tasks} setTasks={setTasks} newTask={newTask} />
              </div>
              <div className="task_feed complete">
                <h2 className="task_feed_title">Completed tasks</h2>
                <TaskRetrieval setIsLoading={setIsLoadingDone} timestampComparison={'completion_date'} taskStatus={true} tasks={doneTasks} setTasks={setDoneTasks} selectedDate={selectedDate} />
              </div>
            </div>
            <Menu setTasks={setTasks} />
          </div>
          <Footer />
        </div>
      </div>
    )}
  </>
);
  
}

export default HomePage;

