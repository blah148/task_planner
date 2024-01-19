import React, { useState } from 'react';

function Register() {
    const [email, setEmail] = useState(''); // New state variable for email
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Send email instead of username
        });
        // Handle the response from the server
        if (response.ok) {
            console.log("Registration successful");
            // Redirect or update UI
        } else {
            console.error("Registration failed");
            // Show error message
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email: {/* Updated label */}
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;

