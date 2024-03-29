import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css'; 

function Menu({ setTasks }) {

  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef(); // Create a ref for the menu
  
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
        localStorage.setItem('guest', 'true');
        // Redirect to login or home page
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

    // Function to check authentication status
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/verification', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }
    };

    checkAuthentication();
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Event listener to close the menu if click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener when the menu is shown
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]); // Only re-run if showMenu changes

  return (
    <>
      <svg className="menuIcon" onClick={toggleMenu} viewBox="0 0 448 512" aria-hidden="true" focusable="false">
        <path fill="#c3c7c7" d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
      </svg>

      <div ref={menuRef} className={`menu ${showMenu ? 'show' : ''}`}>
      {isAuthenticated ? (
          <>
 <a href="/account" className="menuItem">
          <svg id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <polygon points="28.07 21 22 15 28.07 9 29.5 10.41 24.86 15 29.5 19.59 28.07 21"/>
            <path d="M22,30H20V25a5,5,0,0,0-5-5H9a5,5,0,0,0-5,5v5H2V25a7,7,0,0,1,7-7h6a7,7,0,0,1,7,7Z"/>
            <path d="M12,4A5,5,0,1,1,7,9a5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,12,2Z"/>
            <rect fill="none" id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
          </svg>
          <p className="menuLabel">My account</p>
        </a>
        <a href="/login" className="menuItem">
          <svg id="icon" viewBox="0 0 32 32">
            <path d="M26,30H14a2,2,0,0,1-2-2V25h2v3H26V4H14V7H12V4a2,2,0,0,1,2-2H26a2,2,0,0,1,2,2V28A2,2,0,0,1,26,30Z"/>
            <polygon points="14.59 20.59 18.17 17 4 17 4 15 18.17 15 14.59 11.41 16 10 22 16 16 22 14.59 20.59"/>
            <rect fill="none" id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
          </svg>
          <p className="menuLabel">Logout</p>
        </a>

                  </>
        ) : (
          <>
               <a href="/register" className="menuItem">
          <svg id="icon" viewBox="0 0 32 32">
            <polygon points="32 14 28 14 28 10 26 10 26 14 22 14 22 16 26 16 26 20 28 20 28 16 32 16 32 14"/>
            <path d="M12,4A5,5,0,1,1,7,9a5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,12,2Z" transform="translate(0 0)"/>
            <path d="M22,30H20V25a5,5,0,0,0-5-5H9a5,5,0,0,0-5,5v5H2V25a7,7,0,0,1,7-7h6a7,7,0,0,1,7,7Z" transform="translate(0 0)"/>
            <rect fill="none" id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
          </svg>
          <p className="menuLabel">Create account</p>
        </a>
        <a href="/login" className="menuItem">
          <svg id="icon" viewBox="0 0 32 32">
            <path d="M26,30H14a2,2,0,0,1-2-2V25h2v3H26V4H14V7H12V4a2,2,0,0,1,2-2H26a2,2,0,0,1,2,2V28A2,2,0,0,1,26,30Z"/>
            <polygon points="14.59 20.59 18.17 17 4 17 4 15 18.17 15 14.59 11.41 16 10 22 16 16 22 14.59 20.59"/>
            <rect fill="none" id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"/>
          </svg>
          <p className="menuLabel">Login</p>
        </a>
        </>
        )}
      </div>
    </>
  );
}

export default Menu;

