import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
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
            body: JSON.stringify({ email, password }), // Send email instead of username
            credentials: 'include' // Ensure cookies are included with the request
        });

        if (response.ok) {
            // If the login is successful
            console.log("Login successful");
            setIsLoggedIn(true); // Update the login state
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
                    Email: {/* Updated label */}
                    <input 
                        type="email" // Set the type to email to get email-specific validations
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;

