import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './headerFooter.css';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    // Function to save tasks to the database
    const saveTasksToDatabase = async (tasks) => {
        try {
            for (const task of tasks) {
                // Use the existing logic for inserting each task
                // Modify to include necessary properties from task object
                const response = await fetch('/tasks/new', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...task, 
                        // Ensure proper formatting or encryption as required
                    }),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to save task');
                }
            }
            console.log('All tasks saved successfully');
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform the login operation
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.redirectTo) {
            localStorage.setItem('guest', 'false');
            console.log("Login successful");
            navigate(data.redirectTo);

            // Check for tasks in localStorage and save them to the database
            const localTasks = JSON.parse(localStorage.getItem('tasks'));
            if (localTasks && localTasks.length > 0) {
                await saveTasksToDatabase(localTasks);
                localStorage.removeItem('tasks');
            }

        } else {
            console.error("Login failed:", data.message);
            alert("Login failed: " + data.message);
        }
    };
  return (
    <div className="bodyVertical">
      <Header />
      <div className="subHeader">
        <h1>Login</h1>
      </div>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>
            Enter email: 
            <input 
              type="email" // Set the type to email to get email-specific validations
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
        </label>
        <label>
            Set password:
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
        </label>
        <button type="submit">Login</button>
      </form>
      <Footer />
    </div>
  );
}

export default Login;

