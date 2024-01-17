import React, { useState } from 'react';
import './index.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';

function HomePage() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    // Set 'isLoggedIn' to 'true' when the user logs-in
    setIsLoggedIn(true);
  }

  return (
    <div className="homeBanner">
      <h1 className="h1_home">the Task Planner App</h1>
      <p>Create tasks on-the-fly</p>
      <div style={{ marginTop: "18px" }}>
        <TaskForm isLoggedIn={isLoggedIn} />
        <LoginButton />
        <LogoutButton />
      </div>

    </div>
  )
}

export default HomePage;
