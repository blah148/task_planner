import React from 'react';
import './headerFooter.css';

function Footer () {


  return (
    <div className="footerContainer">
      <div className="footer_higher-row">
        <div className="footer_column">
          <h2 className="footer_header">Usage</h2>
          <a href="/register" className="footer_link-item">Create account</a>
          <a href="/login" className="footer_link-item">Login</a>
          <a href="/account" className="footer_link-item">My account</a>
          <div className="footer_link-item">Logout</div>
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
