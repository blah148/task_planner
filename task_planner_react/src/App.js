import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './1_Home';
import Register from './1_Register.js';
import TaskForm from './1_Tasks.js';
import Login from './1_Login.js';
import TermsAndConditions from './1_Terms-and-Conditions';
import PrivacyPolicy from './1_Privacy-Policy';
import LogoutButton from './e_button_Logout';

function App() {

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage tasks={tasks} setTasks={setTasks} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login tasks={tasks} setTasks={setTasks} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

