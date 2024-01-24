import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './headerFooter.css';
import timezones from './timezones';

function MyAccount() {
    return (
        <div className="bodyVertical">
            <Header />
            <div className="subHeader">
                <h1>My account</h1>
            </div>
            <form className="registerForm">
                {/* Add your form fields here */}
            </form>
            <Footer />
        </div>
    );
}

export default MyAccount;
