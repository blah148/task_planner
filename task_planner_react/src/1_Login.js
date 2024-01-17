import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import http from './services/http'; // Adjust the path according to your project structure



function Login({ onLoginSuccess }) {
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
        });

        const data = await response.json(); // Get JSON response body
        
        if (response.ok) {
          const retrieved_tasks = data.tasks;
        //  retrieved_tasks.forEach((task) => console.log(task));
          navigate('/', { state: { tasks_afterLogin: retrieved_tasks } });
        } else {
            console.error("Login failed:", data.message);
            alert("Login failed!");
            // Handle login failure, e.g., show error message
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

