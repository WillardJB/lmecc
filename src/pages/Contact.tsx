import React from "react";
import "../styles/Contact.css";

const Contact: React.FC = () => {
  return (
    <section id="contact" className="section contact-section">
      <h2>Contact Us</h2>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows={5} required />
        <button type="submit">Send Message</button>
      </form>
    </section>
  );
};

export default Contact;
