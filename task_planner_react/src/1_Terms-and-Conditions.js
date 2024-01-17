import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsAndConditions() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Terms and Conditions</h1>
      <p>
        Welcome to our Task Planner App!
      </p>

      {/* Sample Terms and Conditions Text */}
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
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

        {/* Add more sections as necessary */}
      </div>

      {/* Back Button */}
      <button style={{ marginTop: '20px' }} onClick={goBack}>
        Go Back
      </button>
    </div>
  );
}

export default TermsAndConditions;

