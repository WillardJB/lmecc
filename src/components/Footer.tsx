import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} LMECC Cooperative. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
