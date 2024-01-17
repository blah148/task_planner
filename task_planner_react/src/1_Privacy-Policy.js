import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. This privacy policy explains how we handle and protect your personal information in relation to our Task Planner App.
      </p>

      {/* Privacy Policy Content */}
      <div style={{ textAlign: 'left', marginTop: '20px' }}>
        <h2>Secure Data Handling</h2>
        <p>
          All data transmission is secured via HTTPS. We take the security of your data very seriously and employ various measures to protect it.
        </p>

        <h2>Passwords and Authentication</h2>
        <p>
          Passwords are securely hashed and never stored in plaintext. We use secure cookies for authentication purposes to ensure the security and confidentiality of your login information.
        </p>

        <h2>Task Data Security</h2>
        <p>
          Your tasks are saved and transmitted securely using HTTPS, ensuring that your data remains private and inaccessible to unauthorized parties.
        </p>

        <h2>No Tracking or Unnecessary Cookies</h2>
        <p>
          We do not use any tracking code or cookies in our application, other than those necessary for authentication purposes. We respect your privacy and do not track your usage of the app beyond what is needed for essential functionalities.
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

export default PrivacyPolicy;

