import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './headerFooter.css';
import timezones from './timezones'; // Assuming timezones is an array of timezone strings

function MyAccount() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);
    const [timezone, setTimezone] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the current user data from the server
        const fetchData = async () => {
            try {
                const response = await fetch('/my-account', { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch account details');
                }
                const data = await response.json();
                setEmail(data.email);
                setTimezone(data.timezone);
                // Do not set password as it should not be retrieved from the server
            } catch (error) {
                console.error(error.message);
                // Handle fetch error (e.g., redirect to login)
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/update-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, oldPassword, password, timezone }),
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Update failed');
            }
            const data = await response.json();

            setShowUpdateAlert(true);
            setTimeout(() => setShowUpdateAlert(false), 3000); // Hide
        } catch (error) {
            alert("An error occurred");
            console.error(error.message);
            // Handle update error (show message to the user, etc.)
        }
    };

    return (
        <div className="bodyVertical">
            <Header />
            {showUpdateAlert && (
                <div className="updateAlert">
                    Account updated successfully!
                </div>
            )}
            <div className="subHeader">
                <h1>Account</h1>
            </div>
            <form className="registerForm" onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <label>
                    Confirm Old Password:
                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </label>
                <label>
                    New Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                    Timezone:
                    <select value={timezone} onChange={e => setTimezone(e.target.value)}>
                        <option value="">Select a timezone</option>
                        {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Update Account</button>
            </form>
            <Footer />
        </div>
    );
}

export default MyAccount;

