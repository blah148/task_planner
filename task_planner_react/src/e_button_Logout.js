import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT or session data from storage
    console.log("Logout clicked");
    localStorage.removeItem('token');
    console.log("Token after logout:", localStorage.getItem('token'));
    // If using cookies, uncomment the next line
    // document.cookie = 'jwt=; Max-Age=0';

    // Redirect to login or home page
    navigate('/');
    if(localStorage.getItem('token')===null) {
      alert('You have successfully logged out!');
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;

