import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './headerFooter.css';

function Footer () {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch('/verification', {
                    method: 'GET',
                    credentials: 'include',
                });

                setIsAuthenticated(response.ok);
            } catch (error) {
                console.error('Authentication check failed:', error);
            }
        };

        checkAuthentication();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


  return (
    <div className="footerContainer">
      <div className="footer_higher-row">
        <div className="footer_column">
            <h2 className="footer_header">Usage</h2>
            {!isAuthenticated && (
                <>
                    <a href="/register" className="footer_link-item">Create account</a>
                    <a href="/login" className="footer_link-item">Login</a>
                </>
            )}
            {isAuthenticated && (
                <>
                    <a href="/account" className="footer_link-item">My account</a>
                    <div onClick={handleLogout} className="footer_link-item">Logout</div>
                </>
            )}
        </div>         
        <div className="footer_column">
          <h2 className="footer_header">Open source</h2>
          <a href="https://github.com/blah148/encrypted_task_planner" className="footer_link-item">Github</a>
          <a href="https://github.com/blah148/encrypted_task_planner/pulls" className="footer_link-item">Contribute</a>
        </div>
        <div className="footer_column">
          <h2 className="footer_header">Feedback</h2>
          <a href="https://github.com/blah148/encrypted_task_planner/issues" className="footer_link-item">Report a bug</a>
        </div>
      </div>
      <div className="footer_lower-row">
        <a href="/privacy-policy" className="footer_lower-item">Privacy policy</a>
        <a href="terms-and-conditions" className="footer_lower-item">Terms & conditions</a>
      </div>
    </div>
  );

}

export default Footer;
