import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './1_Home';
import Register from './1_Register.js';
import TaskForm from './1_Tasks.js';
import Login from './1_Login.js';
import TermsAndConditions from './1_Terms-and-Conditions';
import PrivacyPolicy from './1_Privacy-Policy';
import LogoutButton from './e_button_Logout';

function App() {

  const[isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/tasks" />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/tasks" element={isLoggedIn ? <TaskForm setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </Router>

   </>


  );
}

export default App;

