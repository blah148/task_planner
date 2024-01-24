import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './1_Home';
import Register from './1_Register.js';
import Login from './1_Login.js';
import TermsAndConditions from './1_Terms-and-Conditions';
import PrivacyPolicy from './1_Privacy-Policy';
import MyAccount from './1_My-account';
import Desktop from './desktop-only.js';
import Mobile from './mobile-only.js';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/desktop" element={<Desktop />} />
          <Route path="/mobile" element={<Mobile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

