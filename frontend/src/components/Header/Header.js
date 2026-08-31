import React from 'react';
import logo from '../../assets/images/logo.png';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <h1>Ensolvers Notes Challenge</h1>
    </header>
  );
};

export default Header;