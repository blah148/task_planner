import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setIsLoggedIn, isLoggedIn }) => {
  // const navigate = useNavigate();

  useEffect(() => {
    console.log(`isLoggedIn updated: ${isLoggedIn}`);
  }, [isLoggedIn]); // This useEffect will run when isLoggedIn changes

  const handleLogout = () => {
    console.log("Logout clicked");

    setIsLoggedIn(!isLoggedIn); // Toggle isLoggedIn state
    document.cookie = 'token=; Max-Age=0';
    document.cookie = 'user_id=; Max-Age=0';

    if (!document.cookie.includes('token=')) {
      alert("Logout successful.. e_button_Logout.js");
      // navigate('/');
    } else {
      alert("Logout failed.. e_button_Logout.js");
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;

