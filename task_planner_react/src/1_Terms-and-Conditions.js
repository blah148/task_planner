import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './headerFooter.css';

function TermsAndConditions() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="bodyVertical">
      <Header />
      <div className="subHeader">
        <h1>Terms and Conditions</h1>
        <div className="subtitle">Last updated: 22 January 2024</div>
      </div>
      <div className="writtenBodyContent" >
        <h2>1. General</h2>
        <p>
          This application allows users to list and manage their tasks. Users can create 
          accounts to save their tasks and access them later.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate,
          complete, and current at all times. Failure to do so constitutes a breach of the
          Terms, which may result in immediate termination of your account on our Service.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default TermsAndConditions;

