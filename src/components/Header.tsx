import React from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="LMECC Logo" className="header-logo-img" />
          <div className="header-title">
            <h1>Lingayen Municipal Employees</h1>
            <h2>Credit Cooperative</h2>
          </div>
        </div>
        <nav className="header-nav">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#team">Team</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
