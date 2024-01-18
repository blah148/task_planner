import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setTasks }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
        // Clear client-side state
        setTasks([]);

        // Request the server to clear cookies
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include' // Ensures cookies are included
        });

        if (response.ok) {
            // Redirect to login or home page
            navigate('/login');
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;

