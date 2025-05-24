import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close menu when switching to desktop
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isMobile]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <img src={logo} alt="LMECC Logo" className="header-logo-img" />
            <div className="header-title">
              <h1>Lingayen Municipal Employees</h1>
              <h2>Credit Cooperative</h2>
            </div>
          </div>
          
          {/* Hamburger Button - Visible only on mobile */}
          <button 
            className={`hamburger-button ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="header-nav desktop-nav">
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <>
          <div 
            className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`}
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Mobile Navigation */}
          <nav className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
            <div className="mobile-nav-header">
              <div className="mobile-nav-title">
                <h3>Menu</h3>
              </div>
              <button 
                className="mobile-nav-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <span className="close-line"></span>
                <span className="close-line"></span>
              </button>
            </div>
            
            <div className="mobile-nav-content">
              <a href="#about" onClick={closeMenu}>
                <span className="nav-icon">ℹ️</span>
                About
              </a>
              <a href="#services" onClick={closeMenu}>
                <span className="nav-icon">🏦</span>
                Services
              </a>
              <a href="#team" onClick={closeMenu}>
                <span className="nav-icon">👥</span>
                Team
              </a>
              <a href="#contact" onClick={closeMenu}>
                <span className="nav-icon">📞</span>
                Contact
              </a>
            </div>
            
            <div className="mobile-nav-footer">
              <p>Lingayen Municipal Employees Credit Cooperative</p>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Header;