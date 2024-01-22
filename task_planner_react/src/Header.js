import React from 'react';
import Menu from './Menu.js';

function Header () {
  
  return (
    <div className="headerNav">
      <a href="/" className="logoText">2Dooz.Today</a>
      <Menu />
    </div>
  );
}

export default Header;
