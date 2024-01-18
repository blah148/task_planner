import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from './services/http'; // Adjust the path according to your project structure

function Login({ setIsLoggedIn, tasks, setTasks }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform the login operation
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Ensure cookies are included with the request
    });

    if (response.ok) {
        // If the login is successful
        console.log("Login successful");
        navigate('/'); // Navigate to the home page or dashboard
    } else {
        // If the login fails, handle it accordingly
        const data = await response.json(); // Get JSON response body
        console.error("Login failed:", data.message);
        alert("Login failed: " + data.message);
        // Additional logic for failed login can be added here
    }
};

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;

