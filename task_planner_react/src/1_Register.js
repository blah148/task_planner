import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './headerFooter.css';
import timezones from './timezones'; // Assuming timezones is an array of timezone strings

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [timezone, setTimezone] = useState(''); // New state for timezone
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, timezone }), // Include timezone in the payload
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            console.log("Registration successful", data);

            // Explicitly check for the redirectTo value
            if (data.redirectTo) {
                navigate(data.redirectTo);
            }
        } catch (error) {
            console.error(error.message);
            // Handle the error (show message to the user, etc.)
        }
    };  

  return (
    <div className="bodyVertical">
      <Header />
      <div className="subHeader">
        <h1>Register</h1>
      </div>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>
          Enter email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Set password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <label>
          Choose your timezone:
          <select value={timezone} onChange={e => setTimezone(e.target.value)}>
          <option value="">Select a timezone</option>
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
          </select>
        </label>
        <button type="submit">Register</button>
      </form>
      <Footer />
    </div>
  );
}

export default Register;

