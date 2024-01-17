import React, { useState } from 'react';
import './index.css';
import TaskForm from './1_Tasks';
import LogoutButton from './e_button_Logout';
import LoginButton from './e_button_Login';

function HomePage({ isLoggedIn, setIsLoggedIn }) {
  
  return (
    <div className="homeBanner">
      <h1 className="h1_home">the Task Planner App</h1>
      <p>Create tasks on-the-fly</p>
      <div style={{ marginTop: "18px" }}>
        <TaskForm isLoggedIn={isLoggedIn} />
        <LoginButton />
        <LogoutButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>

    </div>
  )
}

export default HomePage;
